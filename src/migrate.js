const fs = require('fs/promises');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('./config/env');

const DIRETORIO_MIGRATIONS = path.resolve(__dirname, '..', 'migrations');

// Evita injeção de SQL no nome do banco, já que ele não pode ser passado
// como parâmetro em CREATE DATABASE.
function validarNomeDoBanco(nome) {
  if (!/^[A-Za-z0-9_]+$/.test(nome)) {
    throw new Error(
      `Nome de banco inválido em DB_NAME: "${nome}". Use apenas letras, números e underline.`
    );
  }
  return nome;
}

async function garantirBancoDeDados() {
  const nome = validarNomeDoBanco(config.db.database);

  // Conecta sem selecionar um banco para poder criá-lo caso não exista.
  const conexao = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    multipleStatements: true,
  });

  try {
    await conexao.query(
      `CREATE DATABASE IF NOT EXISTS \`${nome}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
  } finally {
    await conexao.end();
  }
}

async function aplicarMigrations() {
  await garantirBancoDeDados();

  const conexao = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    multipleStatements: true,
    charset: 'utf8mb4',
  });

  try {
    // Tabela de controle: registra quais migrations já foram executadas.
    await conexao.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        nome VARCHAR(255) NOT NULL,
        executada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uk_migrations_nome (nome)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    const arquivos = (await fs.readdir(DIRETORIO_MIGRATIONS))
      .filter((arquivo) => arquivo.toLowerCase().endsWith('.sql'))
      .sort();

    const [linhas] = await conexao.query('SELECT nome FROM migrations');
    const jaAplicadas = new Set(linhas.map((linha) => linha.nome));

    let quantidade = 0;

    for (const arquivo of arquivos) {
      if (jaAplicadas.has(arquivo)) {
        continue;
      }

      const sql = await fs.readFile(path.join(DIRETORIO_MIGRATIONS, arquivo), 'utf8');

      console.log(`[migration] Aplicando ${arquivo}...`);
      await conexao.query(sql);
      await conexao.query('INSERT INTO migrations (nome) VALUES (?)', [arquivo]);
      console.log(`[migration] ${arquivo} aplicada com sucesso.`);
      quantidade += 1;
    }

    if (quantidade === 0) {
      console.log('[migration] Banco de dados já está atualizado.');
    } else {
      console.log(`[migration] ${quantidade} migration(s) aplicada(s).`);
    }
  } finally {
    await conexao.end();
  }
}

if (require.main === module) {
  aplicarMigrations()
    .then(() => process.exit(0))
    .catch((erro) => {
      console.error('[migration] Falha ao aplicar as migrations:', erro.message);
      process.exit(1);
    });
}

module.exports = { aplicarMigrations };

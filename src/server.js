const app = require('./app');
const config = require('./config/env');
const pool = require('./db');
const { aplicarMigrations } = require('./migrate');

async function iniciar() {
  try {
    // A migration é executada automaticamente antes de a API começar
    // a aceitar requisições.
    console.log('[startup] Verificando migrations...');
    await aplicarMigrations();

    const servidor = app.listen(config.porta, () => {
      console.log(`[startup] API rodando em http://localhost:${config.porta}`);
    });

    const encerrar = async (sinal) => {
      console.log(`\n[shutdown] Recebido ${sinal}. Encerrando...`);
      servidor.close(async () => {
        await pool.end();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => encerrar('SIGINT'));
    process.on('SIGTERM', () => encerrar('SIGTERM'));
  } catch (erro) {
    console.error('[startup] Não foi possível iniciar a API:', erro.message);
    process.exit(1);
  }
}

iniciar();

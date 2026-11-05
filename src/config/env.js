const path = require('path');

// Carrega o .env que fica na raiz do projeto, independentemente de onde o
// processo foi iniciado.
require('dotenv').config({
  path: path.resolve(__dirname, '..', '..', '.env'),
});

function obrigatoria(nome) {
  const valor = process.env[nome];
  if (valor === undefined || valor === '') {
    throw new Error(`Variável de ambiente obrigatória não definida: ${nome}`);
  }
  return valor;
}

const config = {
  porta: Number(process.env.PORT || 3000),
  db: {
    host: obrigatoria('DB_HOST'),
    port: Number(process.env.DB_PORT || 3306),
    user: obrigatoria('DB_USER'),
    password: process.env.DB_PASSWORD || '',
    database: obrigatoria('DB_NAME'),
  },
  jwt: {
    secret: obrigatoria('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
};

module.exports = config;

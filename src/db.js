const mysql = require('mysql2/promise');
const config = require('./config/env');

// Pool de conexões utilizado pelas rotas da API.
// Todos os dados de conexão vêm do arquivo .env (veja src/config/env.js).
const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  decimalNumbers: true,
});

module.exports = pool;

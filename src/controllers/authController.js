const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const config = require('../config/env');

// Hash usado apenas para manter o tempo de resposta parecido quando o e-mail
// não existe (evita descobrir quais e-mails estão cadastrados pelo tempo).
const HASH_FICTICIO = '$2a$10$abcdefghijklmnopqrstuuJ1yZ8Yx5V7Jx0M4o1D9bYc1uJcQeG';

async function login(req, res) {
  const { email, senha } = req.body || {};

  if (typeof email !== 'string' || typeof senha !== 'string' || !email.trim() || !senha) {
    return res.status(400).json({ erro: 'Informe e-mail e senha.' });
  }

  const [linhas] = await pool.execute(
    'SELECT id, nome, email, senha FROM clientes WHERE email = ?',
    [email.trim().toLowerCase()]
  );

  const cliente = linhas[0];
  const senhaCorreta = await bcrypt.compare(senha, cliente ? cliente.senha : HASH_FICTICIO);

  if (!cliente || !senhaCorreta) {
    return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
  }

  const token = jwt.sign(
    { id: cliente.id, email: cliente.email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  return res.json({
    token,
    tipo: 'Bearer',
    expira_em: config.jwt.expiresIn,
    cliente: {
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
    },
  });
}

module.exports = { login };

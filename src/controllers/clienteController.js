const bcrypt = require('bcryptjs');
const pool = require('../db');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TAMANHO_MINIMO_SENHA = 6;

async function criarCliente(req, res) {
  const { nome, email, senha } = req.body || {};

  if (typeof nome !== 'string' || nome.trim().length < 3) {
    return res.status(400).json({ erro: 'O nome deve ter pelo menos 3 caracteres.' });
  }

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ erro: 'Informe um e-mail válido.' });
  }

  if (typeof senha !== 'string' || senha.length < TAMANHO_MINIMO_SENHA) {
    return res.status(400).json({
      erro: `A senha deve ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres.`,
    });
  }

  const nomeNormalizado = nome.trim();
  const emailNormalizado = email.trim().toLowerCase();
  const senhaHash = await bcrypt.hash(senha, 10);

  try {
    const [resultado] = await pool.execute(
      'INSERT INTO clientes (nome, email, senha) VALUES (?, ?, ?)',
      [nomeNormalizado, emailNormalizado, senhaHash]
    );

    return res.status(201).json({
      id: resultado.insertId,
      nome: nomeNormalizado,
      email: emailNormalizado,
    });
  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'Já existe um cliente cadastrado com este e-mail.' });
    }
    throw erro;
  }
}

async function obterPerfil(req, res) {
  const [linhas] = await pool.execute(
    'SELECT id, nome, email, criado_em FROM clientes WHERE id = ?',
    [req.usuario.id]
  );

  if (linhas.length === 0) {
    return res.status(404).json({ erro: 'Cliente não encontrado.' });
  }

  return res.json(linhas[0]);
}

module.exports = { criarCliente, obterPerfil };

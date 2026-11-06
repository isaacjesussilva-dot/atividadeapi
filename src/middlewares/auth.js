const jwt = require('jsonwebtoken');
const config = require('../config/env');

// Middleware que exige o header "Authorization: Bearer <token>".
function autenticar(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ erro: 'Token de autenticação não informado.' });
  }

  const [esquema, token] = header.split(' ');

  if (!/^Bearer$/i.test(esquema) || !token) {
    return res.status(401).json({
      erro: 'Formato do token inválido. Use: Authorization: Bearer <token>.',
    });
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret);
    const id = Number(payload.id ?? payload.sub);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(401).json({ erro: 'Token inválido.' });
    }

    req.usuario = { id, email: payload.email };
    return next();
  } catch (erro) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

module.exports = autenticar;

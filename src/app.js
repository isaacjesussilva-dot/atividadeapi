const express = require('express');
const cors = require('cors');

const clienteRoutes = require('./routes/clienteRoutes');
const authRoutes = require('./routes/authRoutes');
const produtoRoutes = require('./routes/produtoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensagem: 'API de clientes e produtos com autenticação JWT.',
    rotas: [
      'POST /cliente',
      'POST /login',
      'GET /cliente/perfil (requer Bearer token)',
      'GET /produto',
      'POST /produto (requer Bearer token)',
    ],
  });
});

app.use('/cliente', clienteRoutes);
app.use('/login', authRoutes);
app.use('/produto', produtoRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// Middleware central de erros.
app.use((erro, req, res, next) => {
  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição.' });
  }

  if (erro.status && erro.status >= 400 && erro.status < 500) {
    return res.status(erro.status).json({ erro: erro.message });
  }

  console.error(erro);
  return res.status(500).json({ erro: 'Erro interno do servidor.' });
});

module.exports = app;

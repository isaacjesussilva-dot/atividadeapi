const express = require('express');
const { criarCliente, obterPerfil } = require('../controllers/clienteController');
const autenticar = require('../middlewares/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// POST /cliente
router.post('/', asyncHandler(criarCliente));

// GET /cliente/perfil (rota protegida por JWT)
router.get('/perfil', autenticar, asyncHandler(obterPerfil));

module.exports = router;

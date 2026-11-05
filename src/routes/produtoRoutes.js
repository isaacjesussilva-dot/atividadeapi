const express = require('express');
const { listarProdutos, criarProduto } = require('../controllers/produtoController');
const autenticar = require('../middlewares/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// GET /produto
// Filtros: nome, categoria, preco_min, preco_max, ordenar/ordem e pagina.
router.get('/', asyncHandler(listarProdutos));

// POST /produto (extra, protegido por JWT, para cadastrar novos produtos)
router.post('/', autenticar, asyncHandler(criarProduto));

module.exports = router;

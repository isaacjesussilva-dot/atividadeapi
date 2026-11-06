const express = require('express');
const {
  listarProdutos,
  listarFiltros,
  criarProduto,
} = require('../controllers/produtoController');
const autenticar = require('../middlewares/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// GET /produto/filtros
// Categorias disponíveis e faixa de preço do catálogo.
router.get('/filtros', asyncHandler(listarFiltros));

// GET /produto
// Filtros: nome, categoria, preco_min, preco_max, ordenar e pagina.
// A quantidade por página é fixa em 10 (ver produtoController.js).
router.get('/', asyncHandler(listarProdutos));

// POST /produto (extra, protegido por JWT, para cadastrar novos produtos)
router.post('/', autenticar, asyncHandler(criarProduto));

module.exports = router;

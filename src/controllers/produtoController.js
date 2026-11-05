const pool = require('../db');

// Quantidade fixa de produtos por página.
const LIMITE_POR_PAGINA = 10;

function converterPreco(valor, nomeParametro) {
  if (valor === undefined || valor === '') {
    return null;
  }

  const numero = Number(String(valor).replace(',', '.'));

  if (!Number.isFinite(numero) || numero < 0) {
    const erro = new Error(`${nomeParametro} deve ser um número maior ou igual a zero.`);
    erro.status = 400;
    throw erro;
  }

  return numero;
}

function converterPagina(valor) {
  if (valor === undefined || valor === '') {
    return 1;
  }

  const pagina = Number(valor);

  if (!Number.isInteger(pagina) || pagina < 1) {
    const erro = new Error('pagina deve ser um número inteiro maior ou igual a 1.');
    erro.status = 400;
    throw erro;
  }

  return pagina;
}

function montarOrdenacao(valor) {
  const ordem = String(valor || '').trim().toLowerCase();

  if (['asc', 'menor', 'menor_preco', 'preco_asc'].includes(ordem)) {
    return 'ORDER BY preco ASC, id ASC';
  }

  if (['desc', 'maior', 'maior_preco', 'preco_desc'].includes(ordem)) {
    return 'ORDER BY preco DESC, id ASC';
  }

  return 'ORDER BY id ASC';
}

async function listarProdutos(req, res) {
  const { nome, categoria, preco_min, preco_max, pagina, ordenar, ordem } = req.query;

  const condicoes = [];
  const parametros = [];

  if (typeof nome === 'string' && nome.trim()) {
    condicoes.push('nome LIKE ?');
    parametros.push(`%${nome.trim()}%`);
  }

  if (typeof categoria === 'string' && categoria.trim()) {
    condicoes.push('LOWER(categoria) = ?');
    parametros.push(categoria.trim().toLowerCase());
  }

  const precoMinimo = converterPreco(preco_min, 'preco_min');
  const precoMaximo = converterPreco(preco_max, 'preco_max');

  if (precoMinimo !== null && precoMaximo !== null && precoMinimo > precoMaximo) {
    return res.status(400).json({ erro: 'preco_min não pode ser maior que preco_max.' });
  }

  if (precoMinimo !== null) {
    condicoes.push('preco >= ?');
    parametros.push(precoMinimo);
  }

  if (precoMaximo !== null) {
    condicoes.push('preco <= ?');
    parametros.push(precoMaximo);
  }

  const numeroPagina = converterPagina(pagina);
  const offset = (numeroPagina - 1) * LIMITE_POR_PAGINA;
  const where = condicoes.length > 0 ? `WHERE ${condicoes.join(' AND ')}` : '';
  const ordenacao = montarOrdenacao(ordenar ?? ordem);

  const [contagem] = await pool.execute(
    `SELECT COUNT(*) AS total FROM produtos ${where}`,
    parametros
  );

  const total = Number(contagem[0].total);

  const [produtos] = await pool.query(
    `SELECT id, nome, descricao, categoria, preco, estoque, criado_em
       FROM produtos
       ${where}
       ${ordenacao}
       LIMIT ? OFFSET ?`,
    [...parametros, LIMITE_POR_PAGINA, offset]
  );

  const totalPaginas = Math.ceil(total / LIMITE_POR_PAGINA);

  return res.json({
    produtos,
    paginacao: {
      pagina: numeroPagina,
      limite: LIMITE_POR_PAGINA,
      total,
      total_paginas: totalPaginas,
      tem_pagina_anterior: numeroPagina > 1,
      tem_proxima_pagina: numeroPagina < totalPaginas,
    },
    filtros: {
      nome: typeof nome === 'string' && nome.trim() ? nome.trim() : null,
      categoria: typeof categoria === 'string' && categoria.trim() ? categoria.trim().toLowerCase() : null,
      preco_min: precoMinimo,
      preco_max: precoMaximo,
      ordenar: ordenacao === 'ORDER BY preco ASC, id ASC'
        ? 'menor_preco'
        : ordenacao === 'ORDER BY preco DESC, id ASC'
          ? 'maior_preco'
          : null,
    },
  });
}

async function criarProduto(req, res) {
  const { nome, descricao, categoria, preco, estoque } = req.body || {};
  const precoNumerico = Number(String(preco).replace(',', '.'));

  if (typeof nome !== 'string' || nome.trim().length < 2) {
    return res.status(400).json({ erro: 'O nome do produto deve ter pelo menos 2 caracteres.' });
  }

  if (typeof categoria !== 'string' || !categoria.trim()) {
    return res.status(400).json({ erro: 'Informe a categoria do produto.' });
  }

  if (!Number.isFinite(precoNumerico) || precoNumerico < 0) {
    return res.status(400).json({ erro: 'Informe um preço válido.' });
  }

  const estoqueNumerico = estoque === undefined ? 0 : Number(estoque);

  if (!Number.isInteger(estoqueNumerico) || estoqueNumerico < 0) {
    return res.status(400).json({ erro: 'O estoque deve ser um número inteiro maior ou igual a zero.' });
  }

  const [resultado] = await pool.execute(
    `INSERT INTO produtos (nome, descricao, categoria, preco, estoque)
     VALUES (?, ?, ?, ?, ?)`,
    [
      nome.trim(),
      typeof descricao === 'string' && descricao.trim() ? descricao.trim() : null,
      categoria.trim().toLowerCase(),
      precoNumerico,
      estoqueNumerico,
    ]
  );

  return res.status(201).json({
    id: resultado.insertId,
    nome: nome.trim(),
    descricao: typeof descricao === 'string' && descricao.trim() ? descricao.trim() : null,
    categoria: categoria.trim().toLowerCase(),
    preco: precoNumerico,
    estoque: estoqueNumerico,
  });
}

module.exports = { listarProdutos, criarProduto, LIMITE_POR_PAGINA };

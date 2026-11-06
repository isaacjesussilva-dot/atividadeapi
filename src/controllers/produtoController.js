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

async function listarProdutos(req, res) {
  const { nome, categoria, preco_min, preco_max, ordenar, pagina } = req.query;

  const condicoes = [];
  const parametros = [];

  if (typeof nome === 'string' && nome.trim()) {
    condicoes.push('nome LIKE ?');
    parametros.push(`%${nome.trim()}%`);
  }

  if (typeof categoria === 'string' && categoria.trim()) {
    condicoes.push('categoria = ?');
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

  let ordenacao = 'ORDER BY id ASC';
  if (ordenar === 'menor_preco') {
    ordenacao = 'ORDER BY preco ASC, id ASC';
  } else if (ordenar === 'maior_preco') {
    ordenacao = 'ORDER BY preco DESC, id ASC';
  }

  const [contagem] = await pool.execute(
    `SELECT COUNT(*) AS total FROM produtos ${where}`,
    parametros
  );

  const total = Number(contagem[0].total);

  const [produtos] = await pool.query(
    `SELECT id, nome, descricao, imagem, categoria, preco, estoque, criado_em
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
      ordenar: ordenar === 'menor_preco' || ordenar === 'maior_preco' ? ordenar : null,
    },
  });
}

// Retorna as categorias e a faixa de preço para montar o filtro do site.
async function listarFiltros(req, res) {
  const [categorias] = await pool.query(
    `SELECT categoria, COUNT(*) AS total
       FROM produtos
      GROUP BY categoria
      ORDER BY categoria ASC`
  );

  const [resumo] = await pool.query(
    `SELECT COUNT(*) AS total,
            COALESCE(MIN(preco), 0) AS preco_min,
            COALESCE(MAX(preco), 0) AS preco_max
       FROM produtos`
  );

  return res.json({
    categorias: categorias.map((item) => ({
      nome: item.categoria,
      total: Number(item.total),
    })),
    faixa_preco: {
      min: Number(resumo[0].preco_min),
      max: Number(resumo[0].preco_max),
    },
    total: Number(resumo[0].total),
  });
}

async function criarProduto(req, res) {
  const { nome, descricao, categoria, preco, estoque, imagem } = req.body || {};
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
    return res.status(400).json({
      erro: 'O estoque deve ser um número inteiro maior ou igual a zero.',
    });
  }

  const descricaoNormalizada =
    typeof descricao === 'string' && descricao.trim() ? descricao.trim() : null;
  const imagemNormalizada =
    typeof imagem === 'string' && imagem.trim() ? imagem.trim() : 'img/produtos/sem-imagem.svg';

  const [resultado] = await pool.execute(
    `INSERT INTO produtos (nome, descricao, imagem, categoria, preco, estoque)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      nome.trim(),
      descricaoNormalizada,
      imagemNormalizada,
      categoria.trim().toLowerCase(),
      precoNumerico,
      estoqueNumerico,
    ]
  );

  return res.status(201).json({
    id: resultado.insertId,
    nome: nome.trim(),
    descricao: descricaoNormalizada,
    imagem: imagemNormalizada,
    categoria: categoria.trim().toLowerCase(),
    preco: precoNumerico,
    estoque: estoqueNumerico,
  });
}

module.exports = {
  listarProdutos,
  listarFiltros,
  criarProduto,
  LIMITE_POR_PAGINA,
};

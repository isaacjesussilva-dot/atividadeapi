// Quando o site é aberto como arquivo (file://), a API continua em localhost:3000.
const BASE_API = window.location.protocol === "file:" ? "http://localhost:3000" : "";

// Endereços da API
const API = {
  produtos: BASE_API + "/produto",
  filtros: BASE_API + "/produto/filtros",
  clientes: BASE_API + "/cliente",
  login: BASE_API + "/login",
};

// Chaves usadas no LocalStorage
const CHAVE_NOME = "clienteNome";
const CHAVE_TOKEN = "clienteToken";

// Estado dos filtros e da paginação
const estado = {
  pagina: 1,
  nome: "",
  categoria: "",
  precoMin: "",
  precoMax: "",
  ordenar: "",
};

// Nomes amigáveis das categorias
const nomesCategorias = {
  processador: "Processadores",
  "placa-mae": "Placas-mãe",
  memoria: "Memória RAM",
  armazenamento: "Armazenamento",
  "placa-de-video": "Placas de vídeo",
  fonte: "Fontes",
  gabinete: "Gabinetes",
  periferico: "Periféricos",
};

// Elementos da página
const areaVisitante = document.getElementById("areaVisitante");
const areaCliente = document.getElementById("areaCliente");
const nomeCliente = document.getElementById("nomeCliente");
const botaoLogin = document.getElementById("botaoLogin");
const botaoCadastro = document.getElementById("botaoCadastro");
const botaoSair = document.getElementById("botaoSair");

const formFiltros = document.getElementById("formFiltros");
const campoNome = document.getElementById("campoNome");
const campoCategoria = document.getElementById("campoCategoria");
const precoMin = document.getElementById("precoMin");
const precoMax = document.getElementById("precoMax");
const campoOrdem = document.getElementById("campoOrdem");
const botaoLimpar = document.getElementById("botaoLimpar");

const listaProdutos = document.getElementById("listaProdutos");
const mensagemVazia = document.getElementById("mensagemVazia");
const paginacao = document.getElementById("paginacao");
const resumo = document.getElementById("resumo");

const modalAuth = document.getElementById("modalAuth");
const tituloAuth = document.getElementById("tituloAuth");
const textoAuth = document.getElementById("textoAuth");
const erroAuth = document.getElementById("erroAuth");
const formLogin = document.getElementById("formLogin");
const formCadastro = document.getElementById("formCadastro");
const textoTrocaAuth = document.getElementById("textoTrocaAuth");
const botaoTrocarAuth = document.getElementById("botaoTrocarAuth");

let modoAuth = "login";

// ---------------------------------------------------------
// Funções auxiliares
// ---------------------------------------------------------

function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function nomeCategoria(categoria) {
  return nomesCategorias[categoria] || categoria;
}

async function pedir(url, opcoes = {}) {
  const resposta = await fetch(url, opcoes);

  let dados = null;
  try {
    dados = await resposta.json();
  } catch (erro) {
    dados = null;
  }

  if (!resposta.ok) {
    throw new Error((dados && dados.erro) || "Não foi possível concluir a solicitação.");
  }

  return dados;
}

// ---------------------------------------------------------
// Produtos
// ---------------------------------------------------------

async function carregarCategorias() {
  try {
    const dados = await pedir(API.filtros);

    campoCategoria.innerHTML = '<option value="">Todas as categorias</option>';

    dados.categorias.forEach(function (item) {
      const opcao = document.createElement("option");
      opcao.value = item.nome;
      opcao.textContent = nomeCategoria(item.nome) + " (" + item.total + ")";
      campoCategoria.appendChild(opcao);
    });
  } catch (erro) {
    console.error("Erro ao carregar categorias:", erro);
  }
}

async function carregarProdutos() {
  resumo.textContent = "Carregando produtos...";
  listaProdutos.innerHTML = "";
  mensagemVazia.hidden = true;
  paginacao.innerHTML = "";

  const parametros = new URLSearchParams();

  if (estado.nome) parametros.set("nome", estado.nome);
  if (estado.categoria) parametros.set("categoria", estado.categoria);
  if (estado.precoMin) parametros.set("preco_min", estado.precoMin);
  if (estado.precoMax) parametros.set("preco_max", estado.precoMax);
  if (estado.ordenar) parametros.set("ordenar", estado.ordenar);
  parametros.set("pagina", estado.pagina);

  try {
    const dados = await pedir(API.produtos + "?" + parametros.toString());
    const paginacaoApi = dados.paginacao;

    // Se a página atual não existe mais, volta para a última página.
    if (paginacaoApi.total_paginas > 0 && estado.pagina > paginacaoApi.total_paginas) {
      estado.pagina = paginacaoApi.total_paginas;
      return carregarProdutos();
    }

    mostrarProdutos(dados.produtos);
    mostrarResumo(paginacaoApi);
    montarPaginacao(paginacaoApi);
  } catch (erro) {
    resumo.textContent = "Erro ao carregar os produtos.";
    mensagemVazia.textContent = erro.message;
    mensagemVazia.hidden = false;
  }
}

function mostrarProdutos(produtos) {
  listaProdutos.innerHTML = "";

  if (produtos.length === 0) {
    mensagemVazia.hidden = false;
    return;
  }

  produtos.forEach(function (produto) {
    const card = document.createElement("article");
    card.className = "produto-card";

    const categoria = document.createElement("span");
    categoria.className = "produto-categoria";
    categoria.textContent = nomeCategoria(produto.categoria);

    const titulo = document.createElement("h3");
    titulo.textContent = produto.nome;

    const descricao = document.createElement("p");
    descricao.className = "produto-descricao";
    descricao.textContent = produto.descricao || "Sem descrição.";

    const info = document.createElement("div");
    info.className = "produto-info";

    const preco = document.createElement("strong");
    preco.className = "produto-preco";
    preco.textContent = formatarMoeda(produto.preco);

    const estoque = document.createElement("span");
    estoque.className = "produto-estoque";
    estoque.textContent =
      produto.estoque > 0 ? produto.estoque + " em estoque" : "Esgotado";

    if (produto.estoque === 0) {
      estoque.classList.add("esgotado");
    }

    info.appendChild(preco);
    info.appendChild(estoque);

    card.appendChild(categoria);
    card.appendChild(titulo);
    card.appendChild(descricao);
    card.appendChild(info);

    listaProdutos.appendChild(card);
  });
}

function mostrarResumo(paginacaoApi) {
  const total = paginacaoApi.total;

  if (total === 0) {
    resumo.textContent = "Nenhum produto encontrado.";
    return;
  }

  const inicio = (paginacaoApi.pagina - 1) * paginacaoApi.limite + 1;
  const fim = Math.min(paginacaoApi.pagina * paginacaoApi.limite, total);

  resumo.textContent = "Mostrando " + inicio + " a " + fim + " de " + total + " produtos.";
}

function montarPaginacao(paginacaoApi) {
  paginacao.innerHTML = "";

  if (paginacaoApi.total_paginas <= 1) {
    return;
  }

  const anterior = document.createElement("button");
  anterior.type = "button";
  anterior.textContent = "Anterior";
  anterior.disabled = !paginacaoApi.tem_pagina_anterior;
  anterior.addEventListener("click", function () {
    estado.pagina = estado.pagina - 1;
    carregarProdutos();
  });
  paginacao.appendChild(anterior);

  for (let numero = 1; numero <= paginacaoApi.total_paginas; numero += 1) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = numero;

    if (numero === paginacaoApi.pagina) {
      botao.classList.add("ativa");
    }

    botao.addEventListener("click", function () {
      estado.pagina = numero;
      carregarProdutos();
    });

    paginacao.appendChild(botao);
  }

  const proxima = document.createElement("button");
  proxima.type = "button";
  proxima.textContent = "Próxima";
  proxima.disabled = !paginacaoApi.tem_proxima_pagina;
  proxima.addEventListener("click", function () {
    estado.pagina = estado.pagina + 1;
    carregarProdutos();
  });
  paginacao.appendChild(proxima);
}

// ---------------------------------------------------------
// Filtros
// ---------------------------------------------------------

formFiltros.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const minimo = precoMin.value === "" ? "" : Number(precoMin.value);
  const maximo = precoMax.value === "" ? "" : Number(precoMax.value);

  if (minimo !== "" && maximo !== "" && minimo > maximo) {
    resumo.textContent = "O preço mínimo não pode ser maior que o preço máximo.";
    return;
  }

  estado.nome = campoNome.value.trim();
  estado.categoria = campoCategoria.value;
  estado.precoMin = minimo === "" ? "" : String(minimo);
  estado.precoMax = maximo === "" ? "" : String(maximo);
  estado.ordenar = campoOrdem.value;
  estado.pagina = 1;

  carregarProdutos();
});

botaoLimpar.addEventListener("click", function () {
  campoNome.value = "";
  campoCategoria.value = "";
  precoMin.value = "";
  precoMax.value = "";
  campoOrdem.value = "";

  estado.nome = "";
  estado.categoria = "";
  estado.precoMin = "";
  estado.precoMax = "";
  estado.ordenar = "";
  estado.pagina = 1;

  carregarProdutos();
});

// ---------------------------------------------------------
// Login e cadastro
// ---------------------------------------------------------

function abrirModal(modo) {
  modoAuth = modo;
  erroAuth.hidden = true;
  erroAuth.textContent = "";

  const logando = modo === "login";

  formLogin.hidden = !logando;
  formCadastro.hidden = logando;

  tituloAuth.textContent = logando ? "Entrar" : "Criar conta";
  textoAuth.textContent = logando
    ? "Acesse sua conta para continuar."
    : "Preencha os dados para criar sua conta.";
  textoTrocaAuth.textContent = logando ? "Ainda não tem conta?" : "Já tem uma conta?";
  botaoTrocarAuth.textContent = logando ? "Criar conta" : "Entrar";

  modalAuth.hidden = false;
  document.body.style.overflow = "hidden";

  if (logando) {
    document.getElementById("loginEmail").focus();
  } else {
    document.getElementById("cadastroNome").focus();
  }
}

function fecharModal() {
  modalAuth.hidden = true;
  document.body.style.overflow = "";
  formLogin.reset();
  formCadastro.reset();
  erroAuth.hidden = true;
}

function mostrarCliente(nome) {
  areaVisitante.hidden = true;
  areaCliente.hidden = false;
  nomeCliente.textContent = nome;
}

function mostrarVisitante() {
  areaVisitante.hidden = false;
  areaCliente.hidden = true;
  nomeCliente.textContent = "";
}

function guardarSessao(nome, token) {
  localStorage.setItem(CHAVE_NOME, nome);
  localStorage.setItem(CHAVE_TOKEN, token);
  mostrarCliente(nome);
}

function lerSessao() {
  const nome = localStorage.getItem(CHAVE_NOME);
  const token = localStorage.getItem(CHAVE_TOKEN);

  if (nome && token) {
    mostrarCliente(nome);
  } else {
    mostrarVisitante();
  }
}

function mostrarErroAuth(mensagem) {
  erroAuth.textContent = mensagem;
  erroAuth.hidden = false;
}

formLogin.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const senha = document.getElementById("loginSenha").value;

  if (!email || !senha) {
    mostrarErroAuth("Informe e-mail e senha.");
    return;
  }

  try {
    const dados = await pedir(API.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, senha: senha }),
    });

    guardarSessao(dados.cliente.nome, dados.token);
    fecharModal();
  } catch (erro) {
    mostrarErroAuth(erro.message);
  }
});

formCadastro.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  const nome = document.getElementById("cadastroNome").value.trim();
  const email = document.getElementById("cadastroEmail").value.trim();
  const senha = document.getElementById("cadastroSenha").value;
  const confirmar = document.getElementById("cadastroConfirmar").value;

  if (nome.length < 3) {
    mostrarErroAuth("O nome deve ter pelo menos 3 caracteres.");
    return;
  }

  if (!email) {
    mostrarErroAuth("Informe seu e-mail.");
    return;
  }

  if (senha.length < 6) {
    mostrarErroAuth("A senha deve ter pelo menos 6 caracteres.");
    return;
  }

  if (senha !== confirmar) {
    mostrarErroAuth("As senhas não conferem.");
    return;
  }

  try {
    await pedir(API.clientes, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nome, email: email, senha: senha }),
    });

    const dados = await pedir(API.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, senha: senha }),
    });

    guardarSessao(dados.cliente.nome, dados.token);
    fecharModal();
  } catch (erro) {
    mostrarErroAuth(erro.message);
  }
});

botaoSair.addEventListener("click", function () {
  localStorage.removeItem(CHAVE_NOME);
  localStorage.removeItem(CHAVE_TOKEN);
  mostrarVisitante();
});

botaoLogin.addEventListener("click", function () {
  abrirModal("login");
});

botaoCadastro.addEventListener("click", function () {
  abrirModal("cadastro");
});

botaoTrocarAuth.addEventListener("click", function () {
  abrirModal(modoAuth === "login" ? "cadastro" : "login");
});

modalAuth.addEventListener("click", function (evento) {
  if (evento.target.hasAttribute("data-fechar")) {
    fecharModal();
  }
});

document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape" && !modalAuth.hidden) {
    fecharModal();
  }
});

// ---------------------------------------------------------
// Início
// ---------------------------------------------------------

lerSessao();
carregarCategorias();
carregarProdutos();

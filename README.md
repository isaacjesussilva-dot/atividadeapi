# TechNova — API + Site de Catálogo

Projeto da atividade: uma API REST em Node.js/Express com autenticação JWT,
migrations do MySQL e um site que consome essa API com filtros, paginação,
cadastro e login.

A API fica na **raiz** do projeto e o site fica na pasta **`site/`**. O Express
serve o site na raiz (`http://localhost:3000`) e a API nos endpoints `/produto`,
`/cliente` e `/login`.

## Estrutura do projeto

```text
.
├── src/
│   ├── app.js
│   ├── server.js
│   ├── db.js
│   ├── migrate.js
│   ├── config/env.js
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   └── utils/
├── migrations/
│   ├── 001_create_tables.sql
│   └── 002_seed_produtos.sql
├── site/
│   ├── index.html
│   ├── css/styles.css
│   └── js/app.js
├── dotenv-example.txt
├── package.json
└── README.md
```

## Requisitos

- Node.js 18 ou superior
- MySQL 8

## Como configurar e executar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie o arquivo `.env` a partir do exemplo:

   ```bash
   cp dotenv-example.txt .env
   ```

3. Edite o `.env` com os dados do seu MySQL:

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=sua_senha_do_mysql
   DB_NAME=api_jwt
   JWT_SECRET=um-segredo-grande-e-aleatorio
   JWT_EXPIRES_IN=1d
   ```

4. Inicie a API:

   ```bash
   npm start
   ```

   Ao iniciar, a API executa automaticamente as migrations e cria o banco
   `api_jwt` (se ainda não existir), as tabelas e os 26 produtos de exemplo.

5. Abra o site no navegador:

   ```text
   http://localhost:3000
   ```

   Também é possível abrir o arquivo `site/index.html` diretamente, mas a API
   precisa estar rodando em `http://localhost:3000` para os produtos e o login
   funcionarem.

Para executar somente as migrations manualmente:

```bash
npm run migrate
```

## Configuração da conexão

A conexão com o MySQL fica em `src/db.js` e usa as variáveis de ambiente
carregadas de `.env` por `src/config/env.js` (`DB_HOST`, `DB_PORT`, `DB_USER`,
`DB_PASSWORD` e `DB_NAME`). O arquivo `.env` não é versionado.

## Autenticação JWT

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/cliente` | Cadastra um cliente (`nome`, `email`, `senha`). |
| `POST` | `/login` | Autentica e devolve o token JWT + dados do cliente. |
| `GET` | `/cliente/perfil` | Retorna o perfil do cliente autenticado. Exige `Authorization: Bearer <token>`. |

Exemplo de cadastro:

```bash
curl -X POST http://localhost:3000/cliente \
  -H "Content-Type: application/json" \
  -d '{"nome":"Maria Silva","email":"maria@exemplo.com","senha":"123456"}'
```

Exemplo de login:

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@exemplo.com","senha":"123456"}'
```

Exemplo de perfil autenticado:

```bash
curl http://localhost:3000/cliente/perfil \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

As senhas são armazenadas com hash `bcrypt` e o token expira conforme
`JWT_EXPIRES_IN` (padrão: `1d`).

## Rota de produtos

### `GET /produto`

Parâmetros de consulta suportados:

| Parâmetro | Descrição | Exemplo |
| --- | --- | --- |
| `nome` | Busca parcial pelo nome do produto | `nome=ryzen` |
| `categoria` | Filtra por categoria exata | `categoria=processador` |
| `preco_min` | Preço mínimo | `preco_min=200` |
| `preco_max` | Preço máximo | `preco_max=700` |
| `ordenar` | `menor_preco` ou `maior_preco` | `ordenar=menor_preco` |
| `pagina` | Página desejada (começa em 1) | `pagina=2` |

A quantidade de produtos por página é **fixa em 10**.

Exemplo combinando filtros:

```bash
curl "http://localhost:3000/produto?nome=ryzen&categoria=processador&preco_min=200&preco_max=1000&ordenar=menor_preco&pagina=1"
```

A resposta inclui os produtos e os dados da paginação:

```json
{
  "produtos": [],
  "paginacao": {
    "pagina": 1,
    "limite": 10,
    "total": 0,
    "total_paginas": 0,
    "tem_pagina_anterior": false,
    "tem_proxima_pagina": false
  },
  "filtros": {}
}
```

### `GET /produto/filtros`

Usada pelo site para montar a lista de categorias:

```bash
curl http://localhost:3000/produto/filtros
```

## Funcionalidades do site

- Lista os produtos consumindo `GET /produto`.
- Paginação com **10 produtos por página**.
- Busca por nome.
- Filtro por categoria, com a quantidade de produtos em cada uma.
- Filtro por preço mínimo e máximo.
- Ordenação por menor ou maior preço.
- Cadastro e login usando a API JWT.
- Sessão salva no `LocalStorage` com as chaves:
  - `clienteNome`
  - `clienteToken`
- Ao recarregar a página, o nome salvo continua aparecendo no cabeçalho.
- O botão **Sair** remove as duas chaves do `LocalStorage`.

## Scripts

```bash
npm start       # inicia a API e o site
npm run dev     # inicia em modo watch
npm run migrate # executa as migrations manualmente
```

## Observação

Este projeto é acadêmico. O token JWT é salvo no `LocalStorage` conforme o
enunciado da atividade. Em uma aplicação real, o ideal é usar cookies
`HttpOnly` e `Secure`.

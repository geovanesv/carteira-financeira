# Carteira Financeira API

API RESTful para gerenciamento de carteiras financeiras, desenvolvida com NestJS. Este projeto permite que usuários se autentiquem, criem e gerenciem suas carteiras, consultem saldos e realizem transações.

## 🚀 Tecnologias Utilizadas

- **NestJS**: Um framework progressivo Node.js para a construção de aplicações do lado do servidor eficientes, escaláveis e confiáveis.
- **TypeORM**: Um ORM (Object Relational Mapper) que pode ser executado em NodeJS, Browser, Cordova, PhoneGap, Ionic, React Native, NativeScript, Expo e Electron, e suporta MySQL, PostgreSQL, Microsoft SQL Server, Oracle, SAP Hana, SQLite, MariaDB, Aurora MySQL, Aurora PostgreSQL, CockroachDB e MongoDB.
- **PostgreSQL**: Sistema de gerenciamento de banco de dados objeto-relacional poderoso, de código aberto. (Assumido como o banco de dados principal, comum com TypeORM).
- **Swagger (OpenAPI)**: Para documentação interativa da API.
- **JWT (JSON Web Tokens)**: Para autenticação segura de usuários.
- **Bcrypt**: Para hashing seguro de senhas.
- **Class-validator & Class-transformer**: Para validação e transformação de dados em DTOs.

## ✨ Funcionalidades

- **Autenticação de Usuários**: Registro e login de usuários com JWT.
- **Gestão de Carteiras**:
  - Criação de carteiras para usuários.
  - Consulta do saldo da carteira.
  - Atualização do saldo (adição/remoção de valores).
- **Gestão de Transações**: (Módulo previsto, mas sem implementação detalhada no contexto fornecido)
  - Registro de transações financeiras.
  - Consulta do histórico de transações.

## 📂 Estrutura do Projeto

O projeto segue a arquitetura modular do NestJS, organizada da seguinte forma:

```
src/
├── main.ts                 # Ponto de entrada da aplicação e configuração global (Swagger, Pipes)
├── app.module.ts           # Módulo raiz da aplicação
├── config/                 # Configurações específicas (app, jwt)
│   ├── app.config.ts
│   └── jwt.config.ts
├── modules/
│   ├── auth/               # Módulo de autenticação
│   │   ├── controllers/
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── strategies/
│   │   └── use-cases/
│   ├── users/              # Módulo de usuários
│   │   ├── entities/
│   │   └── use-cases/
│   ├── wallets/            # Módulo de carteiras
│   │   ├── controllers/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── use-cases/
│   └── transactions/       # Módulo de transações (placeholder)
│       └── entities/
└── db/
    └── data-source.ts      # Configuração do TypeORM DataSource
```

## 🛠️ Configuração e Execução

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou Yarn
- Um servidor PostgreSQL em execução

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/geovanesv/carteira-financeira.git
    cd carteira-financeira
    ```
2.  Instale as dependências:
    ```bash
    npm install # ou yarn install
    ```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```dotenv
APP_PORT=3000
DATABASE_URL="postgresql://user:password@host:5432/database_name"
JWT_SECRET="sua_chave_secreta_jwt_aqui"
JWT_EXPIRES_IN="1h"
```

### Banco de Dados

Certifique-se de que seu banco de dados PostgreSQL esteja em execução e acessível.

Para executar as migrações (se houver, para criar as tabelas):

```bash
# Exemplo de comando para rodar migrações com TypeORM (se configurado)
# npm run typeorm migration:run
```

### Executando a Aplicação

- **Modo de Desenvolvimento**:

  ```bash
  npm run start:dev
  ```

  A aplicação será recarregada automaticamente a cada alteração de código.

- **Modo de Produção**:
  ```bash
  npm run build
  npm run start
  ```

## 📖 Documentação da API (Swagger)

Após iniciar a aplicação, a documentação interativa da API estará disponível em:

`http://localhost:<APP_PORT>/api-docs`

Por exemplo, se `APP_PORT` for `3000`, acesse `http://localhost:3000/api-docs`.

## 🔑 Endpoints Principais

- `POST /auth/login`: Autentica um usuário e retorna um token JWT.
- `GET /wallets/balance`: Retorna o saldo da carteira do usuário autenticado.
- `POST /wallets/create`: Cria uma nova carteira para o usuário autenticado.
- `PATCH /wallets/update`: Atualiza o saldo da carteira do usuário autenticado.

## 👤 Autor

**Geovane**

- GitHub: geovanesv
- Email: geovane.dev@gmail.com

```

```

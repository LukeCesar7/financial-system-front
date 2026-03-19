# Gestão Financeira — Frontend

Interface web desenvolvida em **React + Vite** para controle de receitas e despesas pessoais.

---

## Estrutura do projeto

```
front/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── FormularioTransacao.jsx  # Formulário de criação e edição
│   │   ├── GraficoPizza.jsx         # Gráfico de despesas por categoria
│   │   ├── Login.jsx                # Tela de login e cadastro
│   │   ├── ResumoCards.jsx          # Cards de saldo, receitas e despesas
│   │   ├── TabelaTransacoes.jsx     # Listagem com ações de editar/excluir
│   │   └── ThemeToggle.jsx          # Alternador de tema claro/escuro
│   ├── constants/
│   │   └── opcoes.js                # Categorias, meses, anos e ícones
│   ├── hooks/
│   │   └── useTransacoes.jsx        # Custom hook com toda a lógica de negócio
│   ├── utils/
│   │   ├── formatadores.js          # Formatação de moeda e data
│   │   └── relatorio.js            # Geração do PDF com jsPDF
│   ├── App.jsx                      # Componente raiz e orquestração
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- Backend da aplicação rodando em `http://localhost:3000`

---

## Como rodar

### 1. Instalar dependências

```bash
cd front
npm install
```

### 2. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação sobe em: `http://localhost:5173`

> O frontend se comunica com a API em `http://localhost:3000`. Certifique-se de que o backend está rodando antes de usar a aplicação.

---

## Funcionalidades

- **Cadastro e login** de usuários com autenticação JWT
- **Tema claro e escuro** com toggle na barra superior
- **Dashboard financeiro** com cards de saldo, receitas e despesas
- **Gráfico de pizza** com despesas agrupadas por categoria
- **Cadastro de transações** com tipo (receita/despesa), categoria, valor e data
- **Edição e exclusão** de transações com confirmação em modal
- **Filtros** por mês, ano e categoria (múltipla seleção)
- **Persistência de filtros** via `sessionStorage` entre navegações
- **Geração de relatório PDF** com as transações filtradas do período
- **Notificações** de sucesso e erro em todas as operações

---

## Arquitetura

### Custom Hook `useTransacoes`

Toda a lógica de negócio da aplicação está centralizada no hook `useTransacoes`. Ele é responsável por:

- Chamadas à API (listar, criar, editar, excluir)
- Estado das transações e filtros
- Cálculo de saldo, total de receitas e total de despesas
- Persistência dos filtros no `sessionStorage`

O componente `App` apenas consome os resultados prontos, mantendo a separação entre lógica e apresentação.

### Fluxo de autenticação

```
Login/Cadastro → JWT recebido → salvo no localStorage
     ↓
Dashboard carrega → token enviado no header de cada requisição
     ↓
Logout → localStorage limpo → redirecionado para o login
```

---

## Comunicação com a API

Todas as requisições autenticadas enviam o token no header:

```
Authorization: Bearer <token>
```

A URL base da API está definida em `src/hooks/useTransacoes.jsx` e em `src/components/Login.jsx`:

```js
const API_URL = 'http://localhost:3000';
```

---

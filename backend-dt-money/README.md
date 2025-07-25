# DT Money Backend API

Backend da aplicação DT Money desenvolvido com NestJS, Prisma e SQLite.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js
- **Prisma** - ORM moderno para TypeScript
- **SQLite** - Banco de dados
- **TypeScript** - Linguagem de programação
- **Class Validator** - Validação de dados

## 📋 Funcionalidades

- ✅ CRUD completo de transações
- ✅ Paginação de resultados
- ✅ Validação de dados
- ✅ Tratamento global de erros
- ✅ CORS configurado
- ✅ TypeScript com tipagem completa

## 🛠️ Instalação

### Pré-requisitos
- Node.js (versão 18+)
- pnpm (recomendado) ou npm

### Passos

1. **Instale as dependências**
   ```bash
   pnpm install
   # ou
   npm install
   ```

2. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```

3. **Execute as migrações do banco**
   ```bash
   npx prisma migrate dev
   ```

4. **Gere o cliente Prisma**
   ```bash
   npx prisma generate
   ```

5. **Inicie o servidor**
   ```bash
   # Desenvolvimento
   pnpm start:dev
   
   # Produção
   pnpm start:prod
   ```

O servidor estará rodando em `http://localhost:3333`

## 📝 API Documentation

### Endpoints

#### 1. Listar Transações (com paginação)
```http
GET /transaction?page=1&limit=10
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Salário",
      "price": 3000.00,
      "category": "Trabalho",
      "data": "2024-01-15T00:00:00.000Z",
      "type": "INCOME"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### 2. Criar Transação
```http
POST /transaction
```

**Body:**
```json
{
  "title": "Salário",
  "price": 3000.00,
  "category": "Trabalho",
  "data": "2024-01-15T00:00:00.000Z",
  "type": "INCOME"
}
```

#### 3. Buscar por ID
```http
GET /transaction/:id
```

#### 4. Atualizar Transação
```http
PUT /transaction/:id
```

#### 5. Excluir Transação
```http
DELETE /transaction/:id
```

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm start:dev          # Modo desenvolvimento
pnpm start:debug        # Com debug

# Produção
pnpm build              # Build do projeto
pnpm start:prod         # Modo produção

# Testes
pnpm test               # Testes unitários
pnpm test:e2e           # Testes end-to-end
pnpm test:cov           # Coverage

# Prisma
npx prisma studio       # Interface visual
npx prisma generate     # Gerar cliente
```

# YouTube Shopping Validator

Sistema para validar vídeos do YouTube e verificar produtos mencionados, incluindo validação de hashtags obrigatórias.

## 🚀 Tecnologias

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express, tRPC
- **Banco de Dados**: MySQL com Drizzle ORM
- **Autenticação**: OAuth via Manus SDK
- **Web Scraping**: Puppeteer para extração de dados do YouTube

## 📋 Pré-requisitos

- Node.js 18+ 
- pnpm 10.4.1+
- MySQL 8.0+
- Chromium/Chrome instalado (para Puppeteer)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/joaovvsouza/yt-shopping-validator.git
cd yt-shopping-validator
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Configure o banco de dados:
```bash
# Certifique-se de que o MySQL está rodando e crie o banco de dados
# Execute as migrações:
pnpm db:push
```

## 🏃 Executando o Projeto

### Desenvolvimento
```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3000` (ou outra porta se 3000 estiver ocupada).

**Acesse no navegador**: `http://localhost:3000`

### Acesso Público (Link Web)

Para compartilhar o projeto ou acessar de outros dispositivos, você pode usar um túnel:

**Opção 1 - Cloudflare Tunnel (Recomendado)**:
```bash
# Instale: brew install cloudflared
pnpm tunnel
```

**Opção 2 - ngrok**:
```bash
# Instale e configure ngrok primeiro
pnpm tunnel:ngrok
```

**Opção 3 - localtunnel**:
```bash
# Instale: npm install -g localtunnel
pnpm tunnel:lt
```

📖 **Veja mais detalhes em**: [ACESSO_LOCAL.md](./ACESSO_LOCAL.md)

### Produção
```bash
pnpm build
pnpm start
```

## 📝 Variáveis de Ambiente

Veja o arquivo `.env.example` para todas as variáveis necessárias. As principais são:

- `DATABASE_URL`: URL de conexão MySQL
- `OAUTH_SERVER_URL`: URL do servidor OAuth
- `VITE_APP_ID`: ID da aplicação
- `JWT_SECRET`: Secret para assinar cookies JWT
- `VITE_OAUTH_PORTAL_URL`: URL do portal OAuth para login

## 🧪 Testes

```bash
pnpm test
```

## 📦 Scripts Disponíveis

- `pnpm dev` - Inicia o servidor em modo desenvolvimento
- `pnpm build` - Compila o projeto para produção
- `pnpm start` - Inicia o servidor em modo produção
- `pnpm check` - Verifica erros de TypeScript
- `pnpm format` - Formata o código com Prettier
- `pnpm test` - Executa os testes
- `pnpm db:push` - Gera e aplica migrações do banco de dados

## 🐛 Troubleshooting

### Puppeteer não encontra Chrome/Chromium

O projeto está configurado para usar Chromium do sistema em `/usr/bin/chromium-browser`. Se você estiver em um sistema diferente:

1. **macOS**: Instale Chromium ou ajuste o `executablePath` em `server/youtube-extractor.ts`
2. **Windows**: Instale Chrome e ajuste o caminho
3. **Linux**: Instale `chromium-browser` ou ajuste o caminho

### Erro de conexão com banco de dados

Certifique-se de que:
- O MySQL está rodando
- A `DATABASE_URL` está correta no `.env`
- O banco de dados foi criado
- As migrações foram executadas (`pnpm db:push`)

## 📄 Licença

MIT

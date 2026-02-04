# ⚡ RESOLVER AGORA - Servidor não está abrindo

## 🔴 Problema Identificado

O servidor não está rodando porque:
1. ❌ Dependências não instaladas (`node_modules` não existe)
2. ❌ pnpm não está instalado
3. ❌ Arquivo `.env` não existe

## ✅ SOLUÇÃO RÁPIDA

### Passo 1: Instalar pnpm

**Execute no terminal:**

```bash
# Opção 1 - Via npm (pode pedir senha):
sudo npm install -g pnpm

# Opção 2 - Via Homebrew (se tiver):
brew install pnpm

# Opção 3 - Via script (se tiver internet):
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

**Depois feche e abra o terminal novamente** para carregar o pnpm.

### Passo 2: Instalar dependências

```bash
cd /Users/joaosouza/youtube-shop
pnpm install
```

⏱️ **Isso pode demorar 2-5 minutos na primeira vez**

### Passo 3: Criar arquivo .env básico

```bash
cd /Users/joaosouza/youtube-shop
cp .env.example .env
```

Depois edite o `.env` e adicione pelo menos:

```env
DATABASE_URL=mysql://root:senha@localhost:3306/yt_shopping_validator
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://seu-oauth-server.com
JWT_SECRET=qualquer-chave-secreta-aqui
VITE_OAUTH_PORTAL_URL=https://seu-oauth-portal.com
```

### Passo 4: Iniciar o servidor

```bash
pnpm dev
```

Você deve ver:
```
Server running on http://localhost:3000/
```

### Passo 5: Abrir no navegador

Acesse: **http://localhost:3000**

## 🆘 Alternativa: Usar npm ao invés de pnpm

Se não conseguir instalar o pnpm, você pode usar npm:

```bash
cd /Users/joaosouza/youtube-shop

# Instalar dependências com npm
npm install

# Iniciar servidor (pode precisar ajustar scripts)
NODE_ENV=development npx tsx watch server/_core/index.ts
```

## 📋 Checklist

- [ ] pnpm instalado (`pnpm --version` deve funcionar)
- [ ] Dependências instaladas (`ls node_modules` deve listar arquivos)
- [ ] Arquivo `.env` criado (`ls .env` deve mostrar o arquivo)
- [ ] Servidor iniciado (`pnpm dev` sem erros)
- [ ] Navegador acessando `http://localhost:3000`

## 💡 Dica

Se aparecer algum erro ao executar `pnpm dev`, **copie a mensagem de erro completa** e me envie para eu ajudar a resolver!

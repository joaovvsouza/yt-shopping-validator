# 🌐 Como Publicar o Projeto Online

Existem duas formas principais de publicar: **túneis temporários** (para testes rápidos) e **deploy permanente** (para produção).

## 🚀 Opção 1: Túneis Temporários (Rápido - Para Testes)

### Método 1: Cloudflare Tunnel (Recomendado - Grátis, sem cadastro)

1. **Instale o cloudflared:**
   ```bash
   brew install cloudflared
   ```

2. **Inicie o servidor e o túnel:**
   ```bash
   cd /Users/joaosouza/youtube-shop
   pnpm tunnel
   ```
   
   Ou manualmente:
   ```bash
   # Terminal 1: Inicie o servidor
   pnpm dev
   
   # Terminal 2: Inicie o túnel
   cloudflared tunnel --url http://localhost:3000
   ```

3. **Copie a URL** que aparecerá (exemplo: `https://xxxxx.trycloudflare.com`)

✅ **Vantagens:** Grátis, sem cadastro, HTTPS automático
⚠️ **Limitações:** URL muda a cada execução, só funciona enquanto o túnel estiver rodando

---

### Método 2: ngrok (URL Fixa com Cadastro)

1. **Instale o ngrok:**
   ```bash
   brew install ngrok
   ```

2. **Crie uma conta gratuita** em https://ngrok.com

3. **Configure seu authtoken:**
   ```bash
   ngrok config add-authtoken SEU_TOKEN_AQUI
   ```
   (O token está em: https://dashboard.ngrok.com/get-started/your-authtoken)

4. **Inicie o túnel:**
   ```bash
   cd /Users/joaosouza/youtube-shop
   pnpm tunnel:ngrok
   ```
   
   Ou manualmente:
   ```bash
   # Terminal 1: Inicie o servidor
   pnpm dev
   
   # Terminal 2: Inicie o túnel
   ngrok http 3000
   ```

5. **Copie a URL** que aparecerá (exemplo: `https://xxxxx.ngrok-free.app`)

✅ **Vantagens:** URL fixa (com plano pago), dashboard web, mais estável
⚠️ **Limitações:** Requer cadastro, URL gratuita muda a cada execução

---

### Método 3: localtunnel (Mais Simples)

1. **Instale globalmente:**
   ```bash
   npm install -g localtunnel
   ```

2. **Inicie o túnel:**
   ```bash
   cd /Users/joaosouza/youtube-shop
   pnpm tunnel:lt
   ```
   
   Ou manualmente:
   ```bash
   # Terminal 1: Inicie o servidor
   pnpm dev
   
   # Terminal 2: Inicie o túnel
   lt --port 3000
   ```

3. **Copie a URL** que aparecerá (exemplo: `https://xxxxx.loca.lt`)

✅ **Vantagens:** Muito simples, sem cadastro
⚠️ **Limitações:** Menos estável, pode ter limitações de tráfego

---

## 🏗️ Opção 2: Deploy Permanente (Produção)

### Opção A: Vercel (Recomendado para Frontend/Full-Stack)

1. **Instale a CLI da Vercel:**
   ```bash
   npm install -g vercel
   ```

2. **Faça login:**
   ```bash
   vercel login
   ```

3. **Configure o projeto:**
   Crie um arquivo `vercel.json` na raiz do projeto:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server/_core/index.ts",
         "use": "@vercel/node"
       },
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "server/_core/index.ts"
       },
       {
         "src": "/(.*)",
         "dest": "/dist/$1"
       }
     ]
   }
   ```

4. **Faça o deploy:**
   ```bash
   vercel
   ```

✅ **Vantagens:** Grátis para projetos pessoais, HTTPS automático, CDN global
⚠️ **Limitações:** Pode precisar ajustar configurações para Puppeteer

---

### Opção B: Railway (Recomendado para Backend com Puppeteer)

1. **Acesse:** https://railway.app

2. **Conecte seu repositório GitHub:**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha `joaovvsouza/yt-shopping-validator`

3. **Configure as variáveis de ambiente:**
   - Adicione todas as variáveis do `.env.example`
   - Railway detectará automaticamente Node.js

4. **Railway fará o deploy automaticamente**

✅ **Vantagens:** Suporta Puppeteer bem, fácil configuração, plano gratuito generoso
⚠️ **Limitações:** Pode precisar configurar buildpacks para Chromium

---

### Opção C: Render (Alternativa Simples)

1. **Acesse:** https://render.com

2. **Conecte seu repositório GitHub**

3. **Crie um novo Web Service:**
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `pnpm start`
   - Environment: `Node`

4. **Configure variáveis de ambiente**

✅ **Vantagens:** Interface simples, plano gratuito
⚠️ **Limitações:** Serviços gratuitos podem "dormir" após inatividade

---

### Opção D: Fly.io (Boa para Puppeteer)

1. **Instale a CLI:**
   ```bash
   brew install flyctl
   ```

2. **Faça login:**
   ```bash
   fly auth login
   ```

3. **Inicialize o projeto:**
   ```bash
   fly launch
   ```

4. **Configure o `fly.toml`** para incluir Chromium

✅ **Vantagens:** Suporta Puppeteer nativamente, bom para apps Node.js
⚠️ **Limitações:** Requer mais configuração inicial

---

## 🔧 Configurações Necessárias para Deploy

### Variáveis de Ambiente Importantes:

```env
# Servidor
PORT=3000
NODE_ENV=production

# Puppeteer (para Railway/Fly.io)
CHROMIUM_PATH=/usr/bin/chromium-browser
# ou
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Database (se usar)
DATABASE_URL=mysql://user:pass@host:3306/dbname
```

### Ajustes para Puppeteer em Produção:

Se usar Railway ou Fly.io, você pode precisar adicionar ao `package.json`:

```json
{
  "scripts": {
    "postinstall": "node -e \"require('puppeteer').executablePath()\" || echo 'Puppeteer OK'"
  }
}
```

---

## 📋 Checklist para Deploy

- [ ] Código commitado e pushado para GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] `.env` não está no repositório (está no `.gitignore`)
- [ ] Build funciona localmente (`pnpm build`)
- [ ] Servidor inicia corretamente (`pnpm start`)
- [ ] Puppeteer configurado para produção (se necessário)

---

## 🎯 Recomendação Rápida

**Para testes rápidos:** Use Cloudflare Tunnel (`pnpm tunnel`)

**Para produção:** Use Railway (melhor suporte para Puppeteer) ou Vercel (mais simples para frontend)

---

## 🆘 Problemas Comuns

### Puppeteer não funciona em produção
- Configure `CHROMIUM_PATH` ou use um buildpack que instala Chromium
- Railway tem buildpacks automáticos para isso

### Porta não configurada
- Use a variável `PORT` que a plataforma fornece
- Ajuste o código para ler `process.env.PORT || 3000`

### Variáveis de ambiente não carregam
- Configure todas no painel da plataforma
- Reinicie o serviço após adicionar variáveis

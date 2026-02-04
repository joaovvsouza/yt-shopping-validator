# 🌐 Como Acessar o Projeto Localmente

## 📍 Acesso Local (localhost)

### 1. Inicie o servidor:
```bash
pnpm dev
```

### 2. Acesse no navegador:
O servidor estará disponível em:
- **URL**: `http://localhost:3000`
- Se a porta 3000 estiver ocupada, o servidor tentará usar 3001, 3002, etc.
- A porta usada será exibida no terminal quando o servidor iniciar

## 🌍 Acesso Público (Link Web)

Para compartilhar o projeto com outras pessoas ou acessar de outros dispositivos, você pode usar um túnel. Aqui estão as opções:

### Opção 1: Cloudflare Tunnel (Recomendado - Grátis)

1. **Instale o cloudflared**:
```bash
# macOS
brew install cloudflared

# Ou baixe de: https://github.com/cloudflare/cloudflared/releases
```

2. **Execute o túnel** (em outro terminal, enquanto o servidor está rodando):
```bash
cloudflared tunnel --url http://localhost:3000
```

3. **Copie a URL** que aparecerá no terminal (algo como: `https://xxxxx.trycloudflare.com`)

### Opção 2: ngrok (Popular)

1. **Instale o ngrok**:
```bash
# macOS
brew install ngrok

# Ou baixe de: https://ngrok.com/download
```

2. **Crie uma conta gratuita** em https://ngrok.com e obtenha seu authtoken

3. **Configure o authtoken**:
```bash
ngrok config add-authtoken SEU_TOKEN_AQUI
```

4. **Execute o túnel** (em outro terminal, enquanto o servidor está rodando):
```bash
ngrok http 3000
```

5. **Copie a URL** que aparecerá (algo como: `https://xxxxx.ngrok-free.app`)

### Opção 3: localtunnel (Simples, sem cadastro)

1. **Instale globalmente**:
```bash
npm install -g localtunnel
```

2. **Execute o túnel** (em outro terminal, enquanto o servidor está rodando):
```bash
lt --port 3000
```

3. **Copie a URL** que aparecerá (algo como: `https://xxxxx.loca.lt`)

## 🚀 Script Automatizado

Adicionei um script no `package.json` para facilitar o uso do Cloudflare Tunnel. Para usar:

```bash
pnpm tunnel
```

Isso iniciará o servidor e o túnel automaticamente.

## ⚠️ Importante

- **Desenvolvimento**: O túnel é útil para testar em dispositivos móveis ou compartilhar temporariamente
- **Produção**: Para produção, use um servidor adequado (Vercel, Railway, etc.)
- **Segurança**: Túneis públicos expõem seu servidor local - use apenas para desenvolvimento/testes

## 🔧 Troubleshooting

### Porta já está em uso
Se a porta 3000 estiver ocupada:
1. Pare outros processos usando a porta: `lsof -ti:3000 | xargs kill`
2. Ou defina outra porta: `PORT=3001 pnpm dev`

### Túnel não funciona
- Certifique-se de que o servidor local está rodando primeiro
- Verifique se não há firewall bloqueando
- Tente outro serviço de túnel se um não funcionar

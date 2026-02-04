# 🚀 Publicar Online - Guia Rápido

## ⚡ Método Mais Rápido (Sem Instalar Nada)

Como você já tem o servidor rodando na porta 3000, você pode usar `npx` para criar um túnel sem instalar nada:

### Opção 1: localtunnel (Mais Simples)

Em um **novo terminal**, execute:

```bash
cd /Users/joaosouza/youtube-shop
npx localtunnel --port 3000
```

Você verá uma URL como: `https://xxxxx.loca.lt`

**Copie essa URL** e compartilhe! ✅

---

### Opção 2: Cloudflare Tunnel (Mais Estável)

1. **Baixe o cloudflared:**
   - Acesse: https://github.com/cloudflare/cloudflared/releases
   - Baixe a versão para macOS (arquivo `.darwin-amd64.tgz` ou `.darwin-arm64.tgz` dependendo do seu Mac)
   - Extraia e mova para `/usr/local/bin/`:
     ```bash
     tar -xzf cloudflared-darwin-amd64.tgz
     sudo mv cloudflared /usr/local/bin/
     ```

2. **Execute o túnel:**
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```

---

### Opção 3: Usar o Script Automatizado

Execute:
```bash
cd /Users/joaosouza/youtube-shop
./publicar.sh
```

O script tentará usar o melhor túnel disponível.

---

## 📋 Passo a Passo Completo

1. **Certifique-se que o servidor está rodando:**
   ```bash
   # Se não estiver rodando:
   cd /Users/joaosouza/youtube-shop
   npx pnpm@latest dev
   ```

2. **Em outro terminal, inicie o túnel:**
   ```bash
   npx localtunnel --port 3000
   ```

3. **Copie a URL** que aparecerá no terminal

4. **Acesse a URL** no navegador ou compartilhe com outras pessoas

---

## ⚠️ Importante

- **O túnel só funciona enquanto estiver rodando** - se fechar o terminal, a URL para de funcionar
- **A URL muda a cada execução** (exceto com ngrok pago)
- **Use apenas para testes** - para produção, faça deploy permanente (veja `PUBLICAR_ONLINE.md`)

---

## 🎯 Para Deploy Permanente

Se quiser uma URL fixa que funciona sempre, veja o arquivo `PUBLICAR_ONLINE.md` para opções como:
- Railway (recomendado)
- Vercel
- Render
- Fly.io

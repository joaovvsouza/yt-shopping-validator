# 🔧 Variáveis de Ambiente do Railway

## Variáveis Obrigatórias para Puppeteer

Configure estas variáveis no painel do Railway:

### PUPPETEER_EXECUTABLE_PATH
```
PUPPETEER_EXECUTABLE_PATH=/run/current-system/sw/bin/chromium
```

**Importante:** Esta variável aponta para o Chromium instalado via `nixpacks.toml`. Sem ela, o Puppeteer tentará baixar o Chrome automaticamente e falhará.

### PUPPETEER_SKIP_CHROMIUM_DOWNLOAD
```
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

Esta variável impede que o Puppeteer tente baixar o Chromium automaticamente, já que estamos usando o Chromium do sistema instalado via Nix.

### NODE_ENV
```
NODE_ENV=production
```

Define o ambiente como produção.

## 📋 Lista Completa de Variáveis

No painel do Railway, adicione/configure:

```env
# Puppeteer
PUPPETEER_EXECUTABLE_PATH=/run/current-system/sw/bin/chromium
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Ambiente
NODE_ENV=production
PORT=3000

# Database (se usar)
DATABASE_URL=mysql://user:password@host:port/database

# Outras variáveis conforme necessário
```

## ✅ Verificação

Após configurar as variáveis, faça um redeploy. Nos logs do Railway, você deve ver:

```
[Puppeteer] Using executable path: /run/current-system/sw/bin/chromium
[Puppeteer] Browser launched successfully
```

Se ainda aparecer o erro sobre não encontrar o Chrome, verifique:
1. Se `PUPPETEER_EXECUTABLE_PATH` está configurado corretamente
2. Se `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` está configurado
3. Se o `nixpacks.toml` inclui `chromium` e `chromium-sandbox`

# 🔧 Variáveis de Ambiente do Railway

## Variáveis Obrigatórias

### NODE_ENV
```
NODE_ENV=production
```

Define o ambiente como produção.

## 📋 Lista Completa de Variáveis

No painel do Railway, adicione/configure:

```env
# Ambiente
NODE_ENV=production
PORT=3000

# Database (se usar)
DATABASE_URL=mysql://user:password@host:port/database

# Outras variáveis conforme necessário
```

## ✅ Verificação

Após o deploy, verifique os logs do Railway. O Puppeteer baixará automaticamente o Chrome durante o build e você deve ver:

```
[Puppeteer] Browser launched successfully
```

## 📝 Notas Importantes

- O Chrome é baixado automaticamente durante o build via `npx puppeteer browsers install chrome`
- Não é necessário configurar `PUPPETEER_EXECUTABLE_PATH` ou outras variáveis relacionadas
- O `nixpacks.toml` garante que o Chromium esteja disponível como fallback

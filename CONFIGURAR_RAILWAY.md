# 🚂 Configuração do Railway

Este guia explica como configurar o projeto no Railway com suporte ao Puppeteer/Chrome.

## ✅ O que foi configurado

1. **nixpacks.toml** - Configuração do Railway para instalar Chromium e baixar Chrome via Puppeteer
2. **Código simplificado** - Puppeteer usa seu próprio Chrome bundlado
3. **Download automático** - Chrome é baixado durante o build via `npx puppeteer browsers install chrome`

## 🔧 Configuração no Railway

### Passo 1: Variáveis de Ambiente

No painel do Railway, adicione apenas:

```env
NODE_ENV=production
PORT=3000
```

**Importante:** Não é necessário configurar variáveis relacionadas ao Puppeteer. O Chrome será baixado automaticamente durante o build.

### Passo 2: Deploy

O Railway detectará automaticamente o arquivo `nixpacks.toml` e:
- Instalará o Chromium via Nix (como fallback)
- Executará `pnpm install`
- Executará `npx puppeteer browsers install chrome` (baixa o Chrome)
- Executará `pnpm build`
- Iniciará com `pnpm start`

### Passo 3: Verificar Logs

Após o deploy, verifique os logs do Railway. Você deve ver:

```
[Puppeteer] Browser launched successfully
```

## 📋 Arquivos Criados/Modificados

### `nixpacks.toml`
- Instala Chromium via Nix (fallback)
- Força download do Chrome via Puppeteer durante o build

### `server/youtube-extractor.ts`
- Usa Puppeteer com Chrome bundlado
- Não requer configuração de `executablePath`

## 🔍 Como Funciona

1. **Durante o Build:**
   - O Railway executa `npx puppeteer browsers install chrome`
   - O Puppeteer baixa o Chrome automaticamente
   - O Chromium do Nix fica disponível como fallback

2. **Durante a Execução:**
   - O Puppeteer usa o Chrome baixado automaticamente
   - Não precisa de configuração adicional

## 🆘 Troubleshooting

### Erro: "Não foi possível iniciar o navegador"

1. Verifique os logs do build para confirmar que o Chrome foi baixado
2. Verifique se `NODE_ENV=production` está configurado
3. Verifique os recursos do Railway (memória/CPU)

### Chrome não está sendo baixado

1. Certifique-se de que o `nixpacks.toml` está na raiz do projeto
2. Verifique os logs do build para ver se o comando `npx puppeteer browsers install chrome` foi executado
3. Tente fazer um redeploy

### Timeout ao iniciar o navegador

1. Aumente o timeout no código se necessário (atualmente 60s)
2. Verifique os recursos do Railway (memória/CPU)
3. O Chrome pode precisar de mais recursos em alguns casos

## 📝 Notas Importantes

- O Chrome é baixado automaticamente pelo Puppeteer durante o build
- Não é necessário configurar variáveis de ambiente relacionadas ao Puppeteer
- O Chromium do Nix serve apenas como fallback
- Em desenvolvimento local, o Puppeteer também baixa o Chrome automaticamente

## 🔗 Referências

- [Railway Nixpacks](https://docs.railway.app/guides/nixpacks)
- [Puppeteer Documentation](https://pptr.dev/)
- [Puppeteer Browsers](https://pptr.dev/browsers-api/)

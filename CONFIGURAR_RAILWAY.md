# 🚂 Configuração do Railway

Este guia explica como configurar o projeto no Railway com suporte ao Puppeteer/Chromium.

## ✅ O que foi configurado

1. **@sparticuz/chromium** - Pacote otimizado para ambientes serverless (Railway, AWS Lambda, etc.)
2. **nixpacks.toml** - Configuração do Railway para instalar Chromium
3. **Código atualizado** - Detecção automática do ambiente e uso do Chromium correto
4. **Variáveis de ambiente** - Configuração para pular download do Chromium pelo Puppeteer

## 🔧 Configuração no Railway

### Passo 1: Variáveis de Ambiente

No painel do Railway, adicione as seguintes variáveis de ambiente:

```env
NODE_ENV=production
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

**Importante:** O `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` faz com que o Puppeteer não tente baixar o Chromium, já que estamos usando o `@sparticuz/chromium` e o Chromium do `nixpacks.toml`.

### Passo 2: Deploy

O Railway detectará automaticamente o arquivo `nixpacks.toml` e:
- Instalará o Chromium via Nix
- Executará `pnpm install`
- Executará `pnpm build`
- Iniciará com `pnpm start`

### Passo 3: Verificar Logs

Após o deploy, verifique os logs do Railway. Você deve ver:

```
[Puppeteer] Using @sparticuz/chromium for Railway
[Puppeteer] Browser launched successfully
```

Se aparecer algum erro, verifique:
1. Se `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` está configurado
2. Se `NODE_ENV=production` está configurado
3. Os logs completos do Railway

## 📋 Arquivos Criados/Modificados

### `nixpacks.toml`
Configura o Railway para instalar Chromium via Nix e executar os comandos corretos.

### `server/youtube-extractor.ts`
- Detecta automaticamente se está em produção
- Usa `@sparticuz/chromium` quando disponível em produção
- Faz fallback para Chromium do sistema em desenvolvimento local

### `.env.example`
Adicionada variável `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` para documentação.

## 🔍 Como Funciona

1. **Em Produção (Railway):**
   - O código detecta `NODE_ENV=production`
   - Tenta usar `@sparticuz/chromium` (otimizado para serverless)
   - Se não disponível, usa o Chromium instalado via `nixpacks.toml`

2. **Em Desenvolvimento Local:**
   - Tenta encontrar Chromium instalado no sistema
   - Faz fallback para caminhos comuns (macOS, Linux, Windows)
   - Não usa `@sparticuz/chromium` localmente

## 🆘 Troubleshooting

### Erro: "Não foi possível iniciar o navegador"

1. Verifique se `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` está configurado
2. Verifique se `NODE_ENV=production` está configurado
3. Verifique os logs do Railway para mais detalhes

### Chromium não encontrado

1. Certifique-se de que o `nixpacks.toml` está na raiz do projeto
2. Verifique se o Railway está usando o Nixpacks como buildpack
3. Tente fazer um redeploy

### Timeout ao iniciar o navegador

1. Aumente o timeout no código se necessário (atualmente 60s)
2. Verifique os recursos do Railway (memória/CPU)
3. O Chromium pode precisar de mais recursos em alguns casos

## 📝 Notas Importantes

- O `@sparticuz/chromium` é otimizado para ambientes serverless e tem um tamanho menor
- O `nixpacks.toml` garante que o Chromium esteja disponível no Railway
- O código faz fallback automático se algo não funcionar
- Em desenvolvimento local, continue usando o Chromium do sistema

## 🔗 Referências

- [@sparticuz/chromium](https://www.npmjs.com/package/@sparticuz/chromium)
- [Railway Nixpacks](https://docs.railway.app/guides/nixpacks)
- [Puppeteer Documentation](https://pptr.dev/)

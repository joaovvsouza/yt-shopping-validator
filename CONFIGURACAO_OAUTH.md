# 🔐 Configuração OAuth - Resolver Erro DNS

## ❌ Problema

Se você está vendo o erro `DNS_PROBE_FINISHED_NXDOMAIN` ou `your-oauth-portal.com`, significa que as variáveis de ambiente OAuth não estão configuradas corretamente.

## ✅ Solução

### 1. Edite o arquivo `.env`

Abra o arquivo `.env` no diretório do projeto e configure as seguintes variáveis:

```env
# URL do portal OAuth (OBRIGATÓRIO)
VITE_OAUTH_PORTAL_URL=https://seu-portal-oauth-real.com

# ID da aplicação (OBRIGATÓRIO)
VITE_APP_ID=seu-app-id-real

# URL do servidor OAuth (OBRIGATÓRIO)
OAUTH_SERVER_URL=https://seu-servidor-oauth-real.com

# Secret para JWT (OBRIGATÓRIO - use uma chave forte)
JWT_SECRET=sua-chave-secreta-forte-aqui
```

### 2. Reinicie o servidor

Depois de editar o `.env`, reinicie o servidor:

```bash
# Pare o servidor atual (Ctrl+C no terminal onde está rodando)
# Ou mate o processo:
lsof -ti:3000 | xargs kill

# Inicie novamente:
npx pnpm@latest dev
```

### 3. Recarregue a página

Recarregue a página no navegador (`http://localhost:3000`)

## 🚫 Valores que NÃO funcionam

❌ **NÃO use** valores de exemplo como:
- `your-oauth-portal.com`
- `your-app-id`
- `your-oauth-server.com`
- `example.com`
- Valores vazios (deixe vazio apenas se não for usar OAuth)

## 💡 Modo de Desenvolvimento Sem OAuth

Se você não tem um servidor OAuth configurado ainda, você pode:

1. **Deixar as variáveis vazias** - O aplicativo mostrará uma mensagem informativa ao invés de tentar fazer login
2. **Usar um serviço OAuth de desenvolvimento** como:
   - Auth0 (tem plano gratuito)
   - Clerk (tem plano gratuito)
   - Supabase Auth (tem plano gratuito)

## 🔍 Verificar Configuração

Para verificar se as variáveis estão sendo carregadas:

```bash
# No terminal do servidor, você pode verificar os logs
# Ou adicione temporariamente no código:
console.log('OAuth URL:', import.meta.env.VITE_OAUTH_PORTAL_URL);
```

## 📝 Exemplo de Configuração Completa

```env
# OAuth
VITE_OAUTH_PORTAL_URL=https://auth.exemplo.com
VITE_APP_ID=abc123xyz
OAUTH_SERVER_URL=https://api-auth.exemplo.com
JWT_SECRET=minha-chave-super-secreta-123456789

# Banco de Dados
DATABASE_URL=mysql://usuario:senha@localhost:3306/yt_shopping_validator

# Outras configurações...
```

## ⚠️ Importante

- **Nunca commite o arquivo `.env`** no Git (ele já está no `.gitignore`)
- Use valores diferentes para desenvolvimento e produção
- Em produção, use variáveis de ambiente do servidor ao invés de arquivo `.env`

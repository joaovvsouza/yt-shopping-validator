# 🚀 Início Rápido - Resolver Problemas de Conexão

## ❌ Problema: ERR_CONNECTION_REFUSED

Se você está vendo o erro "Não é possível acessar esse site" ou "ERR_CONNECTION_REFUSED", siga estes passos:

## ✅ Passo a Passo para Resolver

### 1. Instalar pnpm (gerenciador de pacotes)

**Opção A - Via npm (se você tem Node.js instalado):**
```bash
npm install -g pnpm
```

**Opção B - Via Homebrew (macOS):**
```bash
brew install pnpm
```

**Opção C - Via script oficial:**
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### 2. Instalar as dependências do projeto

```bash
cd /Users/joaosouza/youtube-shop
pnpm install
```

⚠️ **Isso pode demorar alguns minutos na primeira vez**

### 3. Criar arquivo de configuração (.env)

```bash
cp .env.example .env
```

Depois edite o arquivo `.env` e preencha pelo menos as variáveis essenciais:
- `DATABASE_URL` - URL do banco MySQL
- `VITE_APP_ID` - ID da aplicação
- `OAUTH_SERVER_URL` - URL do servidor OAuth
- `JWT_SECRET` - Uma chave secreta qualquer (ex: `minha-chave-secreta-123`)

### 4. Iniciar o servidor

```bash
pnpm dev
```

Você deve ver uma mensagem como:
```
Server running on http://localhost:3000/
```

### 5. Acessar no navegador

Abra: `http://localhost:3000`

## 🔍 Verificações Rápidas

### Verificar se o servidor está rodando:
```bash
lsof -ti:3000
```
Se retornar um número, o servidor está rodando.

### Verificar se as dependências estão instaladas:
```bash
ls node_modules
```
Se listar muitos diretórios, está OK.

### Parar o servidor:
Pressione `Ctrl + C` no terminal onde o servidor está rodando.

## 🆘 Se ainda não funcionar

1. **Verifique se Node.js está instalado:**
   ```bash
   node --version
   ```
   Precisa ser versão 18 ou superior.

2. **Verifique se a porta está livre:**
   ```bash
   lsof -ti:3000
   ```
   Se retornar algo, mate o processo:
   ```bash
   kill -9 $(lsof -ti:3000)
   ```

3. **Tente outra porta:**
   ```bash
   PORT=3001 pnpm dev
   ```
   Depois acesse: `http://localhost:3001`

4. **Verifique os logs de erro:**
   Quando executar `pnpm dev`, leia as mensagens de erro que aparecerem no terminal.

## 📞 Próximos Passos

Depois que o servidor estiver rodando localmente, você pode:
- Acessar de outros dispositivos usando um túnel (veja `ACESSO_LOCAL.md`)
- Configurar o banco de dados MySQL
- Configurar as variáveis de ambiente completas

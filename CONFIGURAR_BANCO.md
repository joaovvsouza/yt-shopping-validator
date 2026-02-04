# 🗄️ Configurar Banco de Dados MySQL

## ❌ Problema Atual

O erro ocorre porque o banco de dados MySQL não está configurado ou não está acessível.

## ✅ Solução

### Opção 1: Configurar MySQL (Recomendado)

1. **Instale o MySQL** (se ainda não tiver):
   ```bash
   # macOS
   brew install mysql
   
   # Ou baixe de: https://dev.mysql.com/downloads/mysql/
   ```

2. **Inicie o MySQL**:
   ```bash
   brew services start mysql
   # ou
   mysql.server start
   ```

3. **Crie o banco de dados**:
   ```bash
   mysql -u root -p
   ```
   
   Depois execute no MySQL:
   ```sql
   CREATE DATABASE yt_shopping_validator;
   CREATE USER 'ytuser'@'localhost' IDENTIFIED BY 'sua_senha_aqui';
   GRANT ALL PRIVILEGES ON yt_shopping_validator.* TO 'ytuser'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **Configure o `.env`**:
   Edite o arquivo `.env` e atualize a linha:
   ```env
   DATABASE_URL=mysql://ytuser:sua_senha_aqui@localhost:3306/yt_shopping_validator
   ```
   
   Substitua:
   - `ytuser` pelo seu usuário MySQL
   - `sua_senha_aqui` pela sua senha MySQL
   - `localhost:3306` se seu MySQL estiver em outro host/porta

5. **Execute as migrações**:
   ```bash
   npx pnpm@latest db:push
   ```

6. **Reinicie o servidor**:
   ```bash
   # Pare o servidor (Ctrl+C) e inicie novamente:
   npx pnpm@latest dev
   ```

### Opção 2: Usar SQLite (Mais Simples)

Se você não quer configurar MySQL, podemos modificar o projeto para usar SQLite que não precisa de servidor separado.

### Opção 3: Modo Sem Banco (Temporário)

O código agora está preparado para funcionar sem banco de dados:
- ✅ Vídeos serão processados normalmente
- ⚠️ Mas **não serão salvos** no banco
- ⚠️ Lista de vídeos ficará vazia
- ✅ Você pode testar o processamento mesmo sem banco

## 🔍 Verificar se MySQL está rodando

```bash
# Verificar se MySQL está rodando
brew services list | grep mysql
# ou
ps aux | grep mysql
```

## 🆘 Troubleshooting

### Erro: "Access denied"
- Verifique usuário e senha no `.env`
- Certifique-se de que o usuário tem permissões no banco

### Erro: "Can't connect to MySQL server"
- Verifique se MySQL está rodando: `brew services list`
- Verifique host e porta no `.env`
- Tente: `mysql -u root -p` para testar conexão

### Erro: "Unknown database"
- Execute: `CREATE DATABASE yt_shopping_validator;`
- Ou mude o nome do banco no `.env`

## 📝 Formato do DATABASE_URL

```
mysql://[usuário]:[senha]@[host]:[porta]/[nome_do_banco]
```

Exemplo:
```
mysql://root:minhasenha@localhost:3306/yt_shopping_validator
```

## ✅ Depois de Configurar

1. Recarregue a página no navegador
2. Tente processar um vídeo novamente
3. Deve funcionar sem erros!

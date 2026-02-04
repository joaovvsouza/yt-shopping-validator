# Configuração do Git para o Repositório

**IMPORTANTE:** Se encontrar problemas de permissão, execute primeiro:
```bash
sudo chown -R $(whoami) /Users/joaosouza/youtube-shop/.git
```

Execute os seguintes comandos no terminal para conectar este projeto ao repositório GitHub:

## Se o repositório remoto já existe e está vazio:

```bash
cd /Users/joaosouza/youtube-shop
# Se o .git estiver corrompido, remova primeiro:
rm -rf .git
git init
git remote add origin https://github.com/joaovvsouza/yt-shopping-validator.git
git branch -M main
git add .
git commit -m "Initial commit"
git push -u origin main
```

## Se o repositório remoto já tem conteúdo:

```bash
cd /Users/joaosouza/youtube-shop
git init
git remote add origin https://github.com/joaovvsouza/yt-shopping-validator.git
git fetch origin
git branch -M main
git pull origin main --allow-unrelated-histories
git add .
git commit -m "Merge local project"
git push -u origin main
```

## Se preferir usar SSH (recomendado):

```bash
cd /Users/joaosouza/youtube-shop
git init
git remote add origin git@github.com:joaovvsouza/yt-shopping-validator.git
git branch -M main
git add .
git commit -m "Initial commit"
git push -u origin main
```

**Nota:** Você precisará estar autenticado no GitHub para fazer o push. Se usar HTTPS, será solicitado usuário e senha/token.

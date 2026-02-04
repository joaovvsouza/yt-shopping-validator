# Como Fazer Push para o GitHub

O GitHub não aceita mais autenticação por senha. Você precisa usar uma das opções abaixo:

## Opção 1: Usar Personal Access Token (PAT) - Mais Rápido

1. **Criar um Personal Access Token no GitHub:**
   - Acesse: https://github.com/settings/tokens
   - Clique em "Generate new token" → "Generate new token (classic)"
   - Dê um nome (ex: "yt-shopping-validator")
   - Selecione o escopo `repo` (acesso completo aos repositórios)
   - Clique em "Generate token"
   - **COPIE O TOKEN** (você só verá ele uma vez!)

2. **Fazer o push usando o token:**
   ```bash
   cd /Users/joaosouza/youtube-shop
   git push -u origin main
   ```
   - Quando pedir usuário: digite seu username do GitHub
   - Quando pedir senha: **cole o token** (não sua senha!)

## Opção 2: Usar SSH (Recomendado para uso contínuo)

1. **Verificar se já tem chave SSH:**
   ```bash
   ls -la ~/.ssh/id_ed25519.pub
   # ou
   ls -la ~/.ssh/id_rsa.pub
   ```

2. **Se não tiver, criar uma chave SSH:**
   ```bash
   ssh-keygen -t ed25519 -C "seu-email@exemplo.com"
   # Pressione Enter para aceitar o local padrão
   # Pressione Enter para não usar senha (ou crie uma senha)
   ```

3. **Copiar a chave pública:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # ou
   cat ~/.ssh/id_rsa.pub
   ```

4. **Adicionar a chave no GitHub:**
   - Acesse: https://github.com/settings/keys
   - Clique em "New SSH key"
   - Cole a chave pública que você copiou
   - Salve

5. **Mudar o remote para SSH:**
   ```bash
   cd /Users/joaosouza/youtube-shop
   git remote set-url origin git@github.com:joaovvsouza/yt-shopping-validator.git
   git push -u origin main
   ```

## Opção 3: Usar GitHub CLI (gh)

Se você tem o GitHub CLI instalado:

```bash
gh auth login
gh repo create joaovvsouza/yt-shopping-validator --public --source=. --remote=origin --push
```

## Verificar se funcionou

```bash
git log --oneline -1
git remote -v
```

Se o push funcionou, você verá o commit no GitHub em:
https://github.com/joaovvsouza/yt-shopping-validator

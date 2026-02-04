# Como Fazer Push Agora - Passo a Passo

## Problema
O Git não está pedindo senha porque está usando credenciais antigas do macOS Keychain que não funcionam mais.

## Solução Rápida: Usar Personal Access Token

### Passo 1: Criar Token no GitHub
1. Acesse: **https://github.com/settings/tokens**
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Dê um nome: `yt-shopping-validator`
4. Marque o escopo: **`repo`** (acesso completo aos repositórios)
5. Clique em **"Generate token"**
6. **COPIE O TOKEN** (exemplo: `ghp_xxxxxxxxxxxxxxxxxxxx`)

### Passo 2: Limpar Credenciais Antigas
Execute no terminal:
```bash
cd /Users/joaosouza/youtube-shop
git credential-osxkeychain erase <<EOF
host=github.com
protocol=https
EOF
```

### Passo 3: Fazer Push com Token
Execute:
```bash
git push -u origin main
```

Quando pedir:
- **Username:** `joaovvsouza` (seu username do GitHub)
- **Password:** **Cole o token** que você copiou (não sua senha!)

### Passo 4: Salvar Token no Keychain (opcional)
Se quiser que o macOS lembre do token:
```bash
git push -u origin main
# Digite username e token quando pedir
# O macOS vai perguntar se quer salvar - escolha "Sempre permitir"
```

---

## Alternativa: Usar SSH (Mais Seguro)

Se preferir usar SSH:

### 1. Verificar se já tem chave SSH:
```bash
ls -la ~/.ssh/id_ed25519.pub
```

### 2. Se não tiver, criar:
```bash
ssh-keygen -t ed25519 -C "seu-email@exemplo.com"
# Pressione Enter 3 vezes (aceitar padrões)
```

### 3. Copiar chave pública:
```bash
cat ~/.ssh/id_ed25519.pub
# Copie toda a saída (começa com ssh-ed25519)
```

### 4. Adicionar no GitHub:
- Acesse: **https://github.com/settings/keys**
- Clique em **"New SSH key"**
- Cole a chave pública
- Salve

### 5. Mudar remote para SSH:
```bash
cd /Users/joaosouza/youtube-shop
git remote set-url origin git@github.com:joaovvsouza/yt-shopping-validator.git
git push -u origin main
```

---

## Verificar se Funcionou

```bash
git log --oneline -1
```

Se funcionou, você verá seu commit no GitHub:
**https://github.com/joaovvsouza/yt-shopping-validator**

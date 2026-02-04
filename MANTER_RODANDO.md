# 🔄 Como Manter o Servidor Rodando Localmente

## ✅ Verificar se Está Rodando

```bash
# Verificar se há processo na porta 3000
lsof -ti:3000

# Se retornar um número, o servidor está rodando
# Se não retornar nada, o servidor não está rodando
```

## 🚀 Iniciar o Servidor

```bash
cd /Users/joaosouza/youtube-shop
npx pnpm@latest dev
```

O servidor estará disponível em: **http://localhost:3000**

---

## 🔧 Manter Rodando em Background (Recomendado)

### Opção 1: Usar `nohup` (Simples)

```bash
cd /Users/joaosouza/youtube-shop
nohup npx pnpm@latest dev > servidor.log 2>&1 &
```

Isso vai:
- ✅ Rodar em background (não bloqueia o terminal)
- ✅ Continuar rodando mesmo se fechar o terminal
- ✅ Salvar logs em `servidor.log`

**Para parar:**
```bash
# Encontrar o processo
lsof -ti:3000

# Parar o processo
kill $(lsof -ti:3000)
```

---

### Opção 2: Usar `screen` (Melhor Controle)

1. **Instalar screen** (se não tiver):
   ```bash
   # macOS já vem com screen instalado
   ```

2. **Criar uma sessão screen:**
   ```bash
   screen -S youtube-shop
   ```

3. **Dentro do screen, iniciar o servidor:**
   ```bash
   cd /Users/joaosouza/youtube-shop
   npx pnpm@latest dev
   ```

4. **Desconectar do screen** (mantém rodando):
   - Pressione: `Ctrl + A` depois `D`

5. **Reconectar ao screen:**
   ```bash
   screen -r youtube-shop
   ```

6. **Ver todas as sessões:**
   ```bash
   screen -ls
   ```

**Para parar:**
- Reconecte ao screen (`screen -r youtube-shop`)
- Pressione `Ctrl + C` para parar o servidor
- Digite `exit` para fechar o screen

---

### Opção 3: Usar `tmux` (Alternativa ao screen)

1. **Instalar tmux** (se não tiver):
   ```bash
   brew install tmux
   ```

2. **Criar uma sessão tmux:**
   ```bash
   tmux new -s youtube-shop
   ```

3. **Dentro do tmux, iniciar o servidor:**
   ```bash
   cd /Users/joaosouza/youtube-shop
   npx pnpm@latest dev
   ```

4. **Desconectar do tmux** (mantém rodando):
   - Pressione: `Ctrl + B` depois `D`

5. **Reconectar ao tmux:**
   ```bash
   tmux attach -t youtube-shop
   ```

---

## 📋 Script Automatizado para Iniciar em Background

Criei um script `iniciar-servidor.sh` que você pode usar:

```bash
cd /Users/joaosouza/youtube-shop
./iniciar-servidor.sh
```

Isso iniciará o servidor em background e salvará o PID em um arquivo.

**Para parar:**
```bash
./parar-servidor.sh
```

---

## 🔍 Verificar Status

```bash
# Ver se está rodando
lsof -ti:3000 && echo "✅ Servidor rodando" || echo "❌ Servidor parado"

# Ver logs (se usou nohup)
tail -f servidor.log

# Ver processos relacionados
ps aux | grep -E "(pnpm|tsx|node)" | grep -v grep
```

---

## 🛑 Parar o Servidor

```bash
# Método 1: Matar processo na porta 3000
kill $(lsof -ti:3000)

# Método 2: Se souber o PID
kill <PID>

# Método 3: Forçar parada
kill -9 $(lsof -ti:3000)
```

---

## ⚙️ Configurar para Iniciar Automaticamente (Opcional)

### macOS - Usar launchd

1. **Crie um arquivo** `~/Library/LaunchAgents/com.youtube-shop.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.youtube-shop</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/usr/local/bin/pnpm</string>
        <string>dev</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/Users/joaosouza/youtube-shop</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/Users/joaosouza/youtube-shop/servidor.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/joaosouza/youtube-shop/servidor.error.log</string>
</dict>
</plist>
```

2. **Carregar o serviço:**
```bash
launchctl load ~/Library/LaunchAgents/com.youtube-shop.plist
```

3. **Iniciar:**
```bash
launchctl start com.youtube-shop
```

4. **Parar:**
```bash
launchctl stop com.youtube-shop
```

---

## 💡 Dicas

- **Mantenha o terminal aberto** se quiser ver os logs em tempo real
- **Use `screen` ou `tmux`** se quiser reconectar depois
- **Use `nohup`** se quiser que continue rodando após fechar o terminal
- **Verifique os logs** se algo não estiver funcionando

---

## 🆘 Problemas Comuns

### Porta 3000 já está em uso
```bash
# Ver o que está usando
lsof -ti:3000

# Parar o processo
kill $(lsof -ti:3000)
```

### Servidor para de funcionar
- Verifique os logs: `tail -f servidor.log`
- Reinicie: `kill $(lsof -ti:3000) && npx pnpm@latest dev`

### Não consegue acessar localhost:3000
- Verifique se o servidor está rodando: `lsof -ti:3000`
- Tente outra porta: `PORT=3001 npx pnpm@latest dev`

#!/bin/bash

# Script para publicar o projeto online rapidamente

echo "🌐 Publicando projeto online..."
echo ""

# Verifica se o servidor está rodando
if ! lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  Servidor não está rodando na porta 3000"
    echo "🚀 Iniciando servidor..."
    cd "$(dirname "$0")"
    npx pnpm@latest dev &
    SERVER_PID=$!
    echo "⏳ Aguardando servidor iniciar..."
    sleep 5
    echo "✅ Servidor iniciado (PID: $SERVER_PID)"
    echo ""
else
    echo "✅ Servidor já está rodando na porta 3000"
    echo ""
fi

# Tenta usar cloudflared primeiro
if command -v cloudflared &> /dev/null; then
    echo "🌐 Usando Cloudflare Tunnel..."
    echo "📋 URL pública será exibida abaixo:"
    echo ""
    cloudflared tunnel --url http://localhost:3000
elif command -v ngrok &> /dev/null; then
    echo "🌐 Usando ngrok..."
    echo "📋 URL pública será exibida abaixo:"
    echo ""
    ngrok http 3000
elif command -v lt &> /dev/null || command -v npx &> /dev/null; then
    echo "🌐 Usando localtunnel (via npx)..."
    echo "📋 URL pública será exibida abaixo:"
    echo ""
    npx localtunnel --port 3000
else
    echo "❌ Nenhum túnel encontrado!"
    echo ""
    echo "📥 Instale uma das opções:"
    echo ""
    echo "Opção 1 - localtunnel (mais fácil):"
    echo "  npm install -g localtunnel"
    echo ""
    echo "Opção 2 - Cloudflare Tunnel:"
    echo "  Baixe de: https://github.com/cloudflare/cloudflared/releases"
    echo "  Ou instale Homebrew primeiro: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo ""
    echo "Opção 3 - ngrok:"
    echo "  Baixe de: https://ngrok.com/download"
    echo ""
    echo "Depois execute este script novamente."
    exit 1
fi

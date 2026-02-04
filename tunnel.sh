#!/bin/bash

# Script para iniciar o servidor com túnel público
# Uso: ./tunnel.sh [cloudflare|ngrok|localtunnel]

PORT=${PORT:-3000}
TUNNEL_TYPE=${1:-cloudflare}

echo "🚀 Iniciando servidor na porta $PORT..."

# Inicia o servidor em background
pnpm dev &
SERVER_PID=$!

# Aguarda o servidor iniciar
echo "⏳ Aguardando servidor iniciar..."
sleep 3

# Verifica se o servidor está rodando
if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo "❌ Erro ao iniciar o servidor"
    exit 1
fi

echo "✅ Servidor iniciado (PID: $SERVER_PID)"
echo ""

# Inicia o túnel baseado no tipo escolhido
case $TUNNEL_TYPE in
    cloudflare)
        echo "🌐 Iniciando Cloudflare Tunnel..."
        echo "📋 Instale cloudflared se necessário: brew install cloudflared"
        cloudflared tunnel --url http://localhost:$PORT
        ;;
    ngrok)
        echo "🌐 Iniciando ngrok..."
        echo "📋 Certifique-se de que ngrok está instalado e configurado"
        ngrok http $PORT
        ;;
    localtunnel)
        echo "🌐 Iniciando localtunnel..."
        echo "📋 Instale localtunnel se necessário: npm install -g localtunnel"
        lt --port $PORT
        ;;
    *)
        echo "❌ Tipo de túnel inválido: $TUNNEL_TYPE"
        echo "Uso: ./tunnel.sh [cloudflare|ngrok|localtunnel]"
        kill $SERVER_PID
        exit 1
        ;;
esac

# Limpa ao sair
trap "kill $SERVER_PID 2>/dev/null" EXIT

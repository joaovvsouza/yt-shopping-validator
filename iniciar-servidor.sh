#!/bin/bash

# Script para iniciar o servidor em background

cd "$(dirname "$0")"

# Verifica se já está rodando
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  Servidor já está rodando na porta 3000"
    echo "📋 PID: $(lsof -ti:3000)"
    echo ""
    echo "Para parar, execute: ./parar-servidor.sh"
    exit 1
fi

echo "🚀 Iniciando servidor em background..."
echo ""

# Inicia o servidor em background e salva o PID
nohup npx pnpm@latest dev > servidor.log 2>&1 &
SERVER_PID=$!

# Aguarda um pouco para verificar se iniciou
sleep 3

# Verifica se ainda está rodando
if kill -0 $SERVER_PID 2>/dev/null; then
    echo $SERVER_PID > servidor.pid
    echo "✅ Servidor iniciado com sucesso!"
    echo "📋 PID: $SERVER_PID"
    echo "📝 Logs salvos em: servidor.log"
    echo "🌐 Acesse: http://localhost:3000"
    echo ""
    echo "Para ver os logs em tempo real:"
    echo "  tail -f servidor.log"
    echo ""
    echo "Para parar o servidor:"
    echo "  ./parar-servidor.sh"
    echo "  ou"
    echo "  kill $SERVER_PID"
else
    echo "❌ Erro ao iniciar o servidor"
    echo "📋 Verifique os logs: cat servidor.log"
    exit 1
fi

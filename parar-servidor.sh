#!/bin/bash

# Script para parar o servidor

cd "$(dirname "$0")"

# Tenta ler o PID do arquivo
if [ -f servidor.pid ]; then
    PID=$(cat servidor.pid)
    if kill -0 $PID 2>/dev/null; then
        echo "🛑 Parando servidor (PID: $PID)..."
        kill $PID
        rm servidor.pid
        echo "✅ Servidor parado"
    else
        echo "⚠️  PID do arquivo não está mais rodando"
        rm servidor.pid
    fi
fi

# Também tenta parar qualquer processo na porta 3000
if lsof -ti:3000 > /dev/null 2>&1; then
    PID=$(lsof -ti:3000)
    echo "🛑 Parando processo na porta 3000 (PID: $PID)..."
    kill $PID
    sleep 1
    
    # Se ainda estiver rodando, força
    if lsof -ti:3000 > /dev/null 2>&1; then
        echo "⚠️  Forçando parada..."
        kill -9 $(lsof -ti:3000)
    fi
    
    echo "✅ Servidor parado"
else
    echo "ℹ️  Nenhum servidor rodando na porta 3000"
fi

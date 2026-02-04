#!/bin/bash

# Script para configurar o Git e conectar ao repositório remoto

cd /Users/joaosouza/youtube-shop

# Remove o .git existente se houver problemas
if [ -d .git ]; then
    echo "Removendo .git existente..."
    rm -rf .git
fi

# Inicializa o repositório Git
echo "Inicializando repositório Git..."
git init

# Adiciona o remote
echo "Configurando remote..."
git remote add origin https://github.com/joaovvsouza/yt-shopping-validator.git

# Configura a branch principal
echo "Configurando branch main..."
git branch -M main

# Adiciona todos os arquivos
echo "Adicionando arquivos..."
git add .

# Faz o commit inicial
echo "Fazendo commit inicial..."
git commit -m "Initial commit: projeto migrado"

# Mostra o status
echo ""
echo "Status do repositório:"
git status

echo ""
echo "Para fazer push, execute:"
echo "  git push -u origin main"
echo ""
echo "Ou se o repositório remoto já tem conteúdo:"
echo "  git pull origin main --allow-unrelated-histories"
echo "  git push -u origin main"

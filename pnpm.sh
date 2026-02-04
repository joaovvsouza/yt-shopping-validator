#!/bin/bash

# Script para usar pnpm via npx (sem precisar instalar globalmente)
# Uso: ./pnpm.sh [comando] [argumentos]

cd "$(dirname "$0")"
npx pnpm@latest "$@"

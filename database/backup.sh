#!/bin/bash

# Script de backup do banco de dados MySQL
# Uso: ./backup.sh [opção]

BACKUP_DIR="/workspaces/ProjetoCBGames/database/backups"
DB_NAME="character_creator"
DB_USER="character_app"
DB_PASS="AppSecurePass456!"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql"

# Criar diretório de backups se não existir
mkdir -p "$BACKUP_DIR"

case "$1" in
    "backup")
        echo "🔧 Criando backup do banco de dados..."
        mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_FILE"
        
        if [ $? -eq 0 ]; then
            echo "✅ Backup criado: $BACKUP_FILE"
            echo "📊 Tamanho do backup: $(du -h "$BACKUP_FILE" | cut -f1)"
        else
            echo "❌ Erro ao criar backup!"
            exit 1
        fi
        ;;
        
    "restore")
        if [ -z "$2" ]; then
            echo "⚠️  Uso: $0 restore <arquivo_backup.sql>"
            exit 1
        fi
        
        BACKUP_FILE="$2"
        if [ ! -f "$BACKUP_FILE" ]; then
            echo "❌ Arquivo de backup não encontrado: $BACKUP_FILE"
            exit 1
        fi
        
        echo "🔧 Restaurando backup: $BACKUP_FILE"
        echo "⚠️  ATENÇÃO: Isso irá sobrescrever o banco de dados atual!"
        read -p "Continuar? (s/n): " -n 1 -r
        echo
        
        if [[ $REPLY =~ ^[Ss]$ ]]; then
            mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$BACKUP_FILE"
            
            if [ $? -eq 0 ]; then
                echo "✅ Backup restaurado com sucesso!"
            else
                echo "❌ Erro ao restaurar backup!"
            fi
        else
            echo "❌ Restauração cancelada."
        fi
        ;;
        
    "list")
        echo "📋 Lista de backups disponíveis:"
        ls -lh "$BACKUP_DIR"/*.sql 2>/dev/null || echo "Nenhum backup encontrado."
        ;;
        
    "cleanup")
        echo "🗑️  Limpando backups antigos (mantendo últimos 7 dias)..."
        find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete
        echo "✅ Limpeza concluída!"
        ;;
        
    *)
        echo "📌 Uso: $0 {backup|restore|list|cleanup}"
        echo ""
        echo "Comandos disponíveis:"
        echo "  backup     - Criar backup do banco de dados"
        echo "  restore    - Restaurar de um arquivo de backup"
        echo "  list       - Listar backups disponíveis"
        echo "  cleanup    - Remover backups antigos (7+ dias)"
        exit 1
        ;;
esac

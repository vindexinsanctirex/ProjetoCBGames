#!/bin/bash

echo "========================================="
echo "  🚀 INICIANDO CRIADOR DE PERSONAGENS   "
echo "========================================="

# Configurações
MYSQL_ROOT_PASS="RootSecurePass123!"
MYSQL_APP_PASS="AppSecurePass456!"
BACKEND_PORT=5000
FRONTEND_PORT=3000

# Função para verificar se MySQL está rodando
check_mysql() {
    if mysql -u root -p"$MYSQL_ROOT_PASS" -e "SELECT 1;" 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Função para iniciar MySQL
start_mysql() {
    echo "🔧 Iniciando MySQL..."
    
    # Parar MySQL se estiver rodando
    sudo pkill mysqld 2>/dev/null
    sleep 2
    
    # Tentar iniciar MySQL
    sudo mysqld_safe --user=mysql &
    
    # Aguardar MySQL iniciar
    local timeout=30
    local counter=0
    
    while ! check_mysql && [ $counter -lt $timeout ]; do
        echo "⏳ Aguardando MySQL iniciar... ($counter/$timeout)"
        sleep 1
        ((counter++))
    done
    
    if check_mysql; then
        echo "✅ MySQL iniciado com sucesso!"
        return 0
    else
        echo "❌ Falha ao iniciar MySQL!"
        return 1
    fi
}

# Função para criar backup inicial
create_initial_backup() {
    echo "💾 Criando backup inicial..."
    ./database/backup.sh backup
}

# Função para iniciar backend
start_backend() {
    echo "🔧 Iniciando Backend..."
    
    cd /workspaces/ProjetoCBGames/backend
    
    # Instalar dependências se necessário
    if [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependências do backend..."
        npm install
    fi
    
    # Iniciar servidor em background
    npm start &
    
    # Aguardar backend iniciar
    local timeout=30
    local counter=0
    
    while ! curl -s http://localhost:$BACKEND_PORT/api/health >/dev/null && [ $counter -lt $timeout ]; do
        echo "⏳ Aguardando backend iniciar... ($counter/$timeout)"
        sleep 1
        ((counter++))
    done
    
    if curl -s http://localhost:$BACKEND_PORT/api/health >/dev/null; then
        echo "✅ Backend iniciado na porta $BACKEND_PORT"
        return 0
    else
        echo "❌ Falha ao iniciar backend!"
        return 1
    fi
}

# Função para iniciar frontend
start_frontend() {
    echo "🔧 Iniciando Frontend..."
    
    cd /workspaces/ProjetoCBGames/frontend
    
    # Instalar dependências se necessário
    if [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependências do frontend..."
        npm install
    fi
    
    # Iniciar React em background
    npm start &
    
    # Aguardar frontend iniciar
    local timeout=30
    local counter=0
    
    while ! curl -s http://localhost:$FRONTEND_PORT >/dev/null && [ $counter -lt $timeout ]; do
        echo "⏳ Aguardando frontend iniciar... ($counter/$timeout)"
        sleep 1
        ((counter++))
    done
    
    if curl -s http://localhost:$FRONTEND_PORT >/dev/null; then
        echo "✅ Frontend iniciado na porta $FRONTEND_PORT"
        return 0
    else
        echo "⚠️  Frontend pode estar demorando para iniciar..."
        return 0
    fi
}

# Função para mostrar URLs
show_urls() {
    echo ""
    echo "========================================="
    echo "          🌐 URLs DE ACESSO             "
    echo "========================================="
    echo ""
    
    if [ -n "$CODESPACE_NAME" ]; then
        echo "📱 NO CODESPACES:"
        echo "   • Frontend: https://${CODESPACE_NAME}-${FRONTEND_PORT}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
        echo "   • Backend API: https://${CODESPACE_NAME}-${BACKEND_PORT}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
        echo ""
    fi
    
    echo "💻 LOCALMENTE:"
    echo "   • Frontend: http://localhost:${FRONTEND_PORT}"
    echo "   • Backend API: http://localhost:${BACKEND_PORT}"
    echo ""
    
    echo "🔧 ENDPOINTS DA API:"
    echo "   • Saúde: http://localhost:${BACKEND_PORT}/api/health"
    echo "   • Documentação: http://localhost:${BACKEND_PORT}/api/docs"
    echo "   • Login: http://localhost:${BACKEND_PORT}/api/auth/login"
    echo ""
    
    echo "🔑 CREDENCIAIS DE TESTE:"
    echo "   • Usuário: admin | Senha: admin123"
    echo "   • Usuário: jogador1 | Senha: jogador123"
    echo "   • Usuário: teste | Senha: teste123"
    echo ""
}

# Função para monitorar serviços
monitor_services() {
    echo ""
    echo "========================================="
    echo "          📊 STATUS DOS SERVIÇOS         "
    echo "========================================="
    echo ""
    
    echo "🔄 Monitorando serviços (Ctrl+C para parar)..."
    echo ""
    
    while true; do
        clear
        
        echo "🕐 $(date '+%H:%M:%S') - Status dos Serviços"
        echo "-----------------------------------------"
        
        # MySQL
        if check_mysql; then
            echo "✅ MySQL: ONLINE"
            mysql_status=$(mysql -u root -p"$MYSQL_ROOT_PASS" -e "SHOW DATABASES;" 2>/dev/null | grep -c character_creator)
            if [ $mysql_status -eq 1 ]; then
                echo "   📊 Banco de dados 'character_creator': OK"
            else
                echo "   ⚠️  Banco de dados 'character_creator': NÃO ENCONTRADO"
            fi
        else
            echo "❌ MySQL: OFFLINE"
        fi
        
        echo ""
        
        # Backend
        if curl -s http://localhost:$BACKEND_PORT/api/health >/dev/null; then
            echo "✅ Backend: ONLINE (porta $BACKEND_PORT)"
            health=$(curl -s http://localhost:$BACKEND_PORT/api/health | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
            echo "   🩺 Saúde: $health"
        else
            echo "❌ Backend: OFFLINE"
        fi
        
        echo ""
        
        # Frontend
        if curl -s http://localhost:$FRONTEND_PORT >/dev/null; then
            echo "✅ Frontend: ONLINE (porta $FRONTEND_PORT)"
        else
            echo "⚠️  Frontend: AGUARDANDO"
        fi
        
        echo ""
        echo "-----------------------------------------"
        echo "Pressione Ctrl+C para voltar ao menu"
        
        sleep 5
    done
}

# Função principal
main() {
    echo "🔍 Verificando ambiente..."
    
    # Verificar e iniciar MySQL
    if ! check_mysql; then
        start_mysql
        if [ $? -ne 0 ]; then
            echo "❌ Não foi possível iniciar o MySQL. Abortando."
            exit 1
        fi
    else
        echo "✅ MySQL já está rodando"
    fi
    
    # Criar backup inicial
    create_initial_backup
    
    # Iniciar backend
    start_backend
    
    # Iniciar frontend
    start_frontend
    
    # Mostrar URLs
    show_urls
    
    # Menu interativo
    while true; do
        echo ""
        echo "========================================="
        echo "            🎮 MENU PRINCIPAL           "
        echo "========================================="
        echo ""
        echo "1. 🔄 Monitorar status dos serviços"
        echo "2. 💾 Criar backup do banco de dados"
        echo "3. 📋 Listar backups disponíveis"
        echo "4. 🛠️  Ver logs do sistema"
        echo "5. 🔑 Testar conexão com MySQL"
        echo "6. 🧪 Testar API"
        echo "7. 🚪 Sair"
        echo ""
        read -p "Escolha uma opção (1-7): " choice
        
        case $choice in
            1)
                monitor_services
                ;;
            2)
                ./database/backup.sh backup
                ;;
            3)
                ./database/backup.sh list
                ;;
            4)
                echo "📄 Últimas linhas dos logs:"
                echo "---------------------------"
                tail -20 /var/log/mysql/error.log 2>/dev/null || echo "Log do MySQL não encontrado"
                echo ""
                ;;
            5)
                echo "🔍 Testando conexão com MySQL..."
                if check_mysql; then
                    echo "✅ Conexão bem-sucedida!"
                    echo ""
                    echo "📊 Informações do banco:"
                    mysql -u root -p"$MYSQL_ROOT_PASS" -e "
                        SELECT 'Usuários registrados:' AS '';
                        SELECT COUNT(*) as total_usuarios FROM character_creator.users;
                        
                        SELECT 'Personagens criados:' AS '';
                        SELECT COUNT(*) as total_personagens FROM character_creator.characters;
                        
                        SELECT 'Atividade recente:' AS '';
                        SELECT 
                            u.username,
                            c.name as personagem,
                            c.created_at
                        FROM character_creator.characters c
                        JOIN character_creator.users u ON c.user_id = u.id
                        ORDER BY c.created_at DESC
                        LIMIT 5;
                    "
                else
                    echo "❌ Falha na conexão com MySQL"
                fi
                ;;
            6)
                echo "🧪 Testando API..."
                echo "------------------"
                echo "1. Teste de saúde:"
                curl -s http://localhost:$BACKEND_PORT/api/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:$BACKEND_PORT/api/health
                echo ""
                echo "2. Listar personagens:"
                curl -s http://localhost:$BACKEND_PORT/api/characters | python3 -m json.tool 2>/dev/null || curl -s http://localhost:$BACKEND_PORT/api/characters | head -200
                ;;
            7)
                echo "👋 Encerrando sistema..."
                echo "🛑 Parando serviços..."
                pkill -f "node server.js"
                pkill -f "react-scripts"
                sudo pkill mysqld
                echo "✅ Sistema encerrado. Até logo!"
                exit 0
                ;;
            *)
                echo "❌ Opção inválida. Tente novamente."
                ;;
        esac
    done
}

# Executar função principal
main

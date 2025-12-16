# 🎮 Character Creator - Projeto CB Games

Um sistema completo para criação e personalização de personagens com sistema de login seguro, desenvolvido em Node.js, React e MySQL.

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Uso da Aplicação](#uso-da-aplicação)
- [API Endpoints](#api-endpoints)
- [Banco de Dados](#banco-de-dados)
- [Deploy](#deploy)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🚀 Visão Geral

O Character Creator é uma aplicação web que permite aos usuários criar, personalizar e gerenciar personagens de RPG/jogos com um sistema completo de autenticação. O projeto foi desenvolvido para o Projeto CB Games como uma demonstração de habilidades em desenvolvimento full-stack.

### ✨ Demonstração

- **Frontend**: Aplicação React com interface moderna e responsiva
- **Backend**: API RESTful com Node.js/Express e autenticação JWT
- **Banco de Dados**: MySQL com estrutura relacional completa
- **Segurança**: Senhas criptografadas, tokens JWT, proteção contra ataques

## 🎯 Funcionalidades

### 🔐 Sistema de Autenticação
- ✅ Registro de novos usuários
- ✅ Login com validação de credenciais
- ✅ Tokens JWT para sessões seguras
- ✅ Logout automático
- ✅ Proteção de rotas

### 🎨 Criação de Personagens
- ✅ Nome personalizado
- ✅ Atributos ajustáveis (1-10):
  - Força
  - Inteligência
  - Agilidade
  - Resistência
  - Carisma
  - Sabedoria
- ✅ Personalização visual:
  - Cor da pele (seletor de cores)
  - Cor e estilo do cabelo
  - Cor dos olhos
- ✅ Características físicas:
  - Altura (120-250cm)
  - Peso (40-150kg)
- ✅ Personalidade e história
- ✅ Pré-visualização em tempo real

### 📊 Gerenciamento
- ✅ Lista de personagens com paginação
- ✅ Filtros e ordenação
- ✅ Edição de personagens existentes
- ✅ Exclusão com confirmação
- ✅ Clonagem de personagens
- ✅ Dashboard com estatísticas

### 🛡️ Recursos de Segurança
- ✅ Senhas criptografadas com bcrypt
- ✅ Tokens JWT com expiração
- ✅ Rate limiting
- ✅ Validação de dados de entrada
- ✅ CORS configurado
- ✅ Headers de segurança

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** (v18+) - Runtime JavaScript
- **Express** - Framework web
- **MySQL 8.0** - Banco de dados relacional
- **JWT** - Autenticação por tokens
- **bcryptjs** - Criptografia de senhas
- **CORS** - Compartilhamento de recursos entre origens
- **Helmet** - Segurança de headers HTTP
- **Express Validator** - Validação de dados

### Frontend
- **React 18** - Biblioteca UI
- **React Router DOM** - Navegação
- **Context API** - Gerenciamento de estado
- **Fetch API** - Comunicação com backend
- **CSS Modules** - Estilização modular
- **Responsive Design** - Design responsivo

### Ferramentas de Desenvolvimento
- **Git** - Controle de versão
- **GitHub Codespaces** - Ambiente de desenvolvimento
- **ESLint** - Linting de código
- **Postman** - Teste de API
- **MySQL Workbench** - Gerenciamento do banco

## 📁 Estrutura do Projeto
ProjetoCBGames/
├── backend/ # API Node.js/Express
│ ├── src/
│ │ ├── config/ # Configurações do banco
│ │ ├── controllers/ # Controladores da API
│ │ ├── middlewares/ # Middlewares (auth, validation)
│ │ ├── models/ # Modelos do banco de dados
│ │ ├── routes/ # Rotas da API
│ │ ├── utils/ # Utilitários
│ │ └── server.js # Ponto de entrada
│ ├── package.json
│ ├── .env # Variáveis de ambiente
│ └── test-server.js # Servidor simplificado para testes
│
├── frontend/ # Aplicação React
│ ├── public/
│ │ └── index.html
│ ├── src/
│ │ ├── components/ # Componentes reutilizáveis
│ │ ├── pages/ # Páginas da aplicação
│ │ ├── services/ # Serviços de API
│ │ ├── context/ # Contexto React
│ │ └── App.js # Componente principal
│ └── package.json
│
├── database/ # Scripts do banco de dados
│ ├── schema.sql # Estrutura do banco
│ ├── backup.sh # Script de backup
│ └── backups/ # Backups do banco
│
├── executavel/ # Scripts executáveis
│ ├── start.sh # Inicialização (Linux/Mac)
│ └── start.bat # Inicialização (Windows)
│
├── docs/ # Documentação
├── .gitignore # Arquivos ignorados pelo Git
└── README.md # Este arquivo

text

## ⚡ Instalação e Configuração

### Pré-requisitos

- Node.js v18 ou superior
- MySQL 8.0 ou superior
- Git
- NPM ou Yarn

### Passo 1: Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd ProjetoCBGames
Passo 2: Configurar Banco de Dados
bash
# Acessar MySQL
mysql -u root -p

# Executar script do banco
source database/schema.sql

# Ou importar pelo phpMyAdmin
Passo 3: Configurar Backend
bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações
Arquivo .env:

env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=character_creator
DB_USER=character_app
DB_PASSWORD=AppSecurePass456!
JWT_SECRET=SuperSecretJWTKeyForCharacterCreator2024!
PORT=5000
Passo 4: Configurar Frontend
bash
cd frontend

# Instalar dependências
npm install

# Configurar URL da API (se necessário)
# Editar src/services/api.ts se a API estiver em outro host
Passo 5: Iniciar a Aplicação
Opção A: Usando Scripts de Inicialização
bash
# Linux/Mac
chmod +x executavel/start.sh
./executavel/start.sh

# Windows
executavel/start.bat
Opção B: Iniciar Manualmente
Terminal 1 - Backend:

bash
cd backend
npm start
# ou para desenvolvimento: npm run dev
Terminal 2 - Frontend:

bash
cd frontend
npm start
Passo 6: Acessar a Aplicação
Frontend: http://localhost:3000

Backend API: http://localhost:5000

Documentação da API: http://localhost:5000/api-docs

🎮 Uso da Aplicação
1. Primeiro Acesso
Acesse http://localhost:3000

Faça login com um dos usuários de teste:

admin / admin123 (Administrador completo)

jogador1 / jogador123 (Jogador com personagens)

teste / teste123 (Usuário de teste)

2. Criar um Personagem
Clique em "Criar Personagem" no menu

Preencha o nome do personagem

Ajuste os atributos usando os sliders

Personalize a aparência (cores, estilo)

Adicione personalidade e história

Clique em "Criar Personagem"

3. Gerenciar Personagens
Acesse "Meus Personagens" no menu

Veja a lista de todos os seus personagens

Use os filtros para encontrar personagens específicos

Clique em um personagem para ver detalhes

Use os botões de ação para editar, clonar ou excluir

4. Dashboard
A página inicial mostra estatísticas

Veja o status da API e do banco de dados

Acesse ações rápidas

Monitore sua atividade

🌐 API Endpoints
Autenticação
POST /api/auth/login - Login de usuário

POST /api/auth/register - Registro de novo usuário

POST /api/auth/refresh - Renovar token

GET /api/auth/profile - Perfil do usuário

Personagens
GET /api/characters - Listar personagens

GET /api/characters/my - Personagens do usuário

GET /api/characters/:id - Detalhes do personagem

POST /api/characters - Criar personagem

PUT /api/characters/:id - Atualizar personagem

DELETE /api/characters/:id - Excluir personagem

GET /api/characters/stats - Estatísticas

Saúde do Sistema
GET /api/health - Verificar status da API

GET / - Informações da API

🗄️ Banco de Dados
Estrutura Principal
Tabela users
sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(32) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    failed_login_attempts INT DEFAULT 0,
    last_login TIMESTAMP NULL,
    account_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Tabela characters
sql
CREATE TABLE characters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    strength TINYINT DEFAULT 5 CHECK (strength BETWEEN 1 AND 10),
    intelligence TINYINT DEFAULT 5 CHECK (intelligence BETWEEN 1 AND 10),
    agility TINYINT DEFAULT 5 CHECK (agility BETWEEN 1 AND 10),
    stamina TINYINT DEFAULT 5 CHECK (stamina BETWEEN 1 AND 10),
    charisma TINYINT DEFAULT 5 CHECK (charisma BETWEEN 1 AND 10),
    wisdom TINYINT DEFAULT 5 CHECK (wisdom BETWEEN 1 AND 10),
    skin_color VARCHAR(7) DEFAULT '#FFCC99',
    hair_color VARCHAR(7) DEFAULT '#000000',
    hair_style ENUM('short','medium','long','curly','bald','ponytail','dreadlocks','mohawk') DEFAULT 'short',
    eye_color VARCHAR(7) DEFAULT '#000000',
    height SMALLINT DEFAULT 170 CHECK (height BETWEEN 120 AND 250),
    weight SMALLINT DEFAULT 70 CHECK (weight BETWEEN 40 AND 150),
    personality VARCHAR(100),
    backstory TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
Dados de Exemplo
O banco já inclui usuários e personagens de exemplo:

Usuários
admin (admin@charactercreator.com) - Administrador

jogador1 (jogador1@example.com) - Jogador exemplo

teste (teste@example.com) - Usuário de teste

Personagens
Aragorn (admin) - Guerreiro humano

Gandalf (admin) - Mago poderoso

Légolas (jogador1) - Elfo arqueiro

Gimli (teste) - Anão guerreiro

Backup e Restauração
bash
# Criar backup
./database/backup.sh backup

# Listar backups
./database/backup.sh list

# Restaurar backup
./database/backup.sh restore database/backups/arquivo.sql

# Limpar backups antigos
./database/backup.sh cleanup
🚀 Deploy
Ambiente de Produção
Configurar variáveis de ambiente de produção

Usar HTTPS (certificado SSL)

Configurar firewall e restrições de acesso

Implementar logging apropriado

Configurar backups automáticos

Monitorar performance e segurança

Docker (Opcional)
dockerfile
# Dockerfile para backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
Plataformas de Hospedagem
Backend: Railway, Heroku, AWS EC2, DigitalOcean

Frontend: Vercel, Netlify, GitHub Pages

Banco de Dados: AWS RDS, MySQL Cloud, PlanetScale

🤝 Contribuição
Contribuições são bem-vindas! Siga os passos:

Fork o projeto

Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)

Commit suas mudanças (git commit -m 'Add some AmazingFeature')

Push para a branch (git push origin feature/AmazingFeature)

Abra um Pull Request

Padrões de Código
Use ESLint para manter consistência

Escreva testes para novas funcionalidades

Documente mudanças na API

Mantenha o README atualizado


🆘 Suporte
Em caso de problemas:

Verifique os logs do servidor

Confirme as configurações do banco de dados

Teste os endpoints da API com Postman

Consulte a documentação

Abra uma issue no repositório


Última atualização: Dezembro 2024
Versão: 1.0.0
Status: ✅ Em funcionamento

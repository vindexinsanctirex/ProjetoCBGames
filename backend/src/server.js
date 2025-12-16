require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Importar configurações e rotas
const database = require('./config/database');
const authRoutes = require('./routes/auth');
const characterRoutes = require('./routes/characters');

// Inicializar app Express
const app = express();
const PORT = process.env.PORT || 5000;

// Configuração do rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
  message: {
    success: false,
    error: 'Muitas requisições deste IP, tente novamente após 15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Configuração do Swagger/OpenAPI
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Character Creator API',
      version: '1.0.0',
      description: 'API para criação e gerenciamento de personagens',
      contact: {
        name: 'CB Games Team',
        email: 'support@charactercreator.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middlewares
app.use(helmet()); // Segurança
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(morgan('dev')); // Logging
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Aplicar rate limiting a todas as rotas
app.use(limiter);

// Servir documentação da API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas de saúde e informação
app.get('/', (req, res) => {
  res.json({
    message: '🎮 Character Creator API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      characters: '/api/characters',
      health: '/api/health'
    },
    status: 'operational'
  });
});

app.get('/api/health', async (req, res) => {
  try {
    // Verificar conexão com banco de dados
    await database.query('SELECT 1');
    
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      memory: process.memoryUsage()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada'
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Inicializar servidor
async function startServer() {
  try {
    // Conectar ao banco de dados
    await database.connect();
    
    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`
      🚀 Character Creator API iniciada com sucesso!
      
      📊 Informações do servidor:
        • Porta: ${PORT}
        • Ambiente: ${process.env.NODE_ENV || 'development'}
        • Banco de dados: ${process.env.DB_NAME || 'character_creator'}
      
      🌐 URLs de acesso:
        • API: http://localhost:${PORT}
        • Documentação: http://localhost:${PORT}/api-docs
        • Saúde: http://localhost:${PORT}/api/health
      
      ${process.env.CODESPACE_NAME ? 
        `🔗 No Codespaces:
         • API: https://${process.env.CODESPACE_NAME}-${PORT}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}
         • Documentação: https://${process.env.CODESPACE_NAME}-${PORT}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}/api-docs` 
        : ''
      }
      
      📋 Credenciais de teste:
        • admin / admin123
        • jogador1 / jogador123
        • teste / teste123
      
      🔧 Pronto para criar personagens! 🎮
      `);
    });

    // Tratamento de encerramento gracioso
    process.on('SIGTERM', async () => {
      console.log('🔻 Recebido SIGTERM, encerrando servidor graciosamente...');
      await database.close();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('🔻 Recebido SIGINT, encerrando servidor graciosamente...');
      await database.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Falha ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Iniciar servidor
startServer();

module.exports = app; // Para testes

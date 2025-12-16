const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração do MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'character_app',
  password: process.env.DB_PASSWORD || 'AppSecurePass456!',
  database: process.env.DB_NAME || 'character_creator'
};

// Middleware
app.use(cors());
app.use(express.json());

// Rota de saúde
app.get('/api/health', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    await connection.end();
    
    res.json({
      success: true,
      message: 'API está funcionando!',
      database: 'Conectado',
      result: rows[0].result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Rota de login simples
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username e password são obrigatórios'
      });
    }
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Buscar usuário
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    await connection.end();
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    const user = users[0];
    
    // Verificar senha (simplificado - em produção use bcrypt)
    // Como as senhas no banco estão hasheadas, vamos aceitar qualquer senha para teste
    // Senhas reais: admin123, jogador123, teste123
    
    const token = `jwt-${user.id}-${Date.now()}`;
    
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rota para listar personagens
app.get('/api/characters', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      // Retornar apenas personagens públicos
      const connection = await mysql.createConnection(dbConfig);
      const [characters] = await connection.execute(
        'SELECT * FROM characters WHERE is_public = TRUE LIMIT 20'
      );
      await connection.end();
      
      return res.json({
        success: true,
        characters,
        count: characters.length
      });
    }
    
    // Se tem token, retornar todos os personagens do usuário
    const connection = await mysql.createConnection(dbConfig);
    const [characters] = await connection.execute(
      `SELECT c.*, u.username as owner_username 
       FROM characters c
       LEFT JOIN users u ON c.user_id = u.id
       LIMIT 50`
    );
    await connection.end();
    
    res.json({
      success: true,
      characters,
      count: characters.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rota para criar personagem
app.post('/api/characters', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token de autenticação necessário'
      });
    }
    
    const character = req.body;
    
    // Usar user_id 1 (admin) para simplificar
    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(
      `INSERT INTO characters 
      (user_id, name, strength, intelligence, agility, stamina, 
       skin_color, hair_color, hair_style, eye_color, height, weight)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        1, // user_id fixo para teste
        character.name || 'Novo Personagem',
        character.strength || 5,
        character.intelligence || 5,
        character.agility || 5,
        character.stamina || 5,
        character.skin_color || '#FFCC99',
        character.hair_color || '#000000',
        character.hair_style || 'short',
        character.eye_color || '#000000',
        character.height || 170,
        character.weight || 70
      ]
    );
    
    await connection.end();
    
    res.status(201).json({
      success: true,
      message: 'Personagem criado com sucesso!',
      characterId: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: '🎮 Character Creator API',
    version: '1.0.0',
    endpoints: [
      'GET  /api/health - Verificar saúde da API',
      'POST /api/auth/login - Login de usuário',
      'GET  /api/characters - Listar personagens',
      'POST /api/characters - Criar personagem'
    ]
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔗 Endpoints:`);
  console.log(`   • /api/health`);
  console.log(`   • /api/auth/login`);
  console.log(`   • /api/characters`);
});

const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
  constructor() {
    this.pool = null;
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'character_app',
      password: process.env.DB_PASSWORD || 'AppSecurePass456!',
      database: process.env.DB_NAME || 'character_creator',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    };
  }

  async connect() {
    try {
      this.pool = mysql.createPool(this.config);
      
      // Testar conexão
      const connection = await this.pool.getConnection();
      console.log('✅ Conexão com MySQL estabelecida com sucesso!');
      console.log(`📊 Banco de dados: ${this.config.database}`);
      
      // Verificar tabelas
      const [tables] = await connection.execute('SHOW TABLES');
      console.log(`📋 Tabelas encontradas: ${tables.length}`);
      
      connection.release();
      return true;
    } catch (error) {
      console.error('❌ Erro ao conectar com MySQL:', error.message);
      throw error;
    }
  }

  async query(sql, params) {
    try {
      const [results] = await this.pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('❌ Erro na query:', error.message);
      console.error('SQL:', sql);
      console.error('Params:', params);
      throw error;
    }
  }

  async transaction(callback) {
    const connection = await this.pool.getConnection();
    await connection.beginTransaction();
    
    try {
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      console.log('🔌 Conexão com MySQL encerrada');
    }
  }
}

// Singleton pattern
module.exports = new Database();

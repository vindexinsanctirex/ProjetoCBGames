const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Criar novo usuário
  static async create(username, email, password) {
    try {
      // Verificar se usuário já existe
      const existingUser = await this.findByUsername(username);
      if (existingUser) {
        throw new Error('Usuário já cadastrado');
      }

      const existingEmail = await this.findByEmail(email);
      if (existingEmail) {
        throw new Error('Email já cadastrado');
      }

      // Gerar salt e hash da senha
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      
      const [result] = await db.query(
        `INSERT INTO users 
        (username, email, password_hash, salt, is_active) 
        VALUES (?, ?, ?, ?, ?)`,
        [username, email, passwordHash, salt, true]
      );
      
      return {
        id: result.insertId,
        username,
        email,
        isActive: true
      };
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por ID
  static async findById(id) {
    const [users] = await db.query(
      `SELECT id, username, email, is_active, 
              failed_login_attempts, last_login, account_created
       FROM users 
       WHERE id = ?`,
      [id]
    );
    
    if (users.length === 0) return null;
    
    return this.mapToUser(users[0]);
  }

  // Buscar usuário por username
  static async findByUsername(username) {
    const [users] = await db.query(
      `SELECT * FROM users WHERE username = ?`,
      [username]
    );
    
    if (users.length === 0) return null;
    
    return users[0];
  }

  // Buscar usuário por email
  static async findByEmail(email) {
    const [users] = await db.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    
    if (users.length === 0) return null;
    
    return users[0];
  }

  // Verificar credenciais
  static async verifyCredentials(username, password) {
    const user = await this.findByUsername(username);
    
    if (!user) {
      return { isValid: false, user: null };
    }
    
    if (!user.is_active) {
      throw new Error('Conta desativada');
    }
    
    // Verificar senha
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (isValid) {
      // Resetar tentativas de login falhas
      await this.resetFailedLoginAttempts(user.id);
      
      // Atualizar último login
      await this.updateLastLogin(user.id);
      
      return { 
        isValid: true, 
        user: this.mapToUser(user) 
      };
    } else {
      // Incrementar tentativas falhas
      await this.incrementFailedLoginAttempts(user.id);
      
      const updatedUser = await this.findById(user.id);
      if (updatedUser.failedLoginAttempts >= 5) {
        await this.deactivateAccount(user.id);
        throw new Error('Conta bloqueada devido a muitas tentativas falhas');
      }
      
      return { isValid: false, user: null };
    }
  }

  // Atualizar senha
  static async updatePassword(userId, newPassword) {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    
    await db.query(
      `UPDATE users 
       SET password_hash = ?, salt = ?, failed_login_attempts = 0
       WHERE id = ?`,
      [passwordHash, salt, userId]
    );
  }

  // Atualizar perfil
  static async updateProfile(userId, updates) {
    const allowedFields = ['email', 'is_active'];
    const fieldsToUpdate = {};
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        fieldsToUpdate[field] = updates[field];
      }
    });
    
    if (Object.keys(fieldsToUpdate).length === 0) {
      throw new Error('Nenhum campo válido para atualizar');
    }
    
    const setClause = Object.keys(fieldsToUpdate)
      .map(field => `${field} = ?`)
      .join(', ');
    
    const values = Object.values(fieldsToUpdate);
    values.push(userId);
    
    await db.query(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      values
    );
    
    return await this.findById(userId);
  }

  // Métodos auxiliares
  static async incrementFailedLoginAttempts(userId) {
    await db.query(
      `UPDATE users 
       SET failed_login_attempts = failed_login_attempts + 1 
       WHERE id = ?`,
      [userId]
    );
  }

  static async resetFailedLoginAttempts(userId) {
    await db.query(
      `UPDATE users 
       SET failed_login_attempts = 0 
       WHERE id = ?`,
      [userId]
    );
  }

  static async updateLastLogin(userId) {
    await db.query(
      `UPDATE users 
       SET last_login = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [userId]
    );
  }

  static async deactivateAccount(userId) {
    await db.query(
      `UPDATE users 
       SET is_active = FALSE 
       WHERE id = ?`,
      [userId]
    );
  }

  static mapToUser(dbUser) {
    return {
      id: dbUser.id,
      username: dbUser.username,
      email: dbUser.email,
      isActive: dbUser.is_active,
      failedLoginAttempts: dbUser.failed_login_attempts,
      lastLogin: dbUser.last_login,
      accountCreated: dbUser.account_created
    };
  }

  // Listar todos os usuários (admin)
  static async findAll(limit = 100, offset = 0) {
    const [users] = await db.query(
      `SELECT id, username, email, is_active, 
              failed_login_attempts, last_login, account_created
       FROM users 
       ORDER BY account_created DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    
    return users.map(this.mapToUser);
  }

  // Estatísticas
  static async getStats() {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(is_active) as active_users,
        SUM(NOT is_active) as inactive_users,
        AVG(failed_login_attempts) as avg_failed_logins,
        MAX(last_login) as latest_login
      FROM users
    `);
    
    return stats[0];
  }
}

module.exports = User;

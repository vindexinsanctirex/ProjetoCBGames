const User = require('../models/User');
const JWTUtil = require('../utils/jwt');
const Validators = require('../utils/validators');

class AuthController {
  // Registro de usuário
  static async register(req, res) {
    try {
      // Validar dados de entrada
      const { error } = Validators.registerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'Erro de validação',
          details: error.details.map(detail => detail.message)
        });
      }

      const { username, email, password } = req.body;

      // Criar usuário
      const user = await User.create(username, email, password);

      // Gerar tokens
      const tokens = JWTUtil.generateTokens(user);

      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        tokens
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      
      if (error.message === 'Usuário ou email já cadastrado') {
        return res.status(409).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno no servidor'
      });
    }
  }

  // Login de usuário
  static async login(req, res) {
    try {
      // Validar dados de entrada
      const { error } = Validators.loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'Erro de validação',
          details: error.details.map(detail => detail.message)
        });
      }

      const { username, password } = req.body;

      // Verificar credenciais
      const { isValid, user } = await User.verifyCredentials(username, password);

      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: 'Credenciais inválidas'
        });
      }

      // Gerar tokens
      const tokens = JWTUtil.generateTokens(user);

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        tokens
      });
    } catch (error) {
      console.error('Erro no login:', error);
      
      if (error.message === 'Conta desativada' || 
          error.message === 'Conta bloqueada devido a muitas tentativas falhas') {
        return res.status(403).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno no servidor'
      });
    }
  }

  // Refresh token
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token não fornecido'
        });
      }

      // Verificar refresh token
      const decoded = JWTUtil.verifyToken(refreshToken, true);

      // Buscar usuário
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      // Gerar novos tokens
      const tokens = JWTUtil.generateTokens(user);

      res.json({
        success: true,
        message: 'Token atualizado com sucesso',
        tokens
      });
    } catch (error) {
      console.error('Erro no refresh token:', error);
      
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Refresh token inválido ou expirado'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno no servidor'
      });
    }
  }

  // Perfil do usuário
  static async getProfile(req, res) {
    try {
      // Usuário já está disponível no req.user pelo middleware
      res.json({
        success: true,
        user: req.user
      });
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno no servidor'
      });
    }
  }

  // Atualizar perfil
  static async updateProfile(req, res) {
    try {
      const updates = req.body;
      const userId = req.user.id;

      // Atualizar perfil
      const updatedUser = await User.updateProfile(userId, updates);

      res.json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        user: updatedUser
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno no servidor'
      });
    }
  }

  // Alterar senha
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Verificar senha atual
      const user = await User.findById(userId);
      const { isValid } = await User.verifyCredentials(user.username, currentPassword);

      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: 'Senha atual incorreta'
        });
      }

      // Atualizar senha
      await User.updatePassword(userId, newPassword);

      res.json({
        success: true,
        message: 'Senha alterada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno no servidor'
      });
    }
  }

  // Logout (simulado - em produção invalidar token)
  static async logout(req, res) {
    try {
      // Em uma implementação real, você invalidaria o token
      // Por enquanto, apenas retornamos sucesso
      
      res.json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error) {
      console.error('Erro no logout:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno no servidor'
      });
    }
  }

  // Verificar token (endpoint de saúde da autenticação)
  static async verify(req, res) {
    try {
      res.json({
        success: true,
        message: 'Token válido',
        user: req.user
      });
    } catch (error) {
      console.error('Erro na verificação do token:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno no servidor'
      });
    }
  }
}

module.exports = AuthController;

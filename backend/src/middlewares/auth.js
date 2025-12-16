const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthMiddleware {
  // Verificar token JWT
  static async verifyToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          error: 'Token de autenticação não fornecido'
        });
      }

      const token = authHeader.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Token de autenticação não fornecido'
        });
      }

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Buscar usuário
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          error: 'Conta desativada'
        });
      }

      // Adicionar usuário à requisição
      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          error: 'Token inválido'
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token expirado'
        });
      }

      console.error('Erro na verificação do token:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro interno na autenticação'
      });
    }
  }

  // Middleware para verificar admin
  static async requireAdmin(req, res, next) {
    try {
      // Verificar se o usuário é admin
      // Aqui você pode implementar lógica específica para admin
      // Por enquanto, vamos verificar se é o usuário admin
      if (req.user.username !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Acesso restrito a administradores'
        });
      }
      
      next();
    } catch (error) {
      console.error('Erro na verificação de admin:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro interno na verificação de permissões'
      });
    }
  }

  // Middleware para rate limiting (simplificado)
  static rateLimit(req, res, next) {
    const clientIp = req.ip;
    const route = req.path;
    const key = `${clientIp}:${route}`;
    
    // Implementação simples de rate limiting
    // Em produção, use uma solução mais robusta como redis
    req.rateLimitInfo = {
      limit: 100,
      remaining: 99,
      reset: Date.now() + 15 * 60 * 1000 // 15 minutos
    };
    
    next();
  }

  // Validar dados de entrada
  static validate(schema) {
    return (req, res, next) => {
      try {
        const { error } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
          const errors = error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
          }));
          
          return res.status(400).json({
            success: false,
            error: 'Erro de validação',
            details: errors
          });
        }
        
        next();
      } catch (error) {
        console.error('Erro na validação:', error);
        return res.status(500).json({
          success: false,
          error: 'Erro interno na validação'
        });
      }
    };
  }
}

module.exports = AuthMiddleware;

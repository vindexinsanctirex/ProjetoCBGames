const jwt = require('jsonwebtoken');

class JWTUtil {
  // Gerar token de acesso
  static generateAccessToken(user) {
    return jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        issuer: 'character-creator-api',
        audience: 'character-creator-app'
      }
    );
  }

  // Gerar token de refresh
  static generateRefreshToken(user) {
    return jwt.sign(
      {
        userId: user.id,
        type: 'refresh'
      },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '-refresh',
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        issuer: 'character-creator-api',
        audience: 'character-creator-app'
      }
    );
  }

  // Verificar token
  static verifyToken(token, isRefresh = false) {
    const secret = isRefresh 
      ? (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '-refresh')
      : process.env.JWT_SECRET;
    
    return jwt.verify(token, secret);
  }

  // Decodificar token sem verificar (para análise)
  static decodeToken(token) {
    return jwt.decode(token);
  }

  // Gerar tokens para usuário
  static generateTokens(user) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    
    return {
      accessToken,
      refreshToken,
      expiresIn: 24 * 60 * 60 // 24 horas em segundos
    };
  }
}

module.exports = JWTUtil;

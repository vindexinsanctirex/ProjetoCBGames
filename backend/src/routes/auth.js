const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const AuthMiddleware = require('../middlewares/auth');

// Rotas públicas
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refreshToken);

// Rotas protegidas (requerem autenticação)
router.get('/profile', AuthMiddleware.verifyToken, AuthController.getProfile);
router.put('/profile', AuthMiddleware.verifyToken, AuthController.updateProfile);
router.post('/change-password', AuthMiddleware.verifyToken, AuthController.changePassword);
router.post('/logout', AuthMiddleware.verifyToken, AuthController.logout);
router.get('/verify', AuthMiddleware.verifyToken, AuthController.verify);

module.exports = router;

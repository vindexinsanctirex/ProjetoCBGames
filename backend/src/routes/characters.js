const express = require('express');
const router = express.Router();
const CharacterController = require('../controllers/characterController');
const AuthMiddleware = require('../middlewares/auth');

// Middleware de autenticação para todas as rotas de personagens
router.use(AuthMiddleware.verifyToken);

// Rotas de CRUD básico
router.post('/', CharacterController.create);
router.get('/my', CharacterController.listUserCharacters);
router.get('/public', CharacterController.listPublicCharacters);
router.get('/search', CharacterController.searchCharacters);
router.get('/stats', CharacterController.getStats);

// Rotas para personagens específicos
router.get('/:id', CharacterController.getCharacter);
router.put('/:id', CharacterController.updateCharacter);
router.delete('/:id', CharacterController.deleteCharacter);
router.post('/:id/clone', CharacterController.cloneCharacter);

// Rotas para habilidades
router.post('/:id/abilities', CharacterController.addAbility);

// Rotas para itens
router.post('/:id/items', CharacterController.addItem);

module.exports = router;

const Character = require('../models/Character');
const Validators = require('../utils/validators');

class CharacterController {
  // Criar novo personagem
  static async create(req, res) {
    try {
      // Validar dados de entrada
      const { error } = Validators.characterSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'Erro de validação',
          details: error.details.map(detail => detail.message)
        });
      }

      const userId = req.user.id;
      const characterData = req.body;

      // Criar personagem
      const character = await Character.create(userId, characterData);

      res.status(201).json({
        success: true,
        message: 'Personagem criado com sucesso',
        character
      });
    } catch (error) {
      console.error('Erro ao criar personagem:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno no servidor'
      });
    }
  }

  // Listar personagens do usuário
  static async listUserCharacters(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 50, offset = 0, includePublic = false } = req.query;

      const characters = await Character.findByUser(userId, {
        limit: parseInt(limit),
        offset: parseInt(offset),
        includePublic: includePublic === 'true'
      });

      res.json({
        success: true,
        characters,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: characters.length
        }
      });
    } catch (error) {
      console.error('Erro ao listar personagens:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno no servidor'
      });
    }
  }

  // Listar personagens públicos
  static async listPublicCharacters(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;

      const characters = await Character.findPublic(
        parseInt(limit),
        parseInt(offset)
      );

      res.json({
        success: true,
        characters,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: characters.length
        }
      });
    } catch (error) {
      console.error('Erro ao listar personagens públicos:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno no servidor'
      });
    }
  }

  // Obter detalhes de um personagem
  static async getCharacter(req, res) {
    try {
      const characterId = parseInt(req.params.id);
      const character = await Character.findById(characterId);

      if (!character) {
        return res.status(404).json({
          success: false,
          error: 'Personagem não encontrado'
        });
      }

      // Verificar se o usuário pode ver o personagem
      if (!character.isPublic && character.userId !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Acesso negado a este personagem'
        });
      }

      // Buscar habilidades e itens se solicitado
      if (req.query.include === 'all') {
        const [abilities, items] = await Promise.all([
          Character.getAbilities(characterId),
          Character.getItems(characterId)
        ]);

        character.abilities = abilities;
        character.items = items;
      }

      res.json({
        success: true,
        character
      });
    } catch (error) {
      console.error('Erro ao obter personagem:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno no servidor'
      });
    }
  }

  // Atualizar personagem
  static async updateCharacter(req, res) {
    try {
      const characterId = parseInt(req.params.id);
      const userId = req.user.id;
      const updates = req.body;

      // Validar dados de entrada
      const { error } = Validators.characterSchema.validate(updates, {
        allowUnknown: true,
        stripUnknown: true
      });
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'Erro de validação',
          details: error.details.map(detail => detail.message)
        });
      }

      const character = await Character.update(characterId, userId, updates);

      res.json({
        success: true,
        message: 'Personagem atualizado com sucesso',
        character
      });
    } catch (error) {
      console.error('Erro ao atualizar personagem:', error);
      
      if (error.message === 'Personagem não encontrado ou permissão negada') {
        return res.status(404).json({
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

  // Deletar personagem
  static async deleteCharacter(req, res) {
    try {
      const characterId = parseInt(req.params.id);
      const userId = req.user.id;

      const deleted = await Character.delete(characterId, userId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Personagem não encontrado ou permissão negada'
        });
      }

      res.json({
        success: true,
        message: 'Personagem deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar personagem:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno no servidor'
      });
    }
  }

  // Adicionar habilidade ao personagem
  static async addAbility(req, res) {
    try {
      const characterId = parseInt(req.params.id);
      const abilityData = req.body;

      // Validar dados de entrada
      const { error } = Validators.abilitySchema.validate(abilityData);
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'Erro de validação',
          details: error.details.map(detail => detail.message)
        });
      }

      const ability = await Character.addAbility(characterId, abilityData);

      res.status(201).json({
        success: true,
        message: 'Habilidade adicionada com sucesso',
        ability
      });
    } catch (error) {
      console.error('Erro ao adicionar habilidade:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno no servidor'
      });
    }
  }

  // Adicionar item ao personagem
  static async addItem(req, res) {
    try {
      const characterId = parseInt(req.params.id);
      const itemData = req.body;

      // Validar dados de entrada
      const { error } = Validators.itemSchema.validate(itemData);
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'Erro de validação',
          details: error.details.map(detail => detail.message)
        });
      }

      const item = await Character.addItem(characterId, itemData);

      res.status(201).json({
        success: true,
        message: 'Item adicionado com sucesso',
        item
      });
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno no servidor'
      });
    }
  }

  // Buscar personagens (search)
  static async searchCharacters(req, res) {
    try {
      const filters = req.query;

      // Validar filtros
      const { error } = Validators.searchSchema.validate(filters);
      if (error) {
        return res.status(400).json({
          success: false,
          error: 'Erro de validação',
          details: error.details.map(detail => detail.message)
        });
      }

      const characters = await Character.search(filters);

      res.json({
        success: true,
        characters,
        filters,
        pagination: {
          limit: parseInt(filters.limit || 50),
          offset: parseInt(filters.offset || 0),
          total: characters.length
        }
      });
    } catch (error) {
      console.error('Erro na busca de personagens:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno no servidor'
      });
    }
  }

  // Estatísticas dos personagens
  static async getStats(req, res) {
    try {
      const stats = await Character.getStats();

      res.json({
        success: true,
        stats
      });
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno no servidor'
      });
    }
  }

  // Clonar personagem
  static async cloneCharacter(req, res) {
    try {
      const characterId = parseInt(req.params.id);
      const userId = req.user.id;

      // Buscar personagem original
      const originalCharacter = await Character.findById(characterId);

      if (!originalCharacter) {
        return res.status(404).json({
          success: false,
          error: 'Personagem não encontrado'
        });
      }

      // Verificar permissão (apenas personagens públicos podem ser clonados)
      if (!originalCharacter.isPublic && originalCharacter.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Não é permitido clonar este personagem'
        });
      }

      // Criar novo personagem baseado no original
      const characterData = {
        name: `${originalCharacter.name} (Cópia)`,
        ...originalCharacter.attributes,
        ...originalCharacter.appearance,
        personality: originalCharacter.personality,
        backstory: originalCharacter.backstory,
        isPublic: false // Cópias são privadas por padrão
      };

      const newCharacter = await Character.create(userId, characterData);

      res.status(201).json({
        success: true,
        message: 'Personagem clonado com sucesso',
        character: newCharacter
      });
    } catch (error) {
      console.error('Erro ao clonar personagem:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno no servidor'
      });
    }
  }
}

module.exports = CharacterController;

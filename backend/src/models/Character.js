const db = require('../config/database');

class Character {
  // Criar novo personagem
  static async create(userId, characterData) {
    const {
      name,
      strength = 5,
      intelligence = 5,
      agility = 5,
      stamina = 5,
      charisma = 5,
      wisdom = 5,
      skinColor = '#FFCC99',
      hairColor = '#000000',
      hairStyle = 'short',
      eyeColor = '#000000',
      height = 170,
      weight = 70,
      personality = '',
      backstory = '',
      isPublic = true
    } = characterData;

    const [result] = await db.query(
      `INSERT INTO characters 
      (user_id, name, strength, intelligence, agility, stamina, charisma, wisdom,
       skin_color, hair_color, hair_style, eye_color, height, weight,
       personality, backstory, is_public)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, name, strength, intelligence, agility, stamina, charisma, wisdom,
        skinColor, hairColor, hairStyle, eyeColor, height, weight,
        personality, backstory, isPublic
      ]
    );

    return await this.findById(result.insertId);
  }

  // Buscar por ID
  static async findById(id) {
    const [characters] = await db.query(
      `SELECT 
        c.*,
        u.username as owner_username,
        u.email as owner_email
       FROM characters c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [id]
    );

    if (characters.length === 0) return null;
    return this.mapToCharacter(characters[0]);
  }

  // Buscar por usuário
  static async findByUser(userId, options = {}) {
    const { limit = 100, offset = 0, includePublic = false } = options;
    
    let query = `
      SELECT c.*, u.username as owner_username
      FROM characters c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.user_id = ?
    `;
    
    const params = [userId];
    
    if (includePublic) {
      query += ` OR c.is_public = TRUE`;
    }
    
    query += ` ORDER BY c.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [characters] = await db.query(query, params);
    return characters.map(this.mapToCharacter);
  }

  // Listar todos os personagens públicos
  static async findPublic(limit = 100, offset = 0) {
    const [characters] = await db.query(
      `SELECT 
        c.*,
        u.username as owner_username
       FROM characters c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.is_public = TRUE
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return characters.map(this.mapToCharacter);
  }

  // Atualizar personagem
  static async update(id, userId, updates) {
    const allowedFields = [
      'name', 'strength', 'intelligence', 'agility', 'stamina',
      'charisma', 'wisdom', 'skin_color', 'hair_color', 'hair_style',
      'eye_color', 'height', 'weight', 'personality', 'backstory',
      'is_public'
    ];

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
    values.push(id, userId);

    const [result] = await db.query(
      `UPDATE characters 
       SET ${setClause}
       WHERE id = ? AND user_id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      throw new Error('Personagem não encontrado ou permissão negada');
    }

    return await this.findById(id);
  }

  // Deletar personagem
  static async delete(id, userId) {
    const [result] = await db.query(
      `DELETE FROM characters 
       WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    return result.affectedRows > 0;
  }

  // Adicionar habilidade
  static async addAbility(characterId, abilityData) {
    const { abilityName, abilityDescription, abilityLevel = 1 } = abilityData;

    const [result] = await db.query(
      `INSERT INTO character_abilities 
      (character_id, ability_name, ability_description, ability_level)
      VALUES (?, ?, ?, ?)`,
      [characterId, abilityName, abilityDescription, abilityLevel]
    );

    return {
      id: result.insertId,
      characterId,
      abilityName,
      abilityDescription,
      abilityLevel
    };
  }

  // Buscar habilidades
  static async getAbilities(characterId) {
    const [abilities] = await db.query(
      `SELECT * FROM character_abilities 
       WHERE character_id = ?
       ORDER BY ability_level DESC`,
      [characterId]
    );

    return abilities;
  }

  // Adicionar item
  static async addItem(characterId, itemData) {
    const { itemName, itemType = 'other', itemDescription, itemValue = 0 } = itemData;

    const [result] = await db.query(
      `INSERT INTO character_items 
      (character_id, item_name, item_type, item_description, item_value)
      VALUES (?, ?, ?, ?, ?)`,
      [characterId, itemName, itemType, itemDescription, itemValue]
    );

    return {
      id: result.insertId,
      characterId,
      itemName,
      itemType,
      itemDescription,
      itemValue
    };
  }

  // Buscar itens
  static async getItems(characterId) {
    const [items] = await db.query(
      `SELECT * FROM character_items 
       WHERE character_id = ?
       ORDER BY item_value DESC`,
      [characterId]
    );

    return items;
  }

  // Estatísticas
  static async getStats() {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_characters,
        AVG(strength) as avg_strength,
        AVG(intelligence) as avg_intelligence,
        AVG(agility) as avg_agility,
        COUNT(DISTINCT user_id) as unique_users,
        SUM(is_public) as public_characters,
        MIN(created_at) as oldest_character,
        MAX(created_at) as newest_character
      FROM characters
    `);

    const [popularStyles] = await db.query(`
      SELECT hair_style, COUNT(*) as count
      FROM characters
      GROUP BY hair_style
      ORDER BY count DESC
      LIMIT 5
    `);

    const [attributeDistribution] = await db.query(`
      SELECT 
        CASE 
          WHEN strength >= 8 THEN 'Alta'
          WHEN strength >= 5 THEN 'Média'
          ELSE 'Baixa'
        END as strength_level,
        COUNT(*) as count
      FROM characters
      GROUP BY strength_level
    `);

    return {
      general: stats[0],
      popularStyles,
      attributeDistribution
    };
  }

  // Busca avançada
  static async search(filters) {
    let query = `
      SELECT c.*, u.username as owner_username
      FROM characters c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    const conditions = [];

    if (filters.name) {
      conditions.push(`c.name LIKE ?`);
      params.push(`%${filters.name}%`);
    }

    if (filters.userId) {
      conditions.push(`c.user_id = ?`);
      params.push(filters.userId);
    }

    if (filters.minStrength) {
      conditions.push(`c.strength >= ?`);
      params.push(filters.minStrength);
    }

    if (filters.maxStrength) {
      conditions.push(`c.strength <= ?`);
      params.push(filters.maxStrength);
    }

    if (filters.hairStyle) {
      conditions.push(`c.hair_style = ?`);
      params.push(filters.hairStyle);
    }

    if (filters.isPublic !== undefined) {
      conditions.push(`c.is_public = ?`);
      params.push(filters.isPublic);
    }

    if (conditions.length > 0) {
      query += ` AND ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY c.created_at DESC LIMIT ? OFFSET ?`;
    params.push(filters.limit || 50, filters.offset || 0);

    const [characters] = await db.query(query, params);
    return characters.map(this.mapToCharacter);
  }

  static mapToCharacter(dbCharacter) {
    return {
      id: dbCharacter.id,
      userId: dbCharacter.user_id,
      name: dbCharacter.name,
      attributes: {
        strength: dbCharacter.strength,
        intelligence: dbCharacter.intelligence,
        agility: dbCharacter.agility,
        stamina: dbCharacter.stamina,
        charisma: dbCharacter.charisma,
        wisdom: dbCharacter.wisdom
      },
      appearance: {
        skinColor: dbCharacter.skin_color,
        hairColor: dbCharacter.hair_color,
        hairStyle: dbCharacter.hair_style,
        eyeColor: dbCharacter.eye_color,
        height: dbCharacter.height,
        weight: dbCharacter.weight
      },
      personality: dbCharacter.personality,
      backstory: dbCharacter.backstory,
      isPublic: dbCharacter.is_public,
      createdAt: dbCharacter.created_at,
      lastUpdated: dbCharacter.last_updated,
      owner: dbCharacter.owner_username ? {
        username: dbCharacter.owner_username,
        email: dbCharacter.owner_email
      } : null
    };
  }
}

module.exports = Character;

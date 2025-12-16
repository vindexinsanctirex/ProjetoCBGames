const Joi = require('joi');

const Validators = {
  // Validação de registro de usuário
  registerSchema: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.alphanum': 'O nome de usuário deve conter apenas letras e números',
        'string.min': 'O nome de usuário deve ter pelo menos 3 caracteres',
        'string.max': 'O nome de usuário deve ter no máximo 30 caracteres',
        'any.required': 'O nome de usuário é obrigatório'
      }),
    
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Email inválido',
        'any.required': 'Email é obrigatório'
      }),
    
    password: Joi.string()
      .min(6)
      .max(100)
      .required()
      .messages({
        'string.min': 'A senha deve ter pelo menos 6 caracteres',
        'string.max': 'A senha deve ter no máximo 100 caracteres',
        'any.required': 'A senha é obrigatória'
      }),
    
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'As senhas não coincidem',
        'any.required': 'Confirmação de senha é obrigatória'
      })
  }),

  // Validação de login
  loginSchema: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),

  // Validação de criação de personagem
  characterSchema: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'O nome deve ter pelo menos 2 caracteres',
        'string.max': 'O nome deve ter no máximo 100 caracteres',
        'any.required': 'O nome é obrigatório'
      }),
    
    strength: Joi.number()
      .integer()
      .min(1)
      .max(10)
      .default(5),
    
    intelligence: Joi.number()
      .integer()
      .min(1)
      .max(10)
      .default(5),
    
    agility: Joi.number()
      .integer()
      .min(1)
      .max(10)
      .default(5),
    
    stamina: Joi.number()
      .integer()
      .min(1)
      .max(10)
      .default(5),
    
    charisma: Joi.number()
      .integer()
      .min(1)
      .max(10)
      .default(5),
    
    wisdom: Joi.number()
      .integer()
      .min(1)
      .max(10)
      .default(5),
    
    skinColor: Joi.string()
      .pattern(/^#[0-9A-Fa-f]{6}$/)
      .default('#FFCC99'),
    
    hairColor: Joi.string()
      .pattern(/^#[0-9A-Fa-f]{6}$/)
      .default('#000000'),
    
    hairStyle: Joi.string()
      .valid('short', 'medium', 'long', 'curly', 'bald', 'ponytail', 'dreadlocks', 'mohawk')
      .default('short'),
    
    eyeColor: Joi.string()
      .pattern(/^#[0-9A-Fa-f]{6}$/)
      .default('#000000'),
    
    height: Joi.number()
      .integer()
      .min(120)
      .max(250)
      .default(170),
    
    weight: Joi.number()
      .integer()
      .min(40)
      .max(150)
      .default(70),
    
    personality: Joi.string()
      .max(100)
      .allow('')
      .default(''),
    
    backstory: Joi.string()
      .max(5000)
      .allow('')
      .default(''),
    
    isPublic: Joi.boolean()
      .default(true)
  }),

  // Validação de habilidade
  abilitySchema: Joi.object({
    abilityName: Joi.string()
      .min(2)
      .max(100)
      .required(),
    
    abilityDescription: Joi.string()
      .max(500)
      .allow('')
      .default(''),
    
    abilityLevel: Joi.number()
      .integer()
      .min(1)
      .max(5)
      .default(1)
  }),

  // Validação de item
  itemSchema: Joi.object({
    itemName: Joi.string()
      .min(2)
      .max(100)
      .required(),
    
    itemType: Joi.string()
      .valid('weapon', 'armor', 'potion', 'magic', 'other')
      .default('other'),
    
    itemDescription: Joi.string()
      .max(500)
      .allow('')
      .default(''),
    
    itemValue: Joi.number()
      .integer()
      .min(0)
      .default(0)
  }),

  // Validação de busca
  searchSchema: Joi.object({
    name: Joi.string()
      .max(100)
      .allow(''),
    
    minStrength: Joi.number()
      .integer()
      .min(1)
      .max(10),
    
    maxStrength: Joi.number()
      .integer()
      .min(1)
      .max(10),
    
    hairStyle: Joi.string()
      .valid('short', 'medium', 'long', 'curly', 'bald', 'ponytail', 'dreadlocks', 'mohawk'),
    
    isPublic: Joi.boolean(),
    
    limit: Joi.number()
      .integer()
      .min(1)
      .max(200)
      .default(50),
    
    offset: Joi.number()
      .integer()
      .min(0)
      .default(0)
  })
};

module.exports = Validators;

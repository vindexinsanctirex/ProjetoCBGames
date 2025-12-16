import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { characterService } from '../services/api';
import styled from 'styled-components';

const CreatorContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 2rem;
`;

const Form = styled.form`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CharacterCreator: React.FC = () => {
  const [name, setName] = useState('');
  const [strength, setStrength] = useState(5);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const characterData = {
        name,
        strength,
        intelligence: 5,
        skin_color: '#FFCC99',
        hair_color: '#000000'
      };

      const response = await characterService.create(characterData);
      
      if (response.success) {
        alert('Personagem criado com sucesso!');
        navigate('/characters');
      }
    } catch (error) {
      alert('Erro ao criar personagem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CreatorContainer>
      <h1>🎨 Criar Personagem</h1>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Nome do Personagem</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Força: {strength}/10</Label>
          <Input
            type="range"
            min="1"
            max="10"
            value={strength}
            onChange={(e) => setStrength(parseInt(e.target.value))}
          />
        </FormGroup>

        <Button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar Personagem'}
        </Button>
      </Form>
    </CreatorContainer>
  );
};

export default CharacterCreator;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { characterService } from '../services/api';
import styled from 'styled-components';

const ListContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
`;

const CharactersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const CharacterCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const CharacterList: React.FC = () => {
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      const response = await characterService.getAll();
      if (response.success) {
        setCharacters(response.characters || []);
      }
    } catch (error) {
      console.error('Erro ao carregar personagens:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ListContainer>Carregando...</ListContainer>;
  }

  return (
    <ListContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>👥 Personagens</h1>
        <Link to="/create" style={{
          background: '#667eea',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          textDecoration: 'none'
        }}>
          ➕ Criar Novo
        </Link>
      </div>

      <CharactersGrid>
        {characters.map((char) => (
          <CharacterCard key={char.id}>
            <h3>{char.name}</h3>
            <p>Força: {char.strength}/10</p>
            <p>Inteligência: {char.intelligence}/10</p>
          </CharacterCard>
        ))}
      </CharactersGrid>
    </ListContainer>
  );
};

export default CharacterList;

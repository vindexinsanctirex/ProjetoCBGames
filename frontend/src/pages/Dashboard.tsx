import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
`;

const WelcomeCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  text-align: center;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ActionCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
`;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <DashboardContainer>
      <WelcomeCard>
        <h1>🎮 Bem-vindo, {user?.username}!</h1>
        <p>Comece sua jornada criando personagens incríveis</p>
      </WelcomeCard>

      <ActionsGrid>
        <ActionCard onClick={() => navigate('/create')}>
          <h3>➕ Criar Personagem</h3>
          <p>Crie um novo personagem personalizado</p>
        </ActionCard>

        <ActionCard onClick={() => navigate('/characters')}>
          <h3>👥 Meus Personagens</h3>
          <p>Veja todos os seus personagens</p>
        </ActionCard>
      </ActionsGrid>
    </DashboardContainer>
  );
};

export default Dashboard;

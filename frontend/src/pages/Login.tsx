import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';
import { FaGamepad } from 'react-icons/fa';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-bottom: 1rem;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #fed7d7;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const Login: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (user: string, pass: string) => {
    setLoading(true);
    setError('');
    
    try {
      await login(user, pass);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    handleLogin(user, pass);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>
          <FaGamepad /> Character Creator
        </Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <LoginButton 
          onClick={() => handleQuickLogin('admin', 'admin123')}
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Login como Admin'}
        </LoginButton>
        
        <LoginButton 
          onClick={() => handleQuickLogin('jogador1', 'jogador123')}
          disabled={loading}
        >
          Login como Jogador1
        </LoginButton>
        
        <LoginButton 
          onClick={() => handleQuickLogin('teste', 'teste123')}
          disabled={loading}
        >
          Login como Teste
        </LoginButton>
        
        <div style={{ marginTop: '2rem', textAlign: 'center', color: '#666' }}>
          <p>Ou faça login manual:</p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuário"
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              border: '2px solid #ddd',
              borderRadius: '8px'
            }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              border: '2px solid #ddd',
              borderRadius: '8px'
            }}
          />
          <LoginButton onClick={() => handleLogin(username, password)}>
            Login Manual
          </LoginButton>
        </div>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;

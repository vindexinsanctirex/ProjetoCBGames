import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';
import { FaUser, FaSignOutAlt, FaHome, FaPlus, FaList } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  h1 {
    font-size: 1.5rem;
    margin: 0;
    color: white;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <HeaderContainer>
      <Nav>
        <Logo>
          <h1>🎮 Character Creator</h1>
        </Logo>
        
        <NavLinks>
          <NavLink to="/">
            <FaHome /> Home
          </NavLink>
          
          <NavLink to="/create">
            <FaPlus /> Criar
          </NavLink>
          
          <NavLink to="/characters">
            <FaList /> Personagens
          </NavLink>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaUser /> {user?.username}
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt /> Sair
            </LogoutButton>
          </div>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;

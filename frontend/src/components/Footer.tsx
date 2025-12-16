import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: #2d3748;
  color: #a0aec0;
  padding: 2rem;
  text-align: center;
  margin-top: auto;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <p>🎮 Character Creator - Projeto CB Games © {new Date().getFullYear()}</p>
    </FooterContainer>
  );
};

export default Footer;

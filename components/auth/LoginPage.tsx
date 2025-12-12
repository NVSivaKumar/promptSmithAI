import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AnimatedCharactersLoginPage from '../ui/animated-characters-login-page';

interface LoginPageProps {
  onNavigateToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigateToSignup }) => {
  const { login } = useAuth();

  return (
    <AnimatedCharactersLoginPage 
      onLogin={login} 
      onNavigateToSignup={onNavigateToSignup} 
    />
  );
};

export default LoginPage;
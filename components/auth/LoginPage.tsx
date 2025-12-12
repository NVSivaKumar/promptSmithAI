import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AnimatedCharactersLoginPage from '../ui/animated-characters-login-page';

interface LoginPageProps {
  onNavigateToSignup: () => void;
  onNavigateToForgotPassword: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigateToSignup, onNavigateToForgotPassword }) => {
  const { login } = useAuth();

  return (
    <AnimatedCharactersLoginPage 
      onLogin={login} 
      onNavigateToSignup={onNavigateToSignup} 
      onNavigateToForgotPassword={onNavigateToForgotPassword}
    />
  );
};

export default LoginPage;
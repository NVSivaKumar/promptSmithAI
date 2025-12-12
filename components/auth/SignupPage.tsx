import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AnimatedCharactersSignupPage from '../ui/animated-characters-signup-page';

interface SignupPageProps {
  onNavigateToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigateToLogin }) => {
  const { register } = useAuth();

  return (
    <AnimatedCharactersSignupPage 
      onSignup={register} 
      onNavigateToLogin={onNavigateToLogin} 
    />
  );
};

export default SignupPage;
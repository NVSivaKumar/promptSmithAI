import React from 'react';
import AnimatedCharactersForgotPasswordPage from '../ui/animated-characters-forgot-password-page';

interface ForgotPasswordPageProps {
  onNavigateToLogin: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigateToLogin }) => {
  
  const handleReset = async (email: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this would call an API endpoint
    console.log(`Password reset link sent to: ${email}`);
  };

  return (
    <AnimatedCharactersForgotPasswordPage 
      onReset={handleReset} 
      onNavigateToLogin={onNavigateToLogin} 
    />
  );
};

export default ForgotPasswordPage;
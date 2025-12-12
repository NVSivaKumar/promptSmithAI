import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, ThemeId } from '../types';
import { THEMES } from '../constants';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Set default to 'amber' (Warm Ember), fallback to first if not found
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    THEMES.find(t => t.id === 'amber') || THEMES[0]
  );

  useEffect(() => {
    const savedThemeId = localStorage.getItem('promptsmith_theme');
    if (savedThemeId) {
      const theme = THEMES.find(t => t.id === savedThemeId);
      if (theme) setCurrentTheme(theme);
    }
  }, []);

  useEffect(() => {
    // Update CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary-rgb', currentTheme.primaryRgb);
    root.style.setProperty('--secondary-rgb', currentTheme.secondaryRgb);
    
    // Persist
    localStorage.setItem('promptsmith_theme', currentTheme.id);
  }, [currentTheme]);

  const setTheme = (id: ThemeId) => {
    const theme = THEMES.find(t => t.id === id);
    if (theme) setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
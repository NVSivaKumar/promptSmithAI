import React from 'react';
import { THEMES } from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { Check } from 'lucide-react';

const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2 bg-slate-800/50 p-1.5 rounded-full border border-slate-700/50">
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          onClick={() => setTheme(theme.id)}
          className={`
            relative w-5 h-5 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500
            ${currentTheme.id === theme.id ? 'scale-110 ring-2 ring-white/50 ring-offset-2 ring-offset-slate-900' : 'opacity-70 hover:opacity-100'}
          `}
          style={{ 
            background: `linear-gradient(135deg, rgb(${theme.primaryRgb}), rgb(${theme.secondaryRgb}))` 
          }}
          title={theme.name}
          aria-label={`Select ${theme.name} theme`}
        >
          {currentTheme.id === theme.id && (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
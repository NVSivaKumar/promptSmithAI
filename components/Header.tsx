import React from 'react';
import { Wand2, Crown, LayoutDashboard } from './Icon';
import ThemeSelector from './ThemeSelector';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';

interface HeaderProps {
    currentView?: 'generator' | 'plans';
    onNavigate?: (view: 'generator' | 'plans') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo Section */}
        <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => onNavigate && onNavigate('generator')}
        >
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 transition-colors duration-500 group-hover:bg-primary/20">
            <Wand2 className="w-6 h-6 text-primary transition-colors duration-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transition-all duration-500">
              PromptSmith AI
            </h1>
            <p className="text-xs text-zinc-400 hidden sm:block">Professional Prompt Engineer</p>
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Nav Buttons (Desktop) */}
            {onNavigate && (
                <div className="hidden md:flex bg-white/5 rounded-full p-1 border border-white/10 mr-2">
                    <button
                        onClick={() => onNavigate('generator')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-2 ${
                            currentView === 'generator' 
                            ? 'bg-zinc-800 text-white shadow-sm' 
                            : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Generator</span>
                    </button>
                    <button
                        onClick={() => onNavigate('plans')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-2 ${
                            currentView === 'plans' 
                            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-sm' 
                            : 'text-zinc-400 hover:text-primary'
                        }`}
                    >
                        <Crown className="w-3.5 h-3.5" />
                        <span>Plans</span>
                    </button>
                </div>
            )}
            
            <ThemeSelector />

            <div className="h-6 w-px bg-white/10 mx-2"></div>

            {user && (
                <div className="flex items-center space-x-3">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-bold text-zinc-200">{user.name}</span>
                        <span className="text-[10px] text-zinc-500">@{user.username}</span>
                    </div>
                    <button 
                        onClick={logout}
                        title="Sign Out"
                        className="p-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-red-400 hover:bg-white/10 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Mobile Nav Bar (Below Header) */}
      {onNavigate && (
        <div className="md:hidden border-t border-white/10 flex">
            <button
                onClick={() => onNavigate('generator')}
                className={`flex-1 py-3 text-xs font-bold flex items-center justify-center space-x-2 transition-colors ${
                    currentView === 'generator' ? 'text-primary bg-white/5' : 'text-zinc-500'
                }`}
            >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Generator</span>
            </button>
            <div className="w-px bg-white/10"></div>
            <button
                onClick={() => onNavigate('plans')}
                className={`flex-1 py-3 text-xs font-bold flex items-center justify-center space-x-2 transition-colors ${
                    currentView === 'plans' ? 'text-primary bg-white/5' : 'text-zinc-500'
                }`}
            >
                <Crown className="w-3.5 h-3.5" />
                <span>Pro Plans</span>
            </button>
        </div>
      )}
    </header>
  );
};

export default Header;
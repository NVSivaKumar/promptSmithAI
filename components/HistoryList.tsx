import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { CategoryIcon, Clock, ArrowRight, Trash2, Search } from './Icon';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  title?: string;
  icon?: React.ReactNode;
  clearLabel?: string;
  emptyMessage?: string;
}

const HistoryList: React.FC<HistoryListProps> = ({ 
  history, 
  onSelect, 
  onClear,
  title = "Recent Creations",
  icon = <Clock className="w-4 h-4" />,
  clearLabel = "Clear History",
  emptyMessage
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (history.length === 0) {
    if (emptyMessage) {
        return (
            <div className="py-8 text-center border border-dashed border-zinc-800/50 rounded-xl bg-white/5">
                <p className="text-sm text-zinc-500">{emptyMessage}</p>
            </div>
        );
    }
    return null;
  }

  const filteredItems = history.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.originalInput.toLowerCase().includes(query) ||
      item.refinedPrompt.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.tone.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2 text-zinc-400">
          {icon}
          <h3 className="text-sm font-semibold uppercase tracking-wider">{title}</h3>
        </div>
        <button 
          onClick={onClear}
          className="text-xs text-zinc-500 hover:text-red-400 transition-colors flex items-center space-x-1"
        >
          <Trash2 className="w-3 h-3" />
          <span>{clearLabel}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-xl leading-5 bg-white/5 text-zinc-300 placeholder-zinc-600 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-primary/50 focus:border-primary/50 sm:text-sm transition-all backdrop-blur-sm"
          placeholder="Search prompts by content, category, or tone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
            <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="group relative bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 rounded-xl p-4 text-left transition-all duration-200 overflow-hidden backdrop-blur-sm"
            >
                <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-zinc-950/50 to-transparent group-hover:from-zinc-900/50 pointer-events-none" />
                
                <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-md bg-white/10 text-zinc-400 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    <CategoryIcon category={item.category} className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium text-zinc-500">{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-primary transform group-hover:translate-x-1 transition-all" />
                </div>
                
                <p className="text-sm text-zinc-300 font-medium line-clamp-1 mb-1">
                {item.originalInput}
                </p>
                <p className="text-xs text-zinc-500 line-clamp-1">
                {item.tone} • {item.category}
                </p>
            </button>
            ))
        ) : (
            <div className="text-center py-8 bg-white/5 rounded-xl border border-dashed border-white/10 backdrop-blur-sm">
                <p className="text-sm text-zinc-500">No matching prompts found.</p>
                <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-xs text-primary hover:text-primary/80 hover:underline"
                >
                    Clear search
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default HistoryList;
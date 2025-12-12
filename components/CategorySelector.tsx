import React from 'react';
import { PromptCategory } from '../types';
import { CATEGORY_DESCRIPTIONS } from '../constants';
import { CategoryIcon } from './Icon';

interface CategorySelectorProps {
  selected: PromptCategory;
  onSelect: (category: PromptCategory) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-zinc-200 block">Select Prompt Type</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.values(PromptCategory).map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`
              relative p-4 rounded-xl border text-left transition-all duration-300 group overflow-hidden backdrop-blur-sm
              ${selected === cat 
                ? 'bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 border-primary/50 ring-1 ring-primary/20' 
                : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'}
            `}
          >
            {/* Active state background decorative glow */}
            {selected === cat && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-50 pointer-events-none" />
            )}

            <div className="flex items-center space-x-3 mb-2 relative z-10">
              <div className={`
                p-2 rounded-lg transition-all duration-300 shadow-sm
                ${selected === cat 
                    ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20' 
                    : 'bg-white/10 text-zinc-400 group-hover:text-zinc-200 group-hover:bg-white/20'}
              `}>
                <CategoryIcon category={cat} />
              </div>
              <span className={`font-semibold transition-colors duration-300 ${selected === cat ? 'text-primary' : 'text-zinc-200'}`}>
                {cat}
              </span>
            </div>
            <p className="relative z-10 text-xs text-zinc-400 leading-relaxed line-clamp-2 group-hover:text-zinc-300 transition-colors">
              {CATEGORY_DESCRIPTIONS[cat]}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
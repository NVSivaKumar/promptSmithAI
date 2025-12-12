import React, { useState, useEffect, useRef } from 'react';
import { HistoryItem, PromptCategory } from '../types';
import { Copy, Check, Sparkles, RefreshCw, Wand2, Bookmark, Zap, Pencil, X } from './Icon';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';

interface ResultCardProps {
  data: HistoryItem;
  category?: PromptCategory;
  tone?: string;
  onRegenerate: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onUpdate?: (newPrompt: string) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  data, 
  category, 
  tone, 
  onRegenerate,
  isSaved = false,
  onToggleSave,
  onUpdate
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(data.refinedPrompt);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const codeRef = useRef<HTMLElement>(null);

  // Sync edited text when data changes
  useEffect(() => {
    setEditedText(data.refinedPrompt);
    setIsEditing(false); // Exit edit mode if user regenerates or selects new history item
  }, [data.refinedPrompt, data.id]); // data.id ensures we reset if the item changes

  // Trigger Prism highlight when showing code view
  useEffect(() => {
    if (!isEditing && codeRef.current && (category === PromptCategory.JSON || category === PromptCategory.CODING)) {
      Prism.highlightElement(codeRef.current);
    }
  }, [data.refinedPrompt, isEditing, category, editedText]);

  const handleCopy = () => {
    const textToCopy = isEditing ? editedText : data.refinedPrompt.replace(/\*\*/g, '');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditedText(data.refinedPrompt);
    // Focus textarea after render
    setTimeout(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.selectionStart = textareaRef.current.value.length;
        }
    }, 0);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedText(data.refinedPrompt);
  };

  const handleSaveEdit = () => {
    if (onUpdate) {
        onUpdate(editedText);
    }
    setIsEditing(false);
  };

  // Helper to parse markdown bolding into JSX (used for non-highlighted categories)
  const renderPromptWithHighlights = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={index} className="font-bold text-primary bg-primary/10 px-1 rounded">
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  };

  const isSyntaxHighlighted = !isEditing && (category === PromptCategory.JSON || category === PromptCategory.CODING);
  const languageClass = category === PromptCategory.JSON ? 'language-json' : 'language-markdown';

  return (
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-500 ring-1 ring-white/5">
      
      {/* Header Bar */}
      <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
             <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-zinc-100 text-sm tracking-wide">
                {isEditing ? "EDITING PROMPT" : "OPTIMIZED RESULT"}
            </h2>
            <div className="flex items-center space-x-2 text-[10px] text-zinc-400 font-mono uppercase">
                {category && <span>{category}</span>}
                {tone && (
                    <>
                        <span className="text-zinc-700">•</span>
                        <span>{tone}</span>
                    </>
                )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {isEditing ? (
            <>
                <button
                    onClick={handleCancelEdit}
                    className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Cancel Editing"
                >
                    <X className="w-4 h-4" />
                </button>
                <button
                    onClick={handleSaveEdit}
                    className="p-2 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-500/20"
                    title="Save Changes"
                >
                    <Check className="w-4 h-4" />
                </button>
            </>
          ) : (
            <>
                {onToggleSave && (
                    <button
                    onClick={onToggleSave}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                        isSaved 
                        ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                    title={isSaved ? "Remove from saved" : "Save prompt"}
                    >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                )}

                <button
                    onClick={handleStartEdit}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Edit Prompt"
                >
                    <Pencil className="w-4 h-4" />
                </button>
                
                <button
                    onClick={onRegenerate}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Regenerate"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-transparent">
        
        {/* Prompt Section */}
        <div className="p-6">
            <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    {isEditing ? 'Editing Mode' : 'Generated Prompt'}
                </label>
                <button
                    onClick={handleCopy}
                    className={`
                    flex items-center space-x-1.5 px-2 py-1 rounded text-[10px] font-bold transition-all border
                    ${copied 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white hover:border-white/30'}
                    `}
                >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'COPIED' : 'COPY TEXT'}</span>
                </button>
            </div>
            
            <div className={`relative group rounded-xl overflow-hidden border transition-colors ${isEditing ? 'border-primary/50 shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)]' : 'border-white/10'} bg-black/40 shadow-inner backdrop-blur-sm`}>
                {!isEditing && <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-secondary"></div>}
                
                {isEditing ? (
                    <textarea
                        ref={textareaRef}
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="w-full h-64 bg-transparent text-zinc-200 font-mono text-sm leading-relaxed p-5 outline-none resize-y"
                        spellCheck={false}
                    />
                ) : (
                    <pre className={`whitespace-pre-wrap font-mono text-sm text-zinc-200 leading-relaxed p-5 overflow-x-auto ${isSyntaxHighlighted ? 'language-' + (category === PromptCategory.JSON ? 'json' : 'markdown') : ''}`}>
                         {isSyntaxHighlighted ? (
                            <code ref={codeRef} className={languageClass}>
                                {data.refinedPrompt}
                            </code>
                         ) : (
                            renderPromptWithHighlights(data.refinedPrompt)
                         )}
                    </pre>
                )}
            </div>
            {isEditing && (
                <p className="text-[10px] text-zinc-500 mt-2 text-right">Markdown supported. Use **bold** for highlights.</p>
            )}
        </div>

        {/* Structured Details Grid */}
        <div className={`px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4 ${isEditing ? 'opacity-50 pointer-events-none filter blur-[1px]' : ''}`}>
            
            {/* Logic / Explanation */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-4 backdrop-blur-sm">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center space-x-2">
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Logic & Reasoning</span>
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                    {data.explanation}
                </p>
            </div>

            {/* Tips - Keeping emerald for "Good advice" semantics */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-4 backdrop-blur-sm">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Usage Tips</span>
                </h3>
                <ul className="space-y-2.5">
                    {data.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2.5 text-sm text-zinc-400">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500/50 flex-shrink-0" />
                        <span>{tip}</span>
                    </li>
                    ))}
                </ul>
            </div>

            {/* Follow Up */}
            {data.suggestedFollowUp && (
                <div className="md:col-span-2 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/10 rounded-xl p-4 flex items-center space-x-4 backdrop-blur-sm">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <RefreshCw className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-0.5">Suggested Next Step</span>
                        <p className="text-sm text-primary/80 font-medium">"{data.suggestedFollowUp}"</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
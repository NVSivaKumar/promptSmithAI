import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CategorySelector from './components/CategorySelector';
import ResultCard from './components/ResultCard';
import LoadingOverlay from './components/LoadingOverlay';
import HistoryList from './components/HistoryList';
import PlanPage from './components/PlanPage';
import { PromptCategory, GeneratedPromptData, LoadingState, HistoryItem } from './types';
import { generateRefinedPrompt } from './services/gemini';
import { TONE_OPTIONS } from './constants';
import { Zap, Wand2, RefreshCw, Loader2, Clock, Bookmark } from './components/Icon';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Hero } from './components/ui/animated-hero';
import CyberMatrixHero from './components/ui/cyber-matrix-hero';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';

const HISTORY_KEY = 'promptsmith_history_v1';
const SAVED_KEY = 'promptsmith_saved_v1';

const BUTTON_STEPS = [
  "Analyzing Intent...",
  "Applying Frameworks...",
  "Optimizing Tone...",
  "Finalizing Output..."
];

const MainAppContent: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<'generator' | 'plans'>('generator');

  // Generator State
  const [rawInput, setRawInput] = useState('');
  const [category, setCategory] = useState<PromptCategory>(PromptCategory.GENERAL);
  const [tone, setTone] = useState<string>('Professional');
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  
  // Track the specific micro-step for the button animation
  const [loadingStep, setLoadingStep] = useState(0);

  // Result now holds the full HistoryItem structure so we always have an ID
  const [result, setResult] = useState<HistoryItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [savedPrompts, setSavedPrompts] = useState<HistoryItem[]>([]);
  const [listTab, setListTab] = useState<'recent' | 'saved'>('recent');

  // Load history and saved prompts on mount
  useEffect(() => {
    const loadData = (key: string, setter: React.Dispatch<React.SetStateAction<HistoryItem[]>>) => {
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                setter(JSON.parse(saved));
            } catch (e) {
                console.error(`Failed to parse ${key}`, e);
            }
        }
    };
    loadData(HISTORY_KEY, setHistory);
    loadData(SAVED_KEY, setSavedPrompts);
  }, []);

  // Effect to cycle through button steps when loading
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (loadingState === 'loading') {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => {
           // Keep the last step active until loading finishes
           if (prev >= BUTTON_STEPS.length - 1) return prev;
           return prev + 1;
        });
      }, 800); // Change step every 800ms
    }
    return () => clearInterval(interval);
  }, [loadingState]);

  const addToHistory = (item: HistoryItem) => {
    const newHistory = [item, ...history].slice(0, 20); // Keep last 20
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your recent history?")) {
      setHistory([]);
      localStorage.removeItem(HISTORY_KEY);
    }
  };

  const clearSaved = () => {
    if (confirm("Are you sure you want to delete all saved prompts?")) {
        setSavedPrompts([]);
        localStorage.removeItem(SAVED_KEY);
    }
  };

  const handleToggleSave = () => {
    if (!result) return;
    
    const isAlreadySaved = savedPrompts.some(p => p.id === result.id);
    let newSaved;
    
    if (isAlreadySaved) {
        newSaved = savedPrompts.filter(p => p.id !== result.id);
    } else {
        newSaved = [result, ...savedPrompts];
    }
    
    setSavedPrompts(newSaved);
    localStorage.setItem(SAVED_KEY, JSON.stringify(newSaved));
  };

  // Update prompt text in state, history, and saved items
  const handlePromptUpdate = (newPromptText: string) => {
    if (!result) return;

    const updatedItem = { ...result, refinedPrompt: newPromptText };

    // Update current result view
    setResult(updatedItem);

    // Update History
    const updatedHistory = history.map(item => 
        item.id === result.id ? updatedItem : item
    );
    setHistory(updatedHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

    // Update Saved Prompts if it exists there
    if (savedPrompts.some(item => item.id === result.id)) {
        const updatedSaved = savedPrompts.map(item => 
            item.id === result.id ? updatedItem : item
        );
        setSavedPrompts(updatedSaved);
        localStorage.setItem(SAVED_KEY, JSON.stringify(updatedSaved));
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setRawInput(item.originalInput);
    setCategory(item.category);
    setTone(item.tone);
    setResult(item);
    
    // Smooth scroll to result
    const resultElement = document.getElementById('results-section');
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handlers
  const handleSubmit = async () => {
    if (!rawInput.trim()) return;

    setLoadingState('loading');
    setError(null);
    setResult(null);

    try {
      const data = await generateRefinedPrompt(rawInput, category, tone);
      
      // JSON Schema Validation for the JSON Category
      if (category === PromptCategory.JSON) {
        try {
          // Attempt to parse the output. If it's not valid JSON, this throws.
          // We strip potential markdown code fences just in case, though prompt instruction forbids them.
          const cleanJson = data.refinedPrompt.replace(/^```json\s*|```$/g, '').trim();
          const parsedObj = JSON.parse(cleanJson);
          
          // Force Pretty Print: 2 space indentation
          data.refinedPrompt = JSON.stringify(parsedObj, null, 2);
        } catch (e) {
          throw new Error("Generation Failed: The output did not meet strict JSON schema validation requirements. Please try again.");
        }
      }

      const newItem: HistoryItem = {
        ...data,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        originalInput: rawInput,
        category,
        tone
      };

      setResult(newItem);
      addToHistory(newItem);
      setLoadingState('success');
    } catch (err: any) {
      setError(err.message || "Something went wrong while generating the prompt. Please try again.");
      setLoadingState('error');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSubmit();
    }
  };

  const isCurrentResultSaved = result ? savedPrompts.some(p => p.id === result.id) : false;

  return (
    <div className="relative z-10 flex flex-col min-h-screen">
        <Header currentView={currentView} onNavigate={setCurrentView} />

        <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-8 space-y-12">
            
            {/* Conditional Rendering based on View */}
            {currentView === 'generator' ? (
                <>
                    {/* Animated Hero Section */}
                    <Hero />

                    {/* Vertical Stack: Input -> Result */}
                    <div className="flex flex-col gap-12 max-w-4xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
                    
                    {/* Input Controls */}
                    <div className="space-y-8 bg-white/5 p-6 rounded-3xl backdrop-blur-md border border-white/10 ring-1 ring-white/5 shadow-xl w-full">
                        
                        <CategorySelector selected={category} onSelect={setCategory} />

                        <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-sm font-semibold text-zinc-200">Your Rough Idea</label>
                            <div className="flex items-center space-x-2 bg-white/5 p-1 rounded-lg border border-white/10">
                                <label className="text-xs text-zinc-400 pl-2 font-medium">Tone:</label>
                                <select 
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                    className="bg-transparent text-xs font-medium text-zinc-300 hover:text-zinc-100 rounded px-2 py-1 focus:ring-0 outline-none cursor-pointer transition-colors [&>option]:bg-zinc-900 [&>option]:text-zinc-300"
                                >
                                    {TONE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-xl opacity-0 group-hover:opacity-30 group-focus-within:opacity-50 transition duration-500 blur"></div>
                            <textarea
                            value={rawInput}
                            onChange={(e) => setRawInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="E.g., I want a python script to scrape data from a website, or I need an image of a cyberpunk city..."
                            className="relative w-full h-48 bg-zinc-950/40 border border-white/10 rounded-xl p-5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-primary/50 resize-none transition-all shadow-inner backdrop-blur-sm"
                            />
                            <div className="absolute bottom-4 right-4 text-xs text-zinc-500 font-medium pointer-events-none bg-zinc-900/60 px-2 py-1 rounded">
                            Cmd + Enter
                            </div>
                        </div>
                        </div>

                        <button
                        onClick={handleSubmit}
                        disabled={loadingState === 'loading' || !rawInput.trim()}
                        className={`
                            relative w-full rounded-xl font-bold text-lg overflow-hidden transition-all duration-500
                            ${!rawInput.trim() 
                                ? 'bg-white/5 border border-white/10 text-zinc-500 opacity-50 cursor-not-allowed py-4' 
                                : loadingState === 'loading'
                                    ? 'bg-zinc-900/80 border border-primary/30 cursor-wait py-3'
                                    : 'bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.01] active:scale-[0.99] py-4'
                            }
                        `}
                        >
                        {loadingState === 'loading' ? (
                            <>
                                {/* Background glow pulse */}
                                <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
                                
                                {/* Content */}
                                <div className="relative z-10 flex flex-col items-center justify-center w-full">
                                    <span className="text-primary/70 text-sm font-bold tracking-widest uppercase animate-in fade-in slide-in-from-bottom-1 duration-300" key={loadingStep}>
                                    {BUTTON_STEPS[loadingStep]}
                                    </span>
                                    
                                    {/* Progress Line Segments */}
                                    <div className="flex space-x-1.5 mt-2">
                                    {BUTTON_STEPS.map((_, i) => (
                                        <div 
                                            key={i} 
                                            className={`h-1 rounded-full transition-all duration-500 ${
                                            i <= loadingStep 
                                                ? 'w-6 bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]' 
                                                : 'w-2 bg-zinc-800'
                                            }`} 
                                        />
                                    ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center space-x-2">
                            <Zap className="w-5 h-5" />
                            <span>Generate Prompt</span>
                            </div>
                        )}
                        </button>

                        {error && (
                        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                        )}
                    </div>

                    {/* Results Section */}
                    <div id="results-section" className="w-full relative min-h-[500px]">
                        {loadingState === 'loading' && <LoadingOverlay />}
                        
                        {result ? (
                        <ResultCard 
                            data={result} 
                            category={category} 
                            tone={tone}
                            onRegenerate={handleSubmit}
                            isSaved={isCurrentResultSaved}
                            onToggleSave={handleToggleSave}
                            onUpdate={handlePromptUpdate}
                        />
                        ) : (
                        <div className="h-full border-2 border-dashed border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-zinc-600 p-8 text-center min-h-[400px]">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <Wand2 className="w-10 h-10 opacity-30" />
                            </div>
                            <h3 className="text-xl font-semibold text-zinc-500">Ready to Create</h3>
                            <p className="text-sm max-w-xs mt-3 text-zinc-600">
                            Select a category and enter your idea above to see the magic happen.
                            </p>
                        </div>
                        )}
                    </div>

                    </div>

                    {/* History and Saved Section - Moved Down */}
                    <div className="border-t border-white/10 bg-white/5 backdrop-blur-md rounded-3xl p-8 pt-8 mt-12 max-w-4xl mx-auto ring-1 ring-white/5 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* List Toggle Tabs */}
                        <div className="flex items-center justify-center space-x-8 mb-8">
                            <button
                                onClick={() => setListTab('recent')}
                                className={`flex items-center space-x-2 pb-2 text-base font-medium transition-all border-b-2 ${
                                    listTab === 'recent' 
                                    ? 'text-primary border-primary' 
                                    : 'text-zinc-500 border-transparent hover:text-zinc-300'
                                }`}
                            >
                                <Clock className="w-5 h-5" />
                                <span>Recent History</span>
                                {history.length > 0 && (
                                    <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full text-xs ml-1">{history.length}</span>
                                )}
                            </button>
                            <button
                                onClick={() => setListTab('saved')}
                                className={`flex items-center space-x-2 pb-2 text-base font-medium transition-all border-b-2 ${
                                    listTab === 'saved' 
                                    ? 'text-yellow-400 border-yellow-500' 
                                    : 'text-zinc-500 border-transparent hover:text-zinc-300'
                                }`}
                            >
                                <Bookmark className="w-5 h-5" />
                                <span>Saved Collection</span>
                                {savedPrompts.length > 0 && (
                                    <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full text-xs ml-1">{savedPrompts.length}</span>
                                )}
                            </button>
                        </div>

                        {listTab === 'recent' ? (
                            <HistoryList 
                                history={history} 
                                onSelect={handleHistorySelect} 
                                onClear={clearHistory}
                                title="Recent Creations"
                                icon={<Clock className="w-4 h-4" />}
                                clearLabel="Clear History"
                                emptyMessage="No recent prompts generated yet."
                            />
                        ) : (
                            <HistoryList 
                                history={savedPrompts} 
                                onSelect={handleHistorySelect} 
                                onClear={clearSaved}
                                title="Saved Collection"
                                icon={<Bookmark className="w-4 h-4" />}
                                clearLabel="Delete All Saved"
                                emptyMessage="No saved prompts. Click the bookmark icon on a result to save it here."
                            />
                        )}
                    </div>
                </>
            ) : (
                <PlanPage />
            )}
        </main>
    </div>
  );
};

// Routing Wrapper Component
const AppContent: React.FC = () => {
    const { user, isLoading } = useAuth();
    const [authView, setAuthView] = useState<'login' | 'signup'>('login');

    // Ensure we go back to login screen on logout
    useEffect(() => {
        if (!user) {
            setAuthView('login');
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen relative flex flex-col items-center justify-center transition-colors duration-500 overflow-hidden">
                <CyberMatrixHero className="fixed inset-0 z-0" />
                <div className="relative z-10 w-full animate-in fade-in zoom-in-95 duration-500">
                    {authView === 'login' ? (
                        <LoginPage onNavigateToSignup={() => setAuthView('signup')} />
                    ) : (
                        <SignupPage onNavigateToLogin={() => setAuthView('login')} />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative flex flex-col pb-12 transition-colors duration-500 overflow-hidden">
            <CyberMatrixHero className="fixed inset-0 z-0" />
            <MainAppContent />
             <style>{`
                @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

const App: React.FC = () => (
    <ThemeProvider>
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    </ThemeProvider>
);

export default App;
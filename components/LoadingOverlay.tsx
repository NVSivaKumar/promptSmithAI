import React, { useEffect, useState } from 'react';

const LOADING_MESSAGES = [
  "Parsing cognitive intent...",
  "Calibrating semantic weights...",
  "Synthesizing optimal structure...",
  "Injecting expert personas...",
  "Refining clarity parameters...",
  "Applying logic gates...",
  "Finalizing prompt matrix..."
];

const LoadingOverlay: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1500);
    
    // Simulated progress
    const progressInterval = setInterval(() => {
        setProgress(prev => {
            if(prev >= 98) return 98;
            const increment = Math.random() * 2;
            return prev + increment;
        });
    }, 100);

    return () => {
        clearInterval(msgInterval);
        clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl z-30 flex flex-col items-center justify-center rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      
      {/* Background ambient effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(var(--primary-rgb),0.05)_0%,_transparent_50%)] animate-pulse"></div>
      </div>

      {/* Main Spinner Construction */}
      <div className="relative w-40 h-40 flex items-center justify-center mb-8">
        
        {/* Ring 1: Outer Slow */}
        <div className="absolute inset-0 rounded-full border border-slate-800/50"></div>
        <div className="absolute inset-0 rounded-full border-t-2 border-primary opacity-80" style={{ animation: 'spin 3s linear infinite' }}></div>
        
        {/* Ring 2: Middle Medium */}
        <div className="absolute inset-4 rounded-full border border-slate-800/50"></div>
        <div className="absolute inset-4 rounded-full border-r-2 border-secondary opacity-80" style={{ animation: 'spinReverse 2s linear infinite' }}></div>

        {/* Ring 3: Inner Fast */}
        <div className="absolute inset-8 rounded-full border border-slate-800/50"></div>
        <div className="absolute inset-8 rounded-full border-b-2 border-primary/50 opacity-90" style={{ animation: 'spin 1s linear infinite' }}></div>

        {/* Center Core */}
        <div className="absolute w-12 h-12 bg-slate-900 rounded-full border border-primary/30 flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
            <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_15px_2px_rgba(255,255,255,0.8)] animate-pulse"></div>
        </div>
        
        {/* Orbiting Particles */}
        <div className="absolute inset-0" style={{ animation: 'spin 4s linear infinite' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]"></div>
        </div>
      </div>

      {/* Text Content */}
      <div className="relative z-10 text-center space-y-5 max-w-xs mx-auto w-full px-4">
        <div>
            <h3 className="text-xl font-bold text-white tracking-[0.2em] uppercase glow-text">
                Processing
            </h3>
            <div className="h-0.5 w-16 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent mt-2"></div>
        </div>
        
        {/* Typing/Fading Text Effect */}
        <div className="h-6 flex items-center justify-center overflow-hidden">
          <p 
            key={messageIndex} 
            className="text-xs font-mono text-primary/80 animate-in slide-in-from-bottom-2 fade-in duration-300"
          >
            {LOADING_MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Tech Progress Bar */}
        <div className="w-full bg-slate-900/50 rounded-full h-1.5 overflow-hidden border border-slate-800/60 relative">
             <div 
                className="h-full bg-gradient-to-r from-primary via-secondary to-primary transition-all duration-300 ease-out relative shadow-[0_0_10px_rgba(var(--secondary-rgb),0.5)]"
                style={{ width: `${progress}%` }}
             >
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 shadow-[0_0_10px_white]"></div>
             </div>
        </div>
        
        <div className="flex justify-between text-[10px] text-slate-500 font-mono tracking-wider">
            <span>SYS.AI.V2.5</span>
            <span>{Math.floor(progress)}%</span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .glow-text {
            text-shadow: 0 0 20px rgba(var(--primary-rgb), 0.6);
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
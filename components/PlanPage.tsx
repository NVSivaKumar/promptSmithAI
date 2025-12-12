import React from 'react';
import { Check, Shield, Crown, Rocket, Zap, Sparkles, CreditCard, Star } from './Icon';
import { Button } from './ui/button';

const FeatureItem: React.FC<{ children: React.ReactNode; active?: boolean }> = ({ children, active = true }) => (
  <div className={`flex items-start space-x-3 ${active ? 'text-zinc-300' : 'text-zinc-600'}`}>
    <div className={`mt-0.5 p-1 rounded-full ${active ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-600'}`}>
      <Check className="w-3 h-3" />
    </div>
    <span className="text-sm font-medium">{children}</span>
  </div>
);

const PlanPage: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header Section */}
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
          <Crown className="w-5 h-5 text-primary mr-2" />
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Unlock Full Potential</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Supercharge your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Workflow</span>
        </h2>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          Choose the plan that fits your needs. Upgrade to Pro for advanced reasoning models, unlimited history, and exclusive features.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* Free Plan */}
        <div className="relative group p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col hover:border-white/20 transition-all duration-300">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-zinc-200">Starter</h3>
            <div className="flex items-baseline mt-2">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-zinc-500 ml-2">/ month</span>
            </div>
            <p className="text-sm text-zinc-400 mt-2">Perfect for hobbyists and quick tasks.</p>
          </div>

          <div className="space-y-4 mb-8 flex-1">
            <FeatureItem>Standard Generation Speed</FeatureItem>
            <FeatureItem>Access to Basic Categories</FeatureItem>
            <FeatureItem>Recent History (Last 20)</FeatureItem>
            <FeatureItem>Community Support</FeatureItem>
            <FeatureItem active={false}>Advanced JSON Schema Validation</FeatureItem>
            <FeatureItem active={false}>Unlimited Saved Prompts</FeatureItem>
            <FeatureItem active={false}>Priority Processing Queue</FeatureItem>
          </div>

          <Button variant="outline" className="w-full py-6 border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold rounded-xl transition-all">
            Current Plan
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="relative p-8 rounded-3xl bg-black/40 border border-primary/50 backdrop-blur-xl flex flex-col shadow-[0_0_40px_-10px_rgba(var(--primary-rgb),0.3)] transform hover:scale-[1.02] transition-all duration-300">
          {/* Popular Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-secondary rounded-full text-xs font-bold text-white shadow-lg shadow-primary/25 flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            MOST POPULAR
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              Pro Engineer
              <Sparkles className="w-4 h-4 text-secondary" />
            </h3>
            <div className="flex items-baseline mt-2">
              <span className="text-4xl font-bold text-white">$19</span>
              <span className="text-zinc-500 ml-2">/ month</span>
            </div>
            <p className="text-sm text-zinc-400 mt-2">For power users who need precision.</p>
          </div>

          <div className="space-y-4 mb-8 flex-1">
            <FeatureItem>
                <span className="font-semibold text-white">Gemini 2.5 Pro Models</span>
            </FeatureItem>
            <FeatureItem>Unlimited Prompt History & Saves</FeatureItem>
            <FeatureItem>Strict JSON Schema Mode</FeatureItem>
            <FeatureItem>Custom Tone Calibration</FeatureItem>
            <FeatureItem>Bulk Export (CSV/JSON)</FeatureItem>
            <FeatureItem>Zero-Latency Priority Queue</FeatureItem>
            <FeatureItem>Early Access to Beta Features</FeatureItem>
          </div>

          <Button className="w-full py-6 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:brightness-110">
            Upgrade to Pro
          </Button>
        </div>

      </div>

      {/* Feature Deep Dive */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Enterprise Security</h4>
            <p className="text-sm text-zinc-400">Your data is encrypted at rest and in transit. We never use your inputs to train our models without explicit permission.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">High Velocity</h4>
            <p className="text-sm text-zinc-400">Skip the queue. Pro users get dedicated processing power ensuring your prompts are generated in milliseconds.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Advanced Logic</h4>
            <p className="text-sm text-zinc-400">Access Chain-of-Thought reasoning capabilities for complex coding and architectural prompt engineering tasks.</p>
        </div>
      </div>
    </div>
  );
};

export default PlanPage;
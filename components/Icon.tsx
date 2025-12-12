import React from 'react';
import { 
  Wand2, 
  Code2, 
  Image as ImageIcon, 
  PenTool, 
  Briefcase, 
  GraduationCap, 
  Megaphone, 
  MessageSquare,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Zap,
  Clock,
  Trash2,
  ArrowRight,
  Loader2,
  FileJson,
  Bookmark,
  Star,
  Search,
  Pencil,
  X,
  User,
  Shield,
  Crown,
  Rocket,
  CreditCard,
  LayoutDashboard
} from 'lucide-react';
import { PromptCategory } from '../types';

export const CategoryIcon: React.FC<{ category: PromptCategory; className?: string }> = ({ category, className = "w-5 h-5" }) => {
  switch (category) {
    case PromptCategory.CODING: return <Code2 className={className} />;
    case PromptCategory.JSON: return <FileJson className={className} />;
    case PromptCategory.IMAGE_GEN: return <ImageIcon className={className} />;
    case PromptCategory.CREATIVE_WRITING: return <PenTool className={className} />;
    case PromptCategory.BUSINESS: return <Briefcase className={className} />;
    case PromptCategory.ACADEMIC: return <GraduationCap className={className} />;
    case PromptCategory.MARKETING: return <Megaphone className={className} />;
    default: return <MessageSquare className={className} />;
  }
};

export { 
  Wand2, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Zap, 
  Clock, 
  Trash2, 
  ArrowRight, 
  Loader2, 
  FileJson, 
  Bookmark, 
  Star,
  Search,
  Pencil,
  X,
  User,
  Shield,
  Crown,
  Rocket,
  CreditCard,
  LayoutDashboard
};
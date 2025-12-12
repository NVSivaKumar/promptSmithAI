'use client';

import { Suspense, lazy, useMemo } from 'react';
// @ts-ignore
const Spline = lazy(() => import('@splinetool/react-spline'));
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeId } from '../../types';

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

export function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  const { currentTheme } = useTheme();

  // Map theme IDs to hue-rotate values to tint the robot based on the theme.
  // We use sepia(100%) first to establish a consistent color base (yellow/brown ~40-50 hue),
  // then rotate to the target theme color.
  const filterStyle = useMemo(() => {
    let hueRotate = 0;
    
    // Approximate Hue Shifts from Sepia Base:
    // Nebula (Indigo): ~260deg -> +220
    // Ocean (Cyan): ~190deg -> +150
    // Forest (Green): ~120deg -> +80
    // Sunset (Orange/Pink): ~340deg -> -60 (or 300)
    // Amber (Yellow): ~50deg -> 0
    
    switch (currentTheme.id as ThemeId) {
      case 'nebula': hueRotate = 220; break;
      case 'ocean': hueRotate = 150; break;
      case 'forest': hueRotate = 80; break;
      case 'sunset': hueRotate = 320; break;
      case 'amber': hueRotate = 0; break;
      default: hueRotate = 0;
    }

    return `sepia(100%) hue-rotate(${hueRotate}deg) saturate(200%) brightness(0.9) contrast(1.2)`;
  }, [currentTheme.id]);

  return (
    <Suspense
      fallback={
        <div className={`w-full h-full flex items-center justify-center bg-gray-900/50 rounded-xl text-white ${className}`}>
          <div className="flex flex-col items-center gap-2">
            <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path>
            </svg>
            <span className="text-xs text-slate-400">Loading 3D Model...</span>
          </div>
        </div>
      }
    >
      <div className="w-full h-full relative flex items-center justify-center overflow-hidden rounded-xl">
         {/* Filter container to tint the robot */}
         <div style={{ filter: filterStyle, width: '100%', height: '100%' }} className="transition-all duration-1000">
            <Spline
                scene={scene}
                className={className} 
            />
         </div>
      </div>
    </Suspense>
  );
}
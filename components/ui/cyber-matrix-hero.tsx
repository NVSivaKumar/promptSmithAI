"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from "../../lib/utils";

interface CyberMatrixHeroProps {
    children?: React.ReactNode;
    className?: string;
}

const CyberMatrixHero: React.FC<CyberMatrixHeroProps> = ({ children, className }) => {
    const gridRef = useRef<HTMLDivElement>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || !gridRef.current) return;

        const grid = gridRef.current;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>/?;:"[]{}\\|!@#$%^&*()_+-=';
        let columns = 0;
        let rows = 0;
        
        const createTile = (index: number) => {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            
            // Allow clicking tiles to trigger glitch if not covered by other UI
            tile.onclick = (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                target.textContent = chars[Math.floor(Math.random() * chars.length)];
                target.classList.add('glitch');
                setTimeout(() => target.classList.remove('glitch'), 200);
            };

            return tile;
        }

        const createTiles = (quantity: number) => {
            Array.from(Array(quantity)).map((_, index) => {
                grid.appendChild(createTile(index));
            });
        }

        const createGrid = () => {
            grid.innerHTML = '';
            
            const size = 60; 
            columns = Math.floor(window.innerWidth / size);
            rows = Math.floor(window.innerHeight / size);
            
            grid.style.setProperty('--columns', columns.toString());
            grid.style.setProperty('--rows', rows.toString());
            
            createTiles(columns * rows);

            for(let i = 0; i < grid.children.length; i++) {
                const tile = grid.children[i] as HTMLElement;
                tile.textContent = chars[Math.floor(Math.random() * chars.length)];
            }
        }

        const handleMouseMove = (e: MouseEvent) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const radius = window.innerWidth / 3; // Increased radius for better coverage

            for(let i = 0; i < grid.children.length; i++) {
                const tile = grid.children[i] as HTMLElement;
                const rect = tile.getBoundingClientRect();
                const tileX = rect.left + rect.width / 2;
                const tileY = rect.top + rect.height / 2;

                const distance = Math.sqrt(
                    Math.pow(mouseX - tileX, 2) + Math.pow(mouseY - tileY, 2)
                );

                const intensity = Math.max(0, 1 - distance / radius);
                
                tile.style.setProperty('--intensity', intensity.toString());
            }
        };

        window.addEventListener('resize', createGrid);
        window.addEventListener('mousemove', handleMouseMove);
        
        createGrid();

        return () => {
            window.removeEventListener('resize', createGrid);
            window.removeEventListener('mousemove', handleMouseMove);
        };

    }, [isClient]);

    return (
        <div className={cn("fixed inset-0 w-full h-full bg-black/40 overflow-hidden pointer-events-none", className)}>
            {/* Animated Grid Background */}
            <div ref={gridRef} className="matrix-tiles-container pointer-events-auto"></div>
            
            <style>{`
                .matrix-tiles-container {
                    --intensity: 0;
                    display: grid;
                    grid-template-columns: repeat(var(--columns), 1fr);
                    grid-template-rows: repeat(var(--rows), 1fr);
                    width: 100%;
                    height: 100%;
                }
                .tile {
                    position: relative;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 1.2rem;
                    
                    /* Use theme CSS variable */
                    color: rgb(var(--primary-rgb));
                    
                    /* Dynamic opacity for intensity effect - Increased base visibility */
                    opacity: calc(0.1 + var(--intensity) * 0.9);
                    
                    /* Theme-colored glow - added base glow */
                    text-shadow: 0 0 calc(5px + var(--intensity) * 15px) rgba(var(--primary-rgb), 0.5);
                    
                    /* Slight scale and brightness boost on intensity */
                    transform: scale(calc(1 + var(--intensity) * 0.2));
                    filter: brightness(calc(0.9 + var(--intensity) * 1.1));
                    
                    transition: color 0.5s ease, text-shadow 0.5s ease, transform 0.2s ease, opacity 0.2s ease;
                }
                .tile.glitch {
                    animation: glitch-anim 0.2s ease;
                }
                @keyframes glitch-anim {
                    0% { transform: scale(1); color: rgb(var(--primary-rgb)); }
                    50% { transform: scale(1.2); color: #fff; text-shadow: 0 0 10px #fff; }
                    100% { transform: scale(1); color: rgb(var(--primary-rgb)); }
                }
            `}</style>

            {children && <div className="relative z-10 w-full h-full">{children}</div>}
        </div>
    );
};

export default CyberMatrixHero;
import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "./button";
import { InteractiveRobotSpline } from "./interactive-3d-robot";
import { GooeyText } from "./gooey-text-morphing";

function Hero() {
  const titles = useMemo(
    () => ["Professional", "Structured", "Creative", "Efficient", "Optimized"],
    []
  );

  return (
    <div className="w-full relative">
      <div className="min-h-[500px] h-auto">
        <div className="container mx-auto px-4 py-12 lg:py-20">
            {/* Main Flex Container - Switches from column (mobile) to row (desktop) */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-between">
                
                {/* Left Side: Text Content */}
                <div className="flex-1 w-full lg:w-3/5 flex gap-8 items-center lg:items-start justify-center flex-col bg-white/5 p-8 rounded-3xl backdrop-blur-sm border border-primary/30 z-20 shadow-[0_0_20px_-5px_rgba(var(--primary-rgb),0.2)] ring-1 ring-primary/20 transition-all duration-500">
                    <div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2 pointer-events-none border-primary/20 bg-primary/10 hover:bg-primary/20 transition-all shadow-[0_0_20px_-10px_rgba(var(--primary-rgb),0.5)]"
                        >
                        <Sparkles className="w-4 h-4 text-primary" /> 
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
                            Powered by Gemini 2.5 Flash
                        </span>
                        </Button>
                    </div>
                    <div className="flex gap-2 flex-col items-center lg:items-start text-center lg:text-left w-full">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-4xl tracking-tighter font-bold flex flex-col items-center lg:items-start">
                          <span className="text-zinc-100 mb-2 drop-shadow-lg">Generate</span>
                          
                          {/* Gooey Text Container */}
                          <div className="h-16 md:h-24 lg:h-28 w-full relative flex items-center justify-center lg:justify-start overflow-visible">
                             <GooeyText 
                                texts={titles} 
                                morphTime={1.5}
                                cooldownTime={1.5}
                                className="w-full h-full"
                                textClassName="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-4 drop-shadow-sm"
                             />
                          </div>

                          <span className="text-zinc-100 block mt-2 drop-shadow-lg">prompts instantly.</span>
                        </h1>

                        <p className="text-lg md:text-xl leading-relaxed tracking-tight text-zinc-300 max-w-xl mt-6">
                        Stop wrestling with vague AI instructions. Transform your raw ideas into 
                        production-ready prompts for Coding, Writing, and Art Generation in seconds.
                        </p>
                    </div>
                </div>

                {/* Right Side: 3D Robot */}
                <div className="flex-1 w-full lg:w-2/5 h-[300px] md:h-[400px] relative z-10 flex items-center justify-center perspective-1000">
                    {/* Add a subtle glow behind the robot */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-primary/20 blur-[80px] rounded-full pointer-events-none"></div>
                    
                    {/* Added scaling to make the robot appear smaller within the container */}
                    <div className="w-full h-full scale-90 transform-gpu">
                        <InteractiveRobotSpline 
                            scene="https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode" 
                            className="w-full h-full"
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
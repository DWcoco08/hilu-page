import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useMobileDetect } from "../hooks/useMobileDetect";

export function Hero() {
  const isMobile = useMobileDetect();
  const [animationPhase, setAnimationPhase] = useState(0);
  const [showSkip, setShowSkip] = useState(true);

  useEffect(() => {
    // Skip animations on mobile - go straight to final phase
    if (isMobile) {
      setAnimationPhase(3);
      setShowSkip(false);
      return;
    }

    const timer1 = setTimeout(() => setAnimationPhase(1), 500);
    const timer2 = setTimeout(() => setAnimationPhase(2), 1500);
    const timer3 = setTimeout(() => {
      setAnimationPhase(3);
      setShowSkip(false);
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isMobile]);

  const skipAnimation = () => {
    setAnimationPhase(3);
    setShowSkip(false);
  };

  // Mobile version - no animations, direct render
  if (isMobile) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h1 className="text-6xl lg:text-7xl text-gray-900 tracking-tight leading-none">
              <span className="block text-[#125EF1]">Hilu</span>
              <span className="block text-gray-900">
                we make Hi-Logic, user-centric programs
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We turn complex ideas into simple, powerful solutions.
              Building intelligent systems with effortless user experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                size="lg"
                className="bg-[#125EF1] hover:bg-[#0e4dc4] text-white px-8 py-4 rounded-full"
              >
                Start Your Project
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 hover:border-[#125EF1] hover:text-[#125EF1] px-8 py-4 rounded-full transition-all duration-300"
              >
                View Our Work
              </Button>
            </div>
          </div>
        </div>

        {/* Simple scroll indicator for mobile */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div
            className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center cursor-pointer"
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2" />
          </div>
        </div>
      </section>
    );
  }

  // Desktop version with full animations
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Skip button */}
      <AnimatePresence>
        {showSkip && (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={skipAnimation}
            className="absolute top-24 right-8 z-50 text-gray-600 hover:text-[#125EF1] transition-colors duration-300 text-sm"
          >
            Skip Animation
          </motion.button>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 text-center">
        <AnimatePresence mode="wait">
          {/* Phase 0 & 1: Logo appears */}
          {animationPhase < 2 && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <motion.div className="text-8xl lg:text-9xl text-gray-900 tracking-tight leading-none">
                <motion.span
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: animationPhase >= 1 ? 1 : 0, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-[#125EF1]"
                >
                  Hi
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: animationPhase >= 1 ? 1 : 0, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="text-gray-900"
                >
                  lu
                </motion.span>
              </motion.div>
            </motion.div>
          )}

          {/* Phase 2: Transition to slogan */}
          {animationPhase >= 2 && (
            <motion.div
              key="slogan"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <motion.h1
                className="text-6xl lg:text-7xl text-gray-900 tracking-tight leading-none"
              >
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="block text-[#125EF1]"
                >
                  Hilu
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="block text-gray-900"
                >
                  we make Hi-Logic, user-centric programs
                </motion.span>
              </motion.h1>

              {animationPhase >= 3 && (
                <>
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                  >
                    We turn complex ideas into simple, powerful solutions.
                    Building intelligent systems with effortless user experiences.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="lg"
                        className="bg-[#125EF1] hover:bg-[#0e4dc4] text-white px-8 py-4 rounded-full relative group overflow-hidden"
                      >
                        <span className="relative z-10">Start Your Project</span>
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-2 border-gray-300 hover:border-[#125EF1] hover:text-[#125EF1] px-8 py-4 rounded-full transition-all duration-300"
                      >
                        View Our Work
                      </Button>
                    </motion.div>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll indicator - only show after animation completes */}
      {animationPhase >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center cursor-pointer"
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
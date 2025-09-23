import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Hero } from "./components/Hero";
import { Navigation } from "./components/Navigation";
import { Services } from "./components/Services";
import { BuiltProducts } from "./components/BuiltProducts";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Toaster } from "./components/ui/sonner";
import { useMobileDetect } from "./hooks/useMobileDetect";

export default function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isMobile = useMobileDetect();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Only track mouse on desktop
      if (!isMobile) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  return (
    <div className="min-h-screen relative">
      {/* Blank Background */}
      <div className="fixed inset-0 bg-white" />

      {/* Only render background effects on desktop */}
      {!isMobile && (
        <>
          {/* Orange blob as part of background - lowest layer */}
          <motion.div
            className="fixed pointer-events-none z-1"
            animate={{
              x: mousePosition.x - 112.5,
              y: mousePosition.y - 112.5,
            }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 200,
              mass: 0.8
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 0.9, 1.1, 1],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration: 8,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="w-60 h-60 rounded-full"
              style={{
                background: `radial-gradient(circle,
                  rgba(251, 146, 60, 0.1) 0%,
                  rgba(252, 211, 77, 0.08) 30%,
                  rgba(245, 101, 101, 0.06) 60%,
                  transparent 100%)`,
                filter: 'blur(48px)'
              }}
            />
            <motion.div
              animate={{
                scale: [0.8, 1.1, 0.9, 1.2, 0.8],
                rotate: [360, 270, 180, 90, 0],
              }}
              transition={{
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="absolute top-6 left-6 w-48 h-48 rounded-full"
              style={{
                background: `radial-gradient(circle,
                  rgba(252, 211, 77, 0.08) 0%,
                  rgba(251, 146, 60, 0.1) 40%,
                  rgba(249, 115, 22, 0.06) 70%,
                  transparent 100%)`,
                filter: 'blur(36px)'
              }}
            />
            <motion.div
              animate={{
                scale: [1.1, 0.7, 1.3, 0.9, 1.1],
                rotate: [180, 270, 0, 90, 180],
              }}
              transition={{
                duration: 10,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="absolute top-12 left-12 w-36 h-36 rounded-full"
              style={{
                background: `radial-gradient(circle,
                  rgba(254, 215, 170, 0.12) 0%,
                  rgba(251, 191, 36, 0.1) 35%,
                  rgba(251, 146, 60, 0.08) 65%,
                  transparent 100%)`,
                filter: 'blur(24px)'
              }}
            />
          </motion.div>

          {/* Enhanced orange blob lighting under content areas */}
          <motion.div
            className="fixed pointer-events-none z-1"
            animate={{
              x: mousePosition.x - 112.5,
              y: mousePosition.y - 112.5,
            }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 200,
              mass: 0.8
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 0.9, 1.1, 1],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration: 8,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="w-60 h-60 rounded-full mix-blend-screen"
              style={{
                background: `radial-gradient(circle,
                  rgba(251, 146, 60, 0.25) 0%,
                  rgba(252, 211, 77, 0.2) 30%,
                  rgba(245, 101, 101, 0.15) 60%,
                  transparent 100%)`,
                filter: 'blur(36px)',
                maskImage: `
                  radial-gradient(circle 300px at 50% 15%, black 0%, black 100%),
                  radial-gradient(circle 400px at 50% 60%, black 0%, black 100%),
                  radial-gradient(circle 350px at 50% 85%, black 0%, black 100%)
                `,
                WebkitMaskImage: `
                  radial-gradient(circle 300px at 50% 15%, black 0%, black 100%),
                  radial-gradient(circle 400px at 50% 60%, black 0%, black 100%),
                  radial-gradient(circle 350px at 50% 85%, black 0%, black 100%)
                `,
                maskComposite: 'intersect'
              }}
            />
          </motion.div>

          {/* Blue floating blobs with displacement mask */}
          <div className="fixed inset-0 z-2">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                borderRadius: ["50%", "60%", "50%"],
              }}
              transition={{
                duration: 20,
                ease: "linear",
                repeat: Infinity,
              }}
              className="absolute top-20 left-10 w-96 h-96 rounded-full"
              style={{
                background: `radial-gradient(circle,
                  rgba(18, 94, 241, 0.15) 0%,
                  rgba(18, 94, 241, 0.1) 60%,
                  transparent 100%)`,
                maskImage: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, transparent 40%, black 80%)`,
                WebkitMaskImage: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, transparent 40%, black 80%)`,
                filter: 'blur(72px)'
              }}
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
                borderRadius: ["60%", "50%", "60%"],
              }}
              transition={{
                duration: 25,
                ease: "linear",
                repeat: Infinity,
              }}
              className="absolute bottom-20 right-10 w-80 h-80 rounded-full"
              style={{
                background: `radial-gradient(circle,
                  rgba(18, 94, 241, 0.12) 0%,
                  rgba(18, 94, 241, 0.08) 60%,
                  transparent 100%)`,
                filter: 'blur(60px)',
                maskImage: `radial-gradient(circle 140px at ${mousePosition.x}px ${mousePosition.y}px, transparent 45%, black 85%)`,
                WebkitMaskImage: `radial-gradient(circle 140px at ${mousePosition.x}px ${mousePosition.y}px, transparent 45%, black 85%)`
              }}
            />
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                x: [0, 100, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 30,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full"
              style={{
                background: `radial-gradient(circle,
                  rgba(18, 94, 241, 0.1) 0%,
                  rgba(18, 94, 241, 0.06) 70%,
                  transparent 100%)`,
                filter: 'blur(48px)',
                maskImage: `radial-gradient(circle 120px at ${mousePosition.x}px ${mousePosition.y}px, transparent 50%, black 90%)`,
                WebkitMaskImage: `radial-gradient(circle 120px at ${mousePosition.x}px ${mousePosition.y}px, transparent 50%, black 90%)`
              }}
            />
            <motion.div
              animate={{
                scale: [1.1, 1, 1.1],
                rotate: [180, 90, 0],
                x: [0, -80, 0],
              }}
              transition={{
                duration: 35,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full"
              style={{
                background: `radial-gradient(circle,
                  rgba(18, 94, 241, 0.08) 0%,
                  rgba(18, 94, 241, 0.05) 65%,
                  transparent 100%)`,
                filter: 'blur(64px)',
                maskImage: `radial-gradient(circle 160px at ${mousePosition.x}px ${mousePosition.y}px, transparent 35%, black 75%)`,
                WebkitMaskImage: `radial-gradient(circle 160px at ${mousePosition.x}px ${mousePosition.y}px, transparent 35%, black 75%)`
              }}
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, -180, -360],
                y: [0, 60, 0],
              }}
              transition={{
                duration: 40,
                ease: "linear",
                repeat: Infinity,
              }}
              className="absolute bottom-1/4 left-1/4 w-56 h-56 rounded-full"
              style={{
                background: `radial-gradient(circle,
                  rgba(18, 94, 241, 0.12) 0%,
                  rgba(18, 94, 241, 0.07) 65%,
                  transparent 100%)`,
                filter: 'blur(44px)',
                maskImage: `radial-gradient(circle 130px at ${mousePosition.x}px ${mousePosition.y}px, transparent 45%, black 85%)`,
                WebkitMaskImage: `radial-gradient(circle 130px at ${mousePosition.x}px ${mousePosition.y}px, transparent 45%, black 85%)`
              }}
            />

            {/* Enhanced blue blob lighting under content areas */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                borderRadius: ["50%", "60%", "50%"],
              }}
              transition={{
                duration: 20,
                ease: "linear",
                repeat: Infinity,
              }}
              className="absolute top-20 left-10 w-96 h-96 rounded-full mix-blend-screen"
              style={{
                background: `radial-gradient(circle,
                  rgba(18, 94, 241, 0.3) 0%,
                  rgba(18, 94, 241, 0.2) 60%,
                  transparent 100%)`,
                filter: 'blur(48px)',
                maskImage: `
                  radial-gradient(circle 300px at 50% 15%, black 0%, black 100%),
                  radial-gradient(circle 400px at 50% 60%, black 0%, black 100%),
                  radial-gradient(circle 350px at 50% 85%, black 0%, black 100%)
                `,
                WebkitMaskImage: `
                  radial-gradient(circle 300px at 50% 15%, black 0%, black 100%),
                  radial-gradient(circle 400px at 50% 60%, black 0%, black 100%),
                  radial-gradient(circle 350px at 50% 85%, black 0%, black 100%)
                `,
                maskComposite: 'intersect'
              }}
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
                borderRadius: ["60%", "50%", "60%"],
              }}
              transition={{
                duration: 25,
                ease: "linear",
                repeat: Infinity,
              }}
              className="absolute bottom-20 right-10 w-80 h-80 rounded-full mix-blend-screen"
              style={{
                background: `radial-gradient(circle,
                  rgba(18, 94, 241, 0.25) 0%,
                  rgba(18, 94, 241, 0.15) 60%,
                  transparent 100%)`,
                filter: 'blur(40px)',
                maskImage: `
                  radial-gradient(circle 300px at 50% 15%, black 0%, black 100%),
                  radial-gradient(circle 400px at 50% 60%, black 0%, black 100%),
                  radial-gradient(circle 350px at 50% 85%, black 0%, black 100%)
                `,
                WebkitMaskImage: `
                  radial-gradient(circle 300px at 50% 15%, black 0%, black 100%),
                  radial-gradient(circle 400px at 50% 60%, black 0%, black 100%),
                  radial-gradient(circle 350px at 50% 85%, black 0%, black 100%)
                `,
                maskComposite: 'intersect'
              }}
            />
          </div>

          {/* Frosted glass effect - orange blob showing through content cards */}
          <motion.div
            className="fixed pointer-events-none z-6"
            animate={{
              x: mousePosition.x - 112.5,
              y: mousePosition.y - 112.5,
            }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 200,
              mass: 0.8
            }}
          >
            {/* Main orange blob for cards */}
            <motion.div
              animate={{
                scale: [1, 1.2, 0.9, 1.1, 1],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration: 8,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="w-60 h-60 rounded-full"
              style={{
                background: `radial-gradient(circle,
                  rgba(251, 146, 60, 0.08) 0%,
                  rgba(252, 211, 77, 0.06) 30%,
                  rgba(245, 101, 101, 0.04) 60%,
                  transparent 100%)`,
                filter: 'blur(40px)',
                maskImage: `
                  radial-gradient(circle 200px at 25% 45%, black 30%, transparent 70%),
                  radial-gradient(circle 250px at 75% 45%, black 30%, transparent 70%),
                  radial-gradient(circle 200px at 25% 65%, black 30%, transparent 70%),
                  radial-gradient(circle 250px at 75% 65%, black 30%, transparent 70%),
                  radial-gradient(circle 400px at 50% 40%, black 25%, transparent 65%),
                  radial-gradient(circle 350px at 50% 75%, black 30%, transparent 70%),
                  radial-gradient(circle 600px at 50% 88%, black 25%, transparent 65%)
                `,
                WebkitMaskImage: `
                  radial-gradient(circle 200px at 25% 45%, black 30%, transparent 70%),
                  radial-gradient(circle 250px at 75% 45%, black 30%, transparent 70%),
                  radial-gradient(circle 200px at 25% 65%, black 30%, transparent 70%),
                  radial-gradient(circle 250px at 75% 65%, black 30%, transparent 70%),
                  radial-gradient(circle 400px at 50% 40%, black 25%, transparent 65%),
                  radial-gradient(circle 350px at 50% 75%, black 30%, transparent 70%),
                  radial-gradient(circle 600px at 50% 88%, black 25%, transparent 65%)
                `,
                maskComposite: 'add'
              }}
            />

            {/* Secondary orange blob layer for depth */}
            <motion.div
              animate={{
                scale: [0.8, 1.1, 0.9, 1.2, 0.8],
                rotate: [360, 270, 180, 90, 0],
              }}
              transition={{
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="absolute top-6 left-6 w-48 h-48 rounded-full"
              style={{
                background: `radial-gradient(circle,
                  rgba(252, 211, 77, 0.06) 0%,
                  rgba(251, 146, 60, 0.08) 40%,
                  rgba(249, 115, 22, 0.04) 70%,
                  transparent 100%)`,
                filter: 'blur(25px)',
                maskImage: `
                  radial-gradient(circle 180px at 25% 45%, black 35%, transparent 75%),
                  radial-gradient(circle 220px at 75% 45%, black 35%, transparent 75%),
                  radial-gradient(circle 180px at 25% 65%, black 35%, transparent 75%),
                  radial-gradient(circle 220px at 75% 65%, black 35%, transparent 75%),
                  radial-gradient(circle 350px at 50% 40%, black 30%, transparent 70%),
                  radial-gradient(circle 300px at 50% 75%, black 35%, transparent 75%),
                  radial-gradient(circle 550px at 50% 88%, black 30%, transparent 70%)
                `,
                WebkitMaskImage: `
                  radial-gradient(circle 180px at 25% 45%, black 35%, transparent 75%),
                  radial-gradient(circle 220px at 75% 45%, black 35%, transparent 75%),
                  radial-gradient(circle 180px at 25% 65%, black 35%, transparent 75%),
                  radial-gradient(circle 220px at 75% 65%, black 35%, transparent 75%),
                  radial-gradient(circle 350px at 50% 40%, black 30%, transparent 70%),
                  radial-gradient(circle 300px at 50% 75%, black 35%, transparent 75%),
                  radial-gradient(circle 550px at 50% 88%, black 30%, transparent 70%)
                `,
                maskComposite: 'add'
              }}
            />

            {/* Tertiary layer for subtle warmth */}
            <motion.div
              animate={{
                scale: [1.1, 0.7, 1.3, 0.9, 1.1],
                rotate: [180, 270, 0, 90, 180],
              }}
              transition={{
                duration: 10,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="absolute top-12 left-12 w-36 h-36 rounded-full"
              style={{
                background: `radial-gradient(circle,
                  rgba(254, 215, 170, 0.1) 0%,
                  rgba(251, 191, 36, 0.08) 35%,
                  rgba(251, 146, 60, 0.06) 65%,
                  transparent 100%)`,
                filter: 'blur(15px)',
                maskImage: `
                  radial-gradient(circle 160px at 25% 45%, black 40%, transparent 80%),
                  radial-gradient(circle 200px at 75% 45%, black 40%, transparent 80%),
                  radial-gradient(circle 160px at 25% 65%, black 40%, transparent 80%),
                  radial-gradient(circle 200px at 75% 65%, black 40%, transparent 80%),
                  radial-gradient(circle 320px at 50% 40%, black 35%, transparent 75%),
                  radial-gradient(circle 280px at 50% 75%, black 40%, transparent 80%),
                  radial-gradient(circle 500px at 50% 88%, black 35%, transparent 75%)
                `,
                WebkitMaskImage: `
                  radial-gradient(circle 160px at 25% 45%, black 40%, transparent 80%),
                  radial-gradient(circle 200px at 75% 45%, black 40%, transparent 80%),
                  radial-gradient(circle 160px at 25% 65%, black 40%, transparent 80%),
                  radial-gradient(circle 200px at 75% 65%, black 40%, transparent 80%),
                  radial-gradient(circle 320px at 50% 40%, black 35%, transparent 75%),
                  radial-gradient(circle 280px at 50% 75%, black 40%, transparent 80%),
                  radial-gradient(circle 500px at 50% 88%, black 35%, transparent 75%)
                `,
                maskComposite: 'add'
              }}
            />
          </motion.div>

          {/* Glass content area overlays */}
          <div className="fixed inset-0 z-4">
            {/* Hero section glass overlay */}
            <div
              className="absolute top-0 left-0 right-0 h-screen bg-white/3 backdrop-blur-[0.5px]"
              style={{
                maskImage: `
                  radial-gradient(ellipse 600px 200px at 50% 50%, black 20%, transparent 70%)
                `,
                WebkitMaskImage: `
                  radial-gradient(ellipse 600px 200px at 50% 50%, black 20%, transparent 70%)
                `
              }}
            />

            {/* Services section glass overlay */}
            <div
              className="absolute top-[100vh] left-0 right-0 h-screen bg-white/3 backdrop-blur-[0.5px]"
              style={{
                maskImage: `
                  radial-gradient(ellipse 800px 300px at 50% 50%, black 15%, transparent 65%)
                `,
                WebkitMaskImage: `
                  radial-gradient(ellipse 800px 300px at 50% 50%, black 15%, transparent 65%)
                `
              }}
            />

            {/* Other sections glass overlay */}
            <div
              className="absolute top-[200vh] left-0 right-0 h-[200vh] bg-white/3 backdrop-blur-[0.5px]"
              style={{
                maskImage: `
                  radial-gradient(ellipse 700px 250px at 50% 30%, black 20%, transparent 70%),
                  radial-gradient(ellipse 600px 200px at 50% 70%, black 25%, transparent 75%)
                `,
                WebkitMaskImage: `
                  radial-gradient(ellipse 700px 250px at 50% 30%, black 20%, transparent 70%),
                  radial-gradient(ellipse 600px 200px at 50% 70%, black 25%, transparent 75%)
                `,
                maskComposite: 'add'
              }}
            />
          </div>

          {/* Subtle glass overlay */}
          <div className="fixed inset-0 bg-white/5 backdrop-blur-sm z-3" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        <Hero />
        <Services />
        <BuiltProducts />
        <About />
        <Contact />
      </div>

      {/* Toast notifications */}
      <Toaster position="top-right" />
    </div>
  );
}
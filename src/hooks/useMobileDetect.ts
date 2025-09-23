import { useState, useEffect } from 'react';

export function useMobileDetect() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check for mobile based on screen width and touch capability
      const mobile = window.innerWidth <= 768 ||
                    'ontouchstart' in window ||
                    navigator.maxTouchPoints > 0;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

// Helper function to get proper animation props for mobile/desktop
export function getAnimationProps(isMobile: boolean, desktopProps: any) {
  if (isMobile) {
    // On mobile, components should be visible immediately without animation
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      whileInView: { opacity: 1 },
      transition: { duration: 0 }
    };
  }
  return desktopProps;
}
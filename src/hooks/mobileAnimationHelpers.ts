// Helper to get proper animation props for mobile vs desktop
// On mobile, everything should be visible immediately without animation

export function getMotionProps(isMobile: boolean, desktopProps: {
  initial?: any;
  animate?: any;
  whileInView?: any;
  whileHover?: any;
  whileTap?: any;
  exit?: any;
  transition?: any;
  [key: string]: any;
}) {
  if (isMobile) {
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      whileInView: { opacity: 1 },
      transition: { duration: 0 }
    };
  }
  return desktopProps;
}
/**
 * Responsive Design Utilities
 * Tailwind breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
 */

export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const responsiveClasses = {
  // Spacing
  containerPadding: 'px-4 sm:px-6 lg:px-8',
  sectionGap: 'gap-4 sm:gap-6 lg:gap-8',
  cardGap: 'gap-3 sm:gap-4 lg:gap-6',
  
  // Grid layouts
  grid2Col: 'grid-cols-1 sm:grid-cols-2',
  grid3Col: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  grid4Col: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  
  // Typography
  heading1: 'text-2xl sm:text-3xl lg:text-4xl',
  heading2: 'text-xl sm:text-2xl lg:text-3xl',
  heading3: 'text-lg sm:text-xl lg:text-2xl',
  bodyText: 'text-sm sm:text-base',
  smallText: 'text-xs sm:text-sm',
  
  // Flex layouts
  flexCol: 'flex flex-col gap-3 sm:flex-row sm:gap-4 lg:gap-6',
  flexBetween: 'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
  
  // Buttons
  buttonSize: 'px-3 py-2 sm:px-4 sm:py-2.5',
  
  // Display utilities
  hideOnMobile: 'hidden sm:block',
  showOnMobile: 'block sm:hidden',
  hideOnTablet: 'hidden md:block',
  showOnTablet: 'block md:hidden',
} as const;

/**
 * Hook to detect screen size
 */
export const useResponsive = () => {
  const [screenSize, setScreenSize] = React.useState<keyof typeof breakpoints>('md');

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < breakpoints.sm) setScreenSize('xs');
      else if (width < breakpoints.md) setScreenSize('sm');
      else if (width < breakpoints.lg) setScreenSize('md');
      else if (width < breakpoints.xl) setScreenSize('lg');
      else if (width < breakpoints['2xl']) setScreenSize('xl');
      else setScreenSize('2xl');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

import React from 'react';

import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  full: 'w-full',
};

const paddingClasses = {
  none: '',
  sm: 'px-3 sm:px-4',
  md: 'px-4 sm:px-6 lg:px-8',
  lg: 'px-6 sm:px-8 lg:px-12',
};

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  maxWidth = 'xl',
  padding = 'md',
}) => {
  return (
    <div className={cn('mx-auto w-full', maxWidthClasses[maxWidth], paddingClasses[padding], className)}>
      {children}
    </div>
  );
};

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const gapClasses = {
  sm: 'gap-3 sm:gap-4',
  md: 'gap-4 sm:gap-6 lg:gap-8',
  lg: 'gap-6 sm:gap-8 lg:gap-10',
};

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = 3,
  gap = 'md',
  className,
}) => {
  return (
    <div className={cn('grid', columnClasses[columns], gapClasses[gap], className)}>
      {children}
    </div>
  );
};

interface ResponsiveFlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'col';
  justify?: 'start' | 'center' | 'between' | 'around' | 'end';
  align?: 'start' | 'center' | 'end' | 'stretch';
  gap?: 'sm' | 'md' | 'lg';
  wrap?: boolean;
  className?: string;
  responsive?: boolean;
}

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  end: 'justify-end',
};

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

export const ResponsiveFlex: React.FC<ResponsiveFlexProps> = ({
  children,
  direction = 'row',
  justify = 'start',
  align = 'center',
  gap = 'md',
  wrap = false,
  className,
  responsive = true,
}) => {
  const directionClass = responsive
    ? direction === 'col'
      ? 'flex flex-col sm:flex-row'
      : 'flex flex-col sm:flex-row'
    : direction === 'col'
      ? 'flex flex-col'
      : 'flex flex-row';

  return (
    <div
      className={cn(
        directionClass,
        justifyClasses[justify],
        alignClasses[align],
        gapClasses[gap],
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  );
};

interface ResponsiveStackProps {
  children: React.ReactNode;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  gap = 'md',
  className,
}) => {
  return (
    <div className={cn('flex flex-col', gapClasses[gap], className)}>
      {children}
    </div>
  );
};

interface ResponsiveHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
  title,
  subtitle,
  action,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm sm:text-base text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="flex flex-wrap gap-2">{action}</div>}
    </div>
  );
};

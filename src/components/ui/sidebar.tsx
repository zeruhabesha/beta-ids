"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { Button } from "./button"
import { PanelLeft, PanelLeftClose, PanelLeftOpen, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

// Sheet Components (used as base for Sidebar)
const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

// Sidebar Context
interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
  state: 'open' | 'closed' | 'collapsed' | 'expanded';
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({
  children,
  defaultOpen = false,
  ...props
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  // Check if the screen is mobile on mount and on window resize
  React.useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768; // Tailwind's md breakpoint (768px)
      if (mobile !== isMobile) {
        setIsMobile(mobile);
        // Only update open state if switching between mobile and desktop
        if (mobile) {
          setOpen(false); // Close sidebar by default on mobile
        } else {
          setOpen(true); // Open sidebar by default on desktop
        }
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setOpen(!open);
    } else {
      toggleCollapse();
    }
  };

  const value = React.useMemo(
    () => ({
      isCollapsed,
      toggleCollapse,
      open,
      setOpen,
      isMobile,
      toggleSidebar,
      state: (isMobile ? (open ? 'open' : 'closed') : (isCollapsed ? 'collapsed' : 'expanded')) as 'open' | 'closed' | 'collapsed' | 'expanded'
    }),
    [isCollapsed, open, isMobile]
  );

  return (
    <SidebarContext.Provider value={value} {...props}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

// Sidebar Components
export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  collapsible?: boolean;
  className?: string;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, collapsed = false, onCollapse, collapsible = true, children, ...props }, ref) => {
    const { isMobile, open, setOpen, toggleSidebar, state } = useSidebar();
    const [isCollapsed, setIsCollapsed] = React.useState(collapsed);

    React.useEffect(() => {
      setIsCollapsed(collapsed);
    }, [collapsed]);

    const handleCollapse = () => {
      const newState = !isCollapsed;
      setIsCollapsed(newState);
      onCollapse?.(newState);
    };

    // Close sidebar when clicking outside on mobile
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const sidebar = document.querySelector('.sidebar-container');
        const sidebarTrigger = document.querySelector('.sidebar-trigger');
        
        if (isMobile && open && sidebar && !sidebar.contains(target) && !sidebarTrigger?.contains(target)) {
          setOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobile, open, setOpen]);

    // Add overflow hidden to body when mobile sidebar is open
    React.useEffect(() => {
      if (isMobile) {
        document.body.style.overflow = open ? 'hidden' : '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [isMobile, open]);

    // Mobile sidebar
    if (isMobile) {
      return (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="left"
            className="w-[280px] max-w-full p-0 border-r-0"
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <div
              ref={ref}
              className={cn(
                "flex h-full flex-col bg-background transition-all duration-300 ease-in-out",
                className
              )}
              {...props}
            >
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {children}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      );
    }

    // Desktop sidebar
    return (
      <div
        ref={ref}
        className={cn(
          "sidebar-container flex h-screen flex-col border-r bg-background transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          "hidden md:flex", // Hide on mobile, show on md and up
          className
        )}
        {...props}
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
        {collapsible && (
          <button
            onClick={handleCollapse}
            className="flex h-12 w-full items-center justify-center border-t p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-16 items-center px-4", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 space-y-1 px-2 py-4", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 pt-0", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold tracking-tight", className)}
    {...props}
  />
))
SidebarTitle.displayName = "SidebarTitle"

const SidebarDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SidebarDescription.displayName = "SidebarDescription"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { label?: string }
>(({ className, label, children, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1", className)} {...props}>
    {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
    <SidebarGroupContent>{children}</SidebarGroupContent>
  </div>
))
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-1 px-2 py-1", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider", className)}
    {...props}
  />
))
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-1 px-2 py-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm font-medium outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn("relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm font-medium outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", className)}
    {...props}
  />
))
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-auto", className)}
    {...props}
  />
))
SidebarInset.displayName = "SidebarInset"

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const { toggleSidebar, isMobile, isCollapsed, open } = useSidebar()
  
  if (asChild) {
    const child = React.Children.only(props.children) as React.ReactElement;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        toggleSidebar();
        child.props.onClick?.(e);
      },
      className: cn(
        "sidebar-trigger inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "md:h-9 md:px-3",
        child.props.className,
        className
      ),
      'aria-label': isMobile ? 'Open menu' : 'Toggle sidebar',
      'aria-expanded': isMobile ? open : !isCollapsed
    });
  }
  
  return (
    <button
      ref={ref}
      type="button"
      className={cn("sidebar-trigger inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 w-10", className)}
      onClick={toggleSidebar}
      aria-label={isMobile ? 'Open menu' : 'Toggle sidebar'}
      aria-expanded={isMobile ? false : undefined}
      {...props}
    >
      {isMobile ? <Menu className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
      <span className="sr-only">{isMobile ? 'Open menu' : 'Toggle sidebar'}</span>
    </button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

// Export all components
export {
  // Sheet components
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  
  // Sidebar components and hooks
  Sidebar,
  SidebarInset,
  // useSidebar is already exported above
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTitle,
  SidebarDescription,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  
  // For backward compatibility
  Sheet as Root,
  SheetTrigger as Trigger,
  SheetClose as Close,
  SheetContent as Content,
  SheetOverlay as Overlay,
  SheetPortal as Portal,
}

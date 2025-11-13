import { Shield, Activity, Bell, Network, Target, Settings, BarChart3, Menu, PanelLeft, PanelRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

const menuItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Alerts", url: "/alerts", icon: Bell },
  { title: "Network Traffic", url: "/traffic", icon: Network },
  { title: "Rules", url: "/rules", icon: Target },
  { title: "Activity", url: "/activity", icon: Activity },
  { title: "Settings", url: "/settings", icon: Settings },
];

// Simple debounce helper function
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

interface AppSidebarProps {
  children?: React.ReactNode;
}

export function AppSidebar({ children }: AppSidebarProps) {
  const { state, toggleCollapse } = useSidebar();
  const isCollapsed = state === "collapsed";
  const windowWidth = useRef(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const wasMobile = windowWidth.current < 768;
      const isMobile = newWidth < 768;
      
      // Only proceed if we're crossing the mobile breakpoint
      if (wasMobile !== isMobile) {
        if (isMobile && !isCollapsed) {
          toggleCollapse();
        } else if (!isMobile && isCollapsed) {
          toggleCollapse();
        }
      }
      windowWidth.current = newWidth;
    };

    // Add debounce to prevent rapid firing on resize
    const debouncedResize = debounce(handleResize, 100);
    
    window.addEventListener('resize', debouncedResize);
    // Initial check
    handleResize();
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, [isCollapsed, toggleCollapse]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        collapsible={true} 
        className={`border-r border-border h-full z-50 transition-all duration-300 ${
          isCollapsed ? 'w-[70px]' : 'w-64'
        }`}
        style={{ position: 'fixed', top: 0, left: 0, bottom: 0 }}
      >
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
              <Shield className="h-6 w-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <h1 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Beta
                </h1>
                <p className="text-xs text-muted-foreground">IDS/IPS Monitor</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            {!isCollapsed && <SidebarGroupLabel>Navigation</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu className={isCollapsed ? 'items-center' : ''}>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                          isCollapsed ? 'justify-center w-10 mx-auto' : 'justify-start'
                        )
                      }
                      title={isCollapsed ? item.title : ''}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className={cn('whitespace-nowrap', isCollapsed ? 'hidden' : 'block')}>
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div 
        className="flex-1 overflow-auto transition-all duration-300 bg-background"
        style={{
          marginLeft: isCollapsed ? '70px' : '16rem',
          width: isCollapsed ? 'calc(100% - 70px)' : 'calc(100% - 16rem)',
          height: '100vh',
          overflowY: 'auto'
        }}
      >
        {children}
      </div>
    </div>
  );
}
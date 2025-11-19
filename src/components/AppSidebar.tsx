import { Shield, Activity, Bell, Network, Target, Settings, BarChart3, HeartPulse, FileText, Database, Radar } from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Alerts", url: "/alerts", icon: Bell },
  { title: "Network Traffic", url: "/traffic", icon: Network },
  { title: "Rules", url: "/rules", icon: Target },
  { title: "Clusters", url: "/clusters", icon: Database },
  { title: "Indicators", url: "/indicators", icon: Radar },
  { title: "Activity", url: "/activity", icon: Activity },
  { title: "System Health", url: "/system-health", icon: HeartPulse },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];



export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar 
      className="border-r border-border"
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
            <SidebarMenu>
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
                        isCollapsed ? 'justify-center px-2' : 'justify-start'
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
  );
}
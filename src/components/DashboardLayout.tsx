import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";
import { Separator } from "./ui/separator";
import { Footer } from "./Footer";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 flex h-14 sm:h-16 items-center gap-2 sm:gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 sm:px-4 lg:px-6 shrink-0">
            <SidebarTrigger className="h-8 w-8 sm:h-9 sm:w-9" />
            <Separator orientation="vertical" className="h-5 sm:h-6" />
            <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
              <div className="hidden sm:block truncate">
                <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  <span className="inline-block h-2 w-2 rounded-full bg-success animate-pulse mr-2" />
                  System Online
                </p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 ml-auto">
                <NotificationBell />
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="p-3 sm:p-4 lg:p-6">
              {children}
            </div>
          </main>
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

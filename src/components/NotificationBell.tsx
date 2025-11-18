import { Bell, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'success' | 'warning' | 'error' | 'info';
};

export function NotificationBell() {
  // Mock notifications - replace with your actual data
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'New Alert',
      description: 'Potential security threat detected on 192.168.1.1',
      time: '2 min ago',
      read: false,
      type: 'error'
    },
    {
      id: '2',
      title: 'System Update',
      description: 'New version 2.3.1 is available',
      time: '1 hour ago',
      read: false,
      type: 'info'
    },
    {
      id: '3',
      title: 'Backup Completed',
      description: 'System backup completed successfully',
      time: '3 hours ago',
      read: true,
      type: 'success'
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationColor = (type: string) => {
    switch(type) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'info':
      default: return 'bg-blue-500';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end" forceMount>
        <div className="flex items-center justify-between p-4 border-b">
          <DropdownMenuLabel className="text-sm font-medium">
            Notifications
          </DropdownMenuLabel>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
              Mark all as read
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
              Clear all
            </Button>
          </div>
        </div>
        
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id} 
                  className={`flex items-start gap-3 p-3 ${!notification.read ? 'bg-muted/50' : ''}`}
                >
                  <div className={`h-2 w-2 mt-1.5 rounded-full flex-shrink-0 ${getNotificationColor(notification.type)}`} />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-2">
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          )}
        </ScrollArea>
        
        <div className="p-2 border-t">
          <Button variant="ghost" className="w-full justify-center text-sm">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

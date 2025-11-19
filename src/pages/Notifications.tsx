import { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Search,
  Archive,
  Star,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type NotificationType = 'success' | 'warning' | 'error' | 'info';

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  archived: boolean;
  type: NotificationType;
  category: string;
  source?: string;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Critical Alert: DDoS Attack Detected',
      description: 'High volume of traffic from 45.77.23.11 targeting web server. Automatic mitigation activated.',
      time: '2 min ago',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      read: false,
      starred: true,
      archived: false,
      type: 'error',
      category: 'Security',
      source: 'IDS Engine'
    },
    {
      id: '2',
      title: 'Rule Update Available',
      description: 'New Suricata ruleset v2.3.1 is available with 47 new signatures.',
      time: '15 min ago',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      starred: false,
      archived: false,
      type: 'info',
      category: 'System',
      source: 'Update Manager'
    },
    {
      id: '3',
      title: 'Backup Completed Successfully',
      description: 'System backup completed. 2.4 GB backed up to remote storage.',
      time: '1 hour ago',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: true,
      starred: false,
      archived: false,
      type: 'success',
      category: 'System',
      source: 'Backup Service'
    },
    {
      id: '4',
      title: 'Suspicious Activity Detected',
      description: 'Multiple failed SSH login attempts from 192.168.1.105. IP has been temporarily blocked.',
      time: '2 hours ago',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      starred: false,
      archived: false,
      type: 'warning',
      category: 'Security',
      source: 'IDS Engine'
    },
    {
      id: '5',
      title: 'Sensor Cluster Sync Complete',
      description: 'Edge perimeter cluster synchronized with 6 sensors. Coverage: 92%',
      time: '3 hours ago',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: true,
      starred: false,
      archived: false,
      type: 'success',
      category: 'Network',
      source: 'Cluster Manager'
    },
    {
      id: '6',
      title: 'High Memory Usage Warning',
      description: 'System memory usage at 87%. Consider reviewing active processes.',
      time: '5 hours ago',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: true,
      starred: false,
      archived: false,
      type: 'warning',
      category: 'System',
      source: 'System Monitor'
    },
    {
      id: '7',
      title: 'New Threat Intelligence Feed',
      description: 'Imported 234 new indicators from threat intelligence feed.',
      time: '1 day ago',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      starred: false,
      archived: false,
      type: 'info',
      category: 'Security',
      source: 'Threat Intel'
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | NotificationType>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'error':
        return 'border-l-red-500';
      case 'info':
      default:
        return 'border-l-blue-500';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    // Tab filter
    if (activeTab === 'unread' && notification.read) return false;
    if (activeTab === 'starred' && !notification.starred) return false;
    if (activeTab === 'archived' && !notification.archived) return false;
    if (activeTab === 'all' && notification.archived) return false;

    // Search filter
    if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !notification.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Type filter
    if (filterType !== 'all' && notification.type !== filterType) return false;

    // Category filter
    if (filterCategory !== 'all' && notification.category !== filterCategory) return false;

    return true;
  });

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;
  const starredCount = notifications.filter(n => n.starred && !n.archived).length;
  const archivedCount = notifications.filter(n => n.archived).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    toast.success('Notification marked as read');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const toggleStar = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, starred: !n.starred } : n))
    );
  };

  const archiveNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, archived: true } : n))
    );
    toast.success('Notification archived');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const clearAll = () => {
    setNotifications(prev => prev.filter(n => !n.read || n.starred));
    toast.success('Read notifications cleared');
  };

  const categories = ['all', ...Array.from(new Set(notifications.map(n => n.category)))];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notification Center
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">All Notifications</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Stay updated with system alerts, security events, and important updates.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0} className="text-xs sm:text-sm">
            <CheckCheck className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Mark all read
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll} className="text-xs sm:text-sm">
            <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Clear read
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-3xl font-semibold">{notifications.filter(n => !n.archived).length}</p>
            </div>
            <Bell className="h-10 w-10 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Unread</p>
              <p className="text-3xl font-semibold">{unreadCount}</p>
            </div>
            <AlertCircle className="h-10 w-10 text-orange-500" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Starred</p>
              <p className="text-3xl font-semibold">{starredCount}</p>
            </div>
            <Star className="h-10 w-10 text-yellow-500" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Archived</p>
              <p className="text-3xl font-semibold">{archivedCount}</p>
            </div>
            <Archive className="h-10 w-10 text-gray-500" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" /> Filter & Search
            </CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterType} onValueChange={(value) => setFilterType(value as typeof filterType)}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All ({notifications.filter(n => !n.archived).length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="starred">
            Starred ({starredCount})
          </TabsTrigger>
          <TabsTrigger value="archived">
            Archived ({archivedCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`border-l-4 ${getNotificationColor(notification.type)} ${
                    !notification.read ? 'bg-muted/30' : ''
                  } transition-all hover:shadow-md`}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-3 flex-1">
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-sm sm:text-base">{notification.title}</h3>
                              {!notification.read && (
                                <Badge variant="default" className="text-xs">New</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{notification.time}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              {notification.category}
                            </Badge>
                            {notification.source && (
                              <Badge variant="secondary" className="text-xs">
                                {notification.source}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 sm:flex-col">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleStar(notification.id)}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              notification.starred ? 'fill-yellow-500 text-yellow-500' : ''
                            }`}
                          />
                        </Button>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        {!notification.archived && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => archiveNotification(notification.id)}
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No notifications found</p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || filterType !== 'all' || filterCategory !== 'all'
                    ? 'Try adjusting your filters'
                    : 'You\'re all caught up!'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;

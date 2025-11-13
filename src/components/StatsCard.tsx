import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  variant?: "default" | "success" | "warning" | "destructive" | "info";
}

export const StatsCard = ({ title, value, icon: Icon, trend, variant = "default" }: StatsCardProps) => {
  const variantStyles = {
    default: "bg-card text-card-foreground",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
    info: "bg-info/10 text-info border-info/20",
  };

  const iconStyles = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
    info: "text-info",
  };

  return (
    <Card className={`transition-all hover:shadow-glow border ${variantStyles[variant]}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trend !== undefined && (
              <p className={`text-xs ${trend >= 0 ? 'text-success' : 'text-destructive'}`}>
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last hour
              </p>
            )}
          </div>
          <div className={`rounded-full p-3 ${iconStyles[variant]} bg-current/10`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

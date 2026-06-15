import React from "react";
import { 
  Briefcase, 
  FileText, 
  MessageSquare, 
  TrendingUp 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getProjectsCount } from "@/app/actions/projects";
import { getMaterialsCount } from "@/app/actions/materials";
import { getUnreadMessagesCount } from "@/app/actions/messages";

export default async function DashboardPage() {
  const [projectsCount, materialsCount, unreadMessages] = await Promise.all([
    getProjectsCount(),
    getMaterialsCount(),
    getUnreadMessagesCount(),
  ]);

  const dashboardStats = [
    { name: "Total Projects", value: projectsCount.toString(), icon: Briefcase, change: "Real-time", isPositive: true },
    { name: "Materials", value: materialsCount.toString(), icon: FileText, change: "Real-time", isPositive: true },
    { name: "New Messages", value: unreadMessages.toString(), icon: MessageSquare, change: unreadMessages > 0 ? "Unread" : "All read", isPositive: unreadMessages === 0 },
    { name: "Site Status", value: "Live", icon: TrendingUp, change: "Healthy", isPositive: true },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-gray-500 mt-1">Manage your portfolio content and track performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <div key={stat.name} className="card-premium p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider",
                stat.change === "Unread" ? "bg-destructive/20 text-destructive" : "bg-primary/10 text-primary"
              )}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
              <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-premium p-8 min-h-[300px]">
          <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="text-sm font-medium text-foreground">Database synchronized with production</p>
                <p className="text-xs text-muted-foreground mt-1">Just now</p>
              </div>
            </div>
            <div className="flex gap-4 items-start opacity-70">
              <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admin session started successfully</p>
                <p className="text-xs text-muted-foreground mt-1">Recent</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-premium p-8 min-h-[300px]">
          <h3 className="text-xl font-bold mb-6">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">Database Connection</span>
              <span className="text-xs font-bold text-primary uppercase">Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">API Response Time</span>
              <span className="text-xs font-bold text-primary uppercase">Fast</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">Storage Quota</span>
              <span className="text-xs font-bold text-primary uppercase">Healthy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

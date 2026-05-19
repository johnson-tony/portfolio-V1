import React from "react";
import { 
  Briefcase, 
  FileText, 
  MessageSquare, 
  TrendingUp 
} from "lucide-react";

const stats = [
  { name: "Total Projects", value: "12", icon: Briefcase, change: "+2 this month" },
  { name: "Materials", value: "45", icon: FileText, change: "+5 this month" },
  { name: "New Messages", value: "3", icon: MessageSquare, change: "Unread" },
  { name: "Profile Views", value: "1,284", icon: TrendingUp, change: "+12% from last week" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <p className="text-gray-500 mt-1">Manage your portfolio content and track performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-dark p-6 rounded-3xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={cn(
                "text-xs font-bold px-2 py-1 rounded-full",
                stat.change.includes("Unread") ? "bg-primary/20 text-primary" : "bg-green-500/10 text-green-500"
              )}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-dark p-8 rounded-[2.5rem] border border-white/5 min-h-[400px]">
          <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="text-sm font-medium text-white">New project "Lumina AI" added to portfolio</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-dark p-8 rounded-[2.5rem] border border-white/5 min-h-[400px]">
          <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="h-32 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold">Add Project</span>
            </button>
            <button className="h-32 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold">Upload PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add cn utility if not available in this scope or import it
import { cn } from "@/lib/utils";

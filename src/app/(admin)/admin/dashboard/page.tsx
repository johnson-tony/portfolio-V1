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
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#EDF2F4]">System Overview</h1>
          <p className="text-[#8D99AE] text-sm mt-1">Real-time metrics and system status across your application.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#34384F] border border-[rgba(141,153,174,0.1)] text-[#8D99AE] text-xs font-bold uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Systems Normal
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <div key={stat.name} className="card-premium p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#2B2D42] border border-[rgba(141,153,174,0.1)] flex items-center justify-center text-[#8D99AE]">
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider",
                stat.change === "Unread" 
                  ? "bg-[#EF233C]/10 text-[#EF233C] border border-[#EF233C]/20" 
                  : "bg-[#8D99AE]/10 text-[#8D99AE] border border-[#8D99AE]/20"
              )}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#8D99AE] mb-1">{stat.name}</p>
              <h3 className="text-2xl font-bold text-[#EDF2F4]">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card-premium p-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[rgba(141,153,174,0.05)]">
            <h3 className="text-lg font-bold text-[#EDF2F4]">Activity Log</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] hover:text-[#EDF2F4] cursor-pointer transition-colors">View All</span>
          </div>
          <div className="space-y-8">
            <div className="flex gap-6 items-start relative before:absolute before:left-[11px] before:top-6 before:bottom-[-20px] before:w-px before:bg-[rgba(141,153,174,0.1)] last:before:hidden">
              <div className="w-6 h-6 rounded-full bg-[#34384F] border border-[#8D99AE]/30 flex items-center justify-center shrink-0 z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8D99AE]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#EDF2F4]">Database synchronized</p>
                <p className="text-xs text-[#8D99AE] mt-1">Automatic sync with MongoDB Atlas successful.</p>
                <p className="text-[10px] font-bold text-[#8D99AE]/50 uppercase mt-2 tracking-tighter">Just now • Systems</p>
              </div>
            </div>
            <div className="flex gap-6 items-start relative before:absolute before:left-[11px] before:top-6 before:bottom-[-20px] before:w-px before:bg-[rgba(141,153,174,0.1)] last:before:hidden">
              <div className="w-6 h-6 rounded-full bg-[#34384F] border border-[#8D99AE]/30 flex items-center justify-center shrink-0 z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8D99AE]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#EDF2F4]">New session initiated</p>
                <p className="text-xs text-[#8D99AE] mt-1">Admin access granted to johnson_tony.</p>
                <p className="text-[10px] font-bold text-[#8D99AE]/50 uppercase mt-2 tracking-tighter">15m ago • Security</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-premium p-8">
          <h3 className="text-lg font-bold text-[#EDF2F4] mb-8 pb-4 border-b border-[rgba(141,153,174,0.05)]">Health Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#2B2D42] border border-[rgba(141,153,174,0.05)]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8D99AE]">Latency</span>
              <span className="text-xs font-bold text-[#EDF2F4]">24ms</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#2B2D42] border border-[rgba(141,153,174,0.05)]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8D99AE]">Storage</span>
              <span className="text-xs font-bold text-[#EDF2F4]">4% Used</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#2B2D42] border border-[rgba(141,153,174,0.05)]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8D99AE]">Database</span>
              <span className="text-xs font-bold text-emerald-400">Stable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

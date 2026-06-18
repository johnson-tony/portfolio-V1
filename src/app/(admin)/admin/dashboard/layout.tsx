import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="admin-panel min-h-screen bg-[#1F2233] text-[#EDF2F4]">
      <AdminSidebar />
      <div className="lg:pl-64 transition-all duration-300">
        <header className="h-16 border-b border-[rgba(141,153,174,0.15)] flex items-center justify-between px-4 md:px-8 bg-[#1F2233] sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold tracking-tight ml-12 lg:ml-0 text-[#EDF2F4]">Overview</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8D99AE] hidden sm:inline-block">
              Welcome, <span className="text-[#EDF2F4]">{session.user?.name}</span>
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#2B2D42] border border-[rgba(141,153,174,0.3)] flex items-center justify-center text-[#8D99AE] font-bold text-xs">
              {session.user?.name?.[0].toUpperCase()}
            </div>
          </div>
        </header>
        <main className="p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}

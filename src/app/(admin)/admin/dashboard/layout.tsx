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
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <AdminSidebar />
      <div className="pl-64">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0A0A0B]/50 backdrop-blur-md sticky top-0 z-40">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Welcome, <span className="text-white font-medium">{session.user?.name}</span></span>
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
              {session.user?.name?.[0].toUpperCase()}
            </div>
          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

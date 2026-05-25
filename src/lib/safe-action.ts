import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized: You must be logged in as an admin to perform this action.");
  }

  const role = (session.user as any)?.role;
  if (role !== "admin") {
    throw new Error("Forbidden: Admin access required.");
  }

  return session;
}

export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

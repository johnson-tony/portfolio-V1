"use server";

import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";
import { revalidatePath } from "next/cache";

export async function getMessages() {
  await dbConnect();
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(messages));
  } catch (error) {
    console.error("Fetch Messages Error:", error);
    return [];
  }
}

export async function markAsRead(id: string) {
  await dbConnect();
  try {
    await Message.findByIdAndUpdate(id, { isRead: true });
    revalidatePath("/admin/dashboard/messages");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteMessage(id: string) {
  await dbConnect();
  try {
    await Message.findByIdAndDelete(id);
    revalidatePath("/admin/dashboard/messages");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

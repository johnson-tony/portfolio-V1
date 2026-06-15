"use server";

import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";
import { revalidatePath } from "next/cache";

import { checkAuth, ActionResponse } from "@/lib/safe-action";

export async function getMessages() {
  try {
    await checkAuth();
    await dbConnect();
    const messages = await Message.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(messages));
  } catch (error) {
    console.error("Fetch Messages Error:", error);
    return [];
  }
}

export async function getMessagesCount() {
  try {
    await checkAuth();
    await dbConnect();
    return await Message.countDocuments({});
  } catch (error) {
    return 0;
  }
}

export async function getUnreadMessagesCount() {
  try {
    await checkAuth();
    await dbConnect();
    return await Message.countDocuments({ isRead: false });
  } catch (error) {
    return 0;
  }
}

export async function markAsRead(id: string): Promise<ActionResponse> {
  try {
    await checkAuth();
    await dbConnect();
    await Message.findByIdAndUpdate(id, { isRead: true });
    revalidatePath("/admin/dashboard/messages");
    return { success: true };
  } catch (error: any) {
    console.error("Mark Message Read Error:", error);
    return { success: false, error: error.message || "Failed to mark message as read" };
  }
}

export async function deleteMessage(id: string): Promise<ActionResponse> {
  try {
    await checkAuth();
    await dbConnect();
    await Message.findByIdAndDelete(id);
    revalidatePath("/admin/dashboard/messages");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Message Error:", error);
    return { success: false, error: error.message || "Failed to delete message" };
  }
}

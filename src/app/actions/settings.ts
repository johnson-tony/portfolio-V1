"use server";

import dbConnect from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  await dbConnect();
  try {
    let settings = await Settings.findOne({}).lean();
    if (!settings) {
      settings = new Settings({});
      await (settings as any).save();
    }
    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error("Get Settings Error:", error);
    return null;
  }
}

export async function updateSettings(data: any) {
  await dbConnect();
  try {
    const existing = await Settings.findOne({});
    if (existing) {
      await Settings.findByIdAndUpdate(existing._id, data);
    } else {
      const newSettings = new Settings(data);
      await newSettings.save();
    }
    revalidatePath("/");
    revalidatePath("/admin/dashboard/settings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

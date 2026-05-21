"use server";

import dbConnect from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { revalidatePath } from "next/cache";

import { checkAuth, ActionResponse } from "@/lib/safe-action";
import { settingsSchema } from "@/lib/validations";

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

export async function updateSettings(data: any): Promise<ActionResponse> {
  try {
    await checkAuth();
    await dbConnect();
    
    const validatedData = settingsSchema.parse(data);
    
    const existing = await Settings.findOne({});
    if (existing) {
      await Settings.findByIdAndUpdate(existing._id, validatedData);
    } else {
      const newSettings = new Settings(validatedData);
      await newSettings.save();
    }
    
    revalidatePath("/");
    revalidatePath("/admin/dashboard/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Update Settings Error:", error);
    return { success: false, error: error.message || "Failed to update settings" };
  }
}

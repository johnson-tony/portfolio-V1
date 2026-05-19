"use server";

import dbConnect from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { revalidatePath } from "next/cache";

import { checkAuth, ActionResponse } from "@/lib/safe-action";
import { profileSchema } from "@/lib/validations";

export async function getProfile() {
  await dbConnect();
  try {
    const profile = await Profile.findOne({}).lean();
    return profile ? JSON.parse(JSON.stringify(profile)) : null;
  } catch (error) {
    console.error("Get Profile Error:", error);
    return null;
  }
}

export async function updateProfile(data: any): Promise<ActionResponse> {
  try {
    await checkAuth();
    await dbConnect();
    
    const validatedData = profileSchema.parse(data);
    
    const existing = await Profile.findOne({});
    if (existing) {
      await Profile.findByIdAndUpdate(existing._id, validatedData);
    } else {
      const newProfile = new Profile(validatedData);
      await newProfile.save();
    }
    
    revalidatePath("/");
    revalidatePath("/admin/dashboard/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Update Profile Error:", error);
    return { success: false, error: error.message || "Failed to update profile" };
  }
}

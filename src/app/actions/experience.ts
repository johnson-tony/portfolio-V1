"use server";

import dbConnect from "@/lib/mongodb";
import Experience from "@/models/Experience";
import { checkAuth, ActionResponse } from "@/lib/safe-action";
import { experienceSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getExperiences() {
  await dbConnect();
  try {
    const experiences = await Experience.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(experiences));
  } catch (error) {
    console.error("Fetch Experiences Error:", error);
    return [];
  }
}

export async function addExperience(data: any): Promise<ActionResponse> {
  try {
    await checkAuth();
    await dbConnect();
    
    const validatedData = experienceSchema.parse(data);
    const newExperience = new Experience(validatedData);
    await newExperience.save();
    
    revalidatePath("/");
    revalidatePath("/admin/dashboard/experience");
    return { success: true };
  } catch (error: any) {
    console.error("Add Experience Error:", error);
    return { success: false, error: error.message || "Failed to add experience" };
  }
}

export async function updateExperience(id: string, data: any): Promise<ActionResponse> {
  try {
    await checkAuth();
    await dbConnect();
    
    const validatedData = experienceSchema.parse(data);
    await Experience.findByIdAndUpdate(id, validatedData);
    
    revalidatePath("/");
    revalidatePath("/admin/dashboard/experience");
    return { success: true };
  } catch (error: any) {
    console.error("Update Experience Error:", error);
    return { success: false, error: error.message || "Failed to update experience" };
  }
}

export async function deleteExperience(id: string): Promise<ActionResponse> {
  try {
    await checkAuth();
    await dbConnect();
    
    await Experience.findByIdAndDelete(id);
    
    revalidatePath("/");
    revalidatePath("/admin/dashboard/experience");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Experience Error:", error);
    return { success: false, error: error.message || "Failed to delete experience" };
  }
}

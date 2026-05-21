"use server";

import dbConnect from "@/lib/mongodb";
import Material from "@/models/Material";
import { revalidatePath } from "next/cache";

import { checkAuth, ActionResponse } from "@/lib/safe-action";
import { materialSchema } from "@/lib/validations";

export async function getMaterials() {
  await dbConnect();
  try {
    const materials = await Material.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(materials));
  } catch (error) {
    console.error("Fetch Materials Error:", error);
    return [];
  }
}

export async function addMaterial(data: any): Promise<ActionResponse> {
  try {
    await checkAuth();
    await dbConnect();
    
    const validatedData = materialSchema.parse(data);
    const newMaterial = new Material(validatedData);
    await newMaterial.save();
    
    revalidatePath("/");
    revalidatePath("/admin/dashboard/materials");
    return { success: true };
  } catch (error: any) {
    console.error("Add Material Error:", error);
    return { success: false, error: error.message || "Failed to add material" };
  }
}

export async function deleteMaterial(id: string): Promise<ActionResponse> {
  try {
    await checkAuth();
    await dbConnect();
    
    await Material.findByIdAndDelete(id);
    
    revalidatePath("/");
    revalidatePath("/admin/dashboard/materials");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Material Error:", error);
    return { success: false, error: error.message || "Failed to delete material" };
  }
}

export async function updateMaterial(id: string, data: any): Promise<ActionResponse> {
  try {
    await checkAuth();
    await dbConnect();
    
    const validatedData = materialSchema.parse(data);
    await Material.findByIdAndUpdate(id, validatedData);
    
    revalidatePath("/");
    revalidatePath("/admin/dashboard/materials");
    return { success: true };
  } catch (error: any) {
    console.error("Update Material Error:", error);
    return { success: false, error: error.message || "Failed to update material" };
  }
}

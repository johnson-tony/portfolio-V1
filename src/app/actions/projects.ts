"use server";

import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

import { checkAuth, ActionResponse } from "@/lib/safe-action";
import { projectSchema } from "@/lib/validations";

export async function getProjects() {
  await dbConnect();
  try {
    const projects = await Project.find({}).sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    console.error("Fetch Projects Error:", error);
    return [];
  }
}

export async function getProjectsCount() {
  await dbConnect();
  try {
    return await Project.countDocuments({});
  } catch (error) {
    return 0;
  }
}

export async function getProjectById(id: string) {
  await dbConnect();
  try {
    const project = await Project.findById(id).lean();
    return project ? JSON.parse(JSON.stringify(project)) : null;
  } catch (error) {
    console.error("Fetch Project Error:", error);
    return null;
  }
}

export async function addProject(data: any): Promise<ActionResponse> {
  try {
    await checkAuth();
    await dbConnect();
    
    const validatedData = projectSchema.parse(data);
    const newProject = new Project(validatedData);
    await newProject.save();
    
    revalidatePath("/");
    revalidatePath("/admin/dashboard/projects");
    return { success: true };
  } catch (error: any) {
    console.error("Add Project Error:", error);
    return { success: false, error: error.message || "Failed to add project" };
  }
}

export async function updateProject(id: string, data: any): Promise<ActionResponse> {
  try {
    await checkAuth();
    await dbConnect();
    
    const validatedData = projectSchema.parse(data);
    await Project.findByIdAndUpdate(id, validatedData);
    
    revalidatePath("/");
    revalidatePath("/admin/dashboard/projects");
    return { success: true };
  } catch (error: any) {
    console.error("Update Project Error:", error);
    return { success: false, error: error.message || "Failed to update project" };
  }
}

export async function deleteProject(id: string): Promise<ActionResponse> {
  try {
    await checkAuth();
    await dbConnect();
    
    await Project.findByIdAndDelete(id);
    
    revalidatePath("/");
    revalidatePath("/admin/dashboard/projects");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Project Error:", error);
    return { success: false, error: error.message || "Failed to delete project" };
  }
}

import { revalidatePath } from "next/cache";

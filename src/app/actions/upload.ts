"use server";

import cloudinary from "@/lib/cloudinary";
import { checkAuth, ActionResponse } from "@/lib/safe-action";

export async function uploadFile(formData: FormData): Promise<ActionResponse<string>> {
  try {
    await checkAuth();

    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
    const result = await cloudinary.uploader.upload(base64File, {
      folder: "portfolio",
      resource_type: isPdf ? "raw" : "auto",
      use_filename: true,
      unique_filename: true,
    });

    return { success: true, data: result.secure_url };
  } catch (error: any) {
    console.error("Upload Error:", error);
    return { success: false, error: error.message || "Failed to upload file" };
  }
}

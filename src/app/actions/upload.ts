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

export async function deleteFile(url: string): Promise<ActionResponse> {
  if (!url || !url.includes("cloudinary.com")) return { success: true };

  try {
    await checkAuth();

    // Extract public_id from Cloudinary URL
    // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567/folder/filename.ext
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return { success: false, error: "Invalid Cloudinary URL" };

    // The public_id starts after the version (v1234567)
    const publicIdWithExt = parts.slice(uploadIndex + 2).join("/");
    const publicId = publicIdWithExt.split(".")[0];

    // Determine resource type (raw for PDFs, image for others)
    const isPdf = url.toLowerCase().endsWith(".pdf");
    
    await cloudinary.uploader.destroy(publicId, {
      resource_type: isPdf ? "raw" : "image"
    });

    return { success: true };
  } catch (error: any) {
    console.error("Cloudinary Delete Error:", error);
    return { success: false, error: "Failed to delete file from Cloudinary" };
  }
}

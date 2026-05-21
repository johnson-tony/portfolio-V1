import * as z from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  detailedDescription: z.string().optional(),
  techStack: z.array(z.string()).min(1, "At least one technology is required"),
  imageUrl: z.string().url("Invalid image URL"),
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  liveDemoUrl: z.string().url("Invalid live demo URL").optional().or(z.literal("")),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  about: z.string().min(20, "About section must be at least 20 characters"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  socialLinks: z.object({
    github: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    email: z.string().email().optional().or(z.literal("")),
  }),
});

export const materialSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.string().min(2, "Category is required"),
  fileUrl: z.string().url("Invalid file URL"),
  thumbnailUrl: z.string().url("Invalid thumbnail URL").optional().or(z.literal("")),
});

export const settingsSchema = z.object({
  siteTitle: z.string().min(2, "Site title is required"),
  logoUrl: z.string().url().optional().or(z.literal("")),
  accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  heroHeading: z.string().min(5, "Hero heading must be at least 5 characters"),
  heroSubheading: z.string().min(10, "Hero subheading must be at least 10 characters"),
});

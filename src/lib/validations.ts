import * as z from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name is too long")
    .regex(/^[\p{L}][\p{L}\p{M}'’.\- ]+$/u, "Name contains invalid characters"),
  email: z.string().trim().toLowerCase().email("Invalid email address").max(254, "Email is too long"),
  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message is too long")
    .refine((value) => !/<script\b/i.test(value), "Message contains invalid content"),
  website: z.string().optional().refine((value) => !value || value.trim() === "", "Spam detected"),
});

export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  detailedDescription: z.string().optional(),
  techStack: z.preprocess((value) => {
    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return value;
  }, z.array(z.string()).min(1, "At least one technology is required")),
  imageUrl: z.string().url("Invalid image URL"),
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  liveDemoUrl: z.string().url("Invalid live demo URL").optional().or(z.literal("")),
});

export const adminLoginSchema = z.object({
  username: z.string().trim().min(2, "Username must be at least 2 characters").max(64, "Username is too long"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password is too long"),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  about: z.string().min(20, "About section must be at least 20 characters"),
  education: z.array(z.object({
    institution: z.string().min(2, "Institution is required"),
    degree: z.string().min(2, "Degree is required"),
    year: z.string().min(2, "Year is required"),
  })),
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

export const experienceSchema = z.object({
  company: z.string().min(2, "Company name must be at least 2 characters"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  period: z.string().min(2, "Period is required (e.g., 2022 - Present)"),
  location: z.string().min(2, "Location is required").optional().or(z.literal("")),
  description: z.string().min(10, "Description must be at least 10 characters"),
  order: z.number().default(0),
});

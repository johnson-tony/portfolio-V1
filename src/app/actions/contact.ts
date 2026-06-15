"use server";

import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";
import { Resend } from "resend";
import { contactSchema } from "@/lib/validations";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactMessage(formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Invalid form data" };
  }

  const { name, email, message: content } = parsed.data;

  await dbConnect();

  try {
    // 1. Save to DB
    const newMessage = new Message({ name, email, content });
    await newMessage.save();

    // Revalidate paths to update counts/lists
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/dashboard/messages");

    // 2. Attempt to send emails (don't block the DB success if email fails)
    try {
      await resend.emails.send({
        from: "Portfolio <onboarding@resend.dev>",
        to: process.env.ADMIN_EMAIL || "tony@example.com",
        replyTo: email,
        subject: `New Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${content}`,
      });

      await resend.emails.send({
        from: "Portfolio <onboarding@resend.dev>",
        to: email,
        subject: "Thank you for contacting me!",
        text: `Hi ${name},\n\nThank you for reaching out! I've received your message and will get back to you soon.`,
      });
    } catch (emailError) {
      console.warn("Email Sending Error (ignoring):", emailError);
      // We continue because the message is already saved in the DB
    }

    return { success: true };
  } catch (error: any) {
    console.error("Database Storage Error:", error);
    return { success: false, error: "Failed to store message. Please try again later." };
  }
}

import { revalidatePath } from "next/cache";

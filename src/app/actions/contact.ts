"use server";

import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactMessage(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const content = formData.get("message") as string;

  if (!name || !email || !content) {
    throw new Error("Missing required fields");
  }

  await dbConnect();

  try {
    // 1. Save to DB
    const newMessage = new Message({ name, email, content });
    await newMessage.save();

    // 2. Send Admin Email
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL || "tony@example.com",
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${content}`,
    });

    // 3. Send Auto-reply to User
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: email,
      subject: "Thank you for contacting me!",
      text: `Hi ${name},\n\nThank you for reaching out! I've received your message and will get back to you as soon as possible.\n\nBest regards,\nDeveloper Portfolio`,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Contact Error:", error);
    return { success: false, error: error.message };
  }
}

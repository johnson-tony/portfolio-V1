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

    // 2. Send Admin Email
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL || "tony@example.com",
      replyTo: email, // This allows the admin to hit 'reply' in their mail app
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${content}\n\n---\nReply directly to this email to contact ${name}.`,
    });

    // 3. Send Auto-reply to User
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: email,
      subject: "Thank you for contacting me!",
      text: `Hi ${name},\n\nThank you for reaching out! I've received your message and will get back to you as soon as possible.\n\nBest regards,\nJohnson Tony`,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Contact Error:", error);
    return { success: false, error: error.message };
  }
}

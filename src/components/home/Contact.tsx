"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { sendContactMessage } from "@/app/actions/contact";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/lib/validations";
import * as z from "zod";

type ContactValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactValues) => {
    setLoading(true);
    
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("message", data.message);
    
    const res = await sendContactMessage(formData);
    
    setLoading(false);
    if (res.success) {
      setSubmitted(true);
      toast.success("Message sent successfully! I'll get back to you soon.");
      reset();
    } else {
      toast.error(res.error || "Failed to send message.");
    }
  };

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-3xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Get in Touch</h2>
          <p className="text-gray-400 text-lg">
            Have a project in mind or just want to say hello? Drop me a message below.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-dark p-8 md:p-12 rounded-[2.5rem] border border-white/5 relative"
        >
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 space-y-6"
            >
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold">Message Received!</h3>
                <p className="text-gray-400">Thank you for reaching out. I've received your message and will respond shortly.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSubmitted(false)}
                className="glass border-white/10 hover:bg-white/10 rounded-2xl h-12 px-8"
              >
                Send Another Message
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-gray-500 ml-1">Name</Label>
                  <Input 
                    id="name" 
                    {...register("name")}
                    placeholder="John Doe" 
                    className={`h-14 glass border-white/10 rounded-2xl focus:ring-primary/50 focus:border-primary/50 transition-all text-lg ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-bold uppercase tracking-widest text-gray-500 ml-1">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    {...register("email")}
                    placeholder="john@example.com" 
                    className={`h-14 glass border-white/10 rounded-2xl focus:ring-primary/50 focus:border-primary/50 transition-all text-lg ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="message" className="text-sm font-bold uppercase tracking-widest text-gray-500 ml-1">Message</Label>
                <Textarea 
                  id="message" 
                  {...register("message")}
                  placeholder="Tell me about your project..." 
                  className={`min-h-[200px] glass border-white/10 rounded-3xl focus:ring-primary/50 focus:border-primary/50 transition-all text-lg p-6 resize-none ${errors.message ? 'border-red-500' : ''}`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1 ml-1">{errors.message.message}</p>}
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl text-xl font-bold orange-glow-strong group transition-all"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Send Message
                    <Send className="ml-3 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

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
    
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("message", data.message);
      formData.append("website", data.website || "");
      
      const result = await sendContactMessage(formData);

      if (result.success) {
        setLoading(false);
        setSubmitted(true);
        toast.success("Message sent successfully!");
        reset();
      } else {
        throw new Error(result.error || "Failed to send message");
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message || "Something went wrong. Please try again later.");
    }
  };

  return (
    <section id="contact" className="pt-20 pb-12 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-xl mx-auto">
        <div className="text-center space-y-3 mb-10 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-gradient">Get in Touch</h2>
          <p className="text-gray-400 text-sm md:text-base">
            Drop me a message and I'll get back to you soon.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-dark p-8 md:p-12 rounded-2xl border border-white/5 relative hover:animate-glow transition-all"
        >
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-6"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto text-primary">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold uppercase tracking-tighter">Message Sent</h3>
                <p className="text-gray-400 text-sm text-balance">Thank you for reaching out. I'll be in touch shortly.</p>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setSubmitted(false)}
                className="text-primary hover:text-primary/80 text-xs font-bold uppercase tracking-widest"
              >
                Send Another
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
                {...register("website")}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Name</Label>
                  <Input 
                    id="name" 
                    {...register("name")}
                    placeholder="Your Name" 
                    className={`bg-transparent border-white/10 hover:border-primary/40 hover:ring-2 hover:ring-primary/15 focus:border-primary/60 placeholder:text-gray-500 ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.name.message}</p>}
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    {...register("email")}
                    placeholder="you@example.com" 
                    className={`bg-transparent border-white/10 hover:border-primary/40 hover:ring-2 hover:ring-primary/15 focus:border-primary/60 placeholder:text-gray-500 ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Message</Label>
                <Textarea 
                  id="message" 
                  {...register("message")}
                  placeholder="How can I help?" 
                  className={`min-h-[100px] bg-transparent border-white/10 hover:border-primary/40 hover:ring-2 hover:ring-primary/15 focus:border-primary/60 resize-none placeholder:text-gray-500 ${errors.message ? 'border-red-500' : ''}`}
                />
                {errors.message && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.message.message}</p>}
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-sm uppercase tracking-widest group transition-all"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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

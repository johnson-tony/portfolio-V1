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
import { cn } from "@/lib/utils";

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
    <section id="contact" className="section-padding px-6 relative overflow-hidden">
      <div className="max-w-xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            Get in Touch
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-sm md:text-base"
          >
            Have a project in mind? Let's discuss how we can work together.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-premium p-6 md:p-10 relative"
        >
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-6"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight">Message Sent</h3>
                <p className="text-muted-foreground text-sm">Thank you for reaching out. I'll get back to you as soon as possible.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSubmitted(false)}
                className="rounded-full px-8"
              >
                Send Another
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
                {...register("website")}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Name</Label>
                  <Input 
                    id="name" 
                    {...register("name")}
                    placeholder="Your Name" 
                    className={cn(
                      "h-11 bg-background/50 backdrop-blur-sm border-border focus:border-primary/50 focus:ring-primary/10 rounded-xl transition-all",
                      errors.name && "border-destructive focus:ring-destructive/20"
                    )}
                  />
                  {errors.name && <p className="text-destructive text-[10px] mt-1 ml-1 font-bold">{errors.name.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    {...register("email")}
                    placeholder="you@example.com" 
                    className={cn(
                      "h-11 bg-background/50 backdrop-blur-sm border-border focus:border-primary/50 focus:ring-primary/10 rounded-xl transition-all",
                      errors.email && "border-destructive focus:ring-destructive/20"
                    )}
                  />
                  {errors.email && <p className="text-destructive text-[10px] mt-1 ml-1 font-bold">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Message</Label>
                <Textarea 
                  id="message" 
                  {...register("message")}
                  placeholder="Tell me about your project..." 
                  className={cn(
                    "min-h-[150px] bg-background/50 backdrop-blur-sm border-border focus:border-primary/50 focus:ring-primary/10 rounded-xl resize-none transition-all",
                    errors.message && "border-destructive focus:ring-destructive/20"
                  )}
                />
                {errors.message && <p className="text-destructive text-[10px] mt-1 ml-1 font-bold">{errors.message.message}</p>}
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-bold shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 group primary-glow"
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

"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema } from "@/lib/validations";
import { z } from "zod";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  type LoginValues = z.infer<typeof adminLoginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid credentials. Please try again.");
      } else {
        toast.success("Login successful!");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#0A0A0B] relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute top-0 left-0 w-full h-full z-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, #F97316 0%, transparent 50%)",
          backgroundSize: "100% 100%",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-4">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 orange-glow">
            <Lock className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-white uppercase">Admin Access</h1>
          <p className="text-gray-400 mt-2 text-sm">Enter your credentials to manage your portfolio.</p>
        </div>

        <div className="glass-dark p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                className="bg-transparent border border-white/10 hover:border-primary/40 hover:ring-2 hover:ring-primary/15 focus:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0 placeholder:text-gray-500"
                aria-invalid={Boolean(errors.username)}
                {...register("username")}
              />
              {errors.username?.message ? (
                <p className="text-red-400 text-xs">{errors.username.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="bg-transparent border border-white/10 hover:border-primary/40 hover:ring-2 hover:ring-primary/15 focus:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0 placeholder:text-gray-500 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password?.message ? (
                <p className="text-red-400 text-xs">{errors.password.message}</p>
              ) : null}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-sm orange-glow uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Access Dashboard"}
            </Button>
          </form>
        </div>
        
        <div className="text-center mt-8">
          <Button variant="link" className="text-gray-500 hover:text-white" onClick={() => router.push("/")}>
            ← Back to Public Site
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

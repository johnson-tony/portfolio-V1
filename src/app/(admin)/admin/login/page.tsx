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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#1F2233] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #8D99AE 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} 
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#2B2D42] border border-[rgba(141,153,174,0.1)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Lock className="text-[#8D99AE] w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#EDF2F4] uppercase">Console Access</h1>
          <p className="text-[#8D99AE] mt-2 text-sm font-medium">Authentication required for administrative operations.</p>
        </div>

        <div className="bg-[#34384F] p-8 sm:p-12 rounded-[24px] border border-[rgba(141,153,174,0.1)] shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Identity Token</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                className="bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 text-[#EDF2F4] h-12 rounded-xl transition-all"
                aria-invalid={Boolean(errors.username)}
                {...register("username")}
              />
              {errors.username?.message ? (
                <p className="text-[#EF233C] text-[10px] font-bold uppercase mt-1 ml-1">{errors.username.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-[#8D99AE] ml-1">Security Key</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="bg-[#2B2D42] border-[rgba(141,153,174,0.1)] focus:border-[#8D99AE]/50 focus:ring-0 text-[#EDF2F4] h-12 rounded-xl transition-all"
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D99AE] hover:text-[#EDF2F4] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password?.message ? (
                <p className="text-[#EF233C] text-[10px] font-bold uppercase mt-1 ml-1">{errors.password.message}</p>
              ) : null}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#8D99AE] hover:bg-[#8D99AE]/90 text-[#1F2233] rounded-xl font-bold uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authenticate"}
            </Button>
          </form>
        </div>
        
        <div className="text-center mt-10">
          <Button variant="link" className="text-[#8D99AE] hover:text-[#EDF2F4] text-xs font-bold uppercase tracking-widest" onClick={() => router.push("/")}>
            ← Exit to Root
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

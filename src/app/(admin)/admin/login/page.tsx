"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        username,
        password,
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0A0A0B] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20" 
           style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #F97316 0%, transparent 50%)", backgroundSize: "100% 100%" }} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 orange-glow">
            <Lock className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Admin Access</h1>
          <p className="text-gray-400 mt-2">Enter your credentials to manage your portfolio.</p>
        </div>

        <div className="glass-dark p-8 rounded-[2rem] border border-white/5 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="username"
                  type="text"
                  required
                  placeholder="admin"
                  className="h-12 pl-12 glass border-white/10 rounded-xl focus:ring-primary/50"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="h-12 pl-12 pr-12 glass border-white/10 rounded-xl focus:ring-primary/50 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-lg orange-glow"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
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

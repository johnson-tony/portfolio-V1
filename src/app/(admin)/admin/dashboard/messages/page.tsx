"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Mail, Trash2, Loader2, CheckCircle, Clock, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getMessages, markAsRead, deleteMessage } from "@/app/actions/messages";
import { cn } from "@/lib/utils";

type Message = {
  _id: string;
  name: string;
  email: string;
  content: string;
  isRead: boolean;
  createdAt: string | Date;
};

export default function MessagesManagement() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    const data = await getMessages();
    setMessages(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  const handleMarkRead = async (id: string) => {
    const res = await markAsRead(id);
    if (res.success) {
      toast.success("Marked as read");
      loadMessages();
    }
  };

  const handleReply = (email: string, name: string) => {
    const subject = `Re: Your message to Johnson Tony`;
    const body = `Hi ${name},\n\nThank you for reaching out!`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    const res = await deleteMessage(id);
    if (res.success) {
      toast.success("Message deleted");
      loadMessages();
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Inbound Messages</h1>
        <p className="text-muted-foreground mt-1">Review and manage communications from your portfolio visitors.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {messages.map((msg) => (
          <div 
            key={msg._id} 
            className={cn(
              "card-premium p-6 flex flex-col md:flex-row justify-between gap-6 transition-all",
              !msg.isRead && "border-primary/30 ring-1 ring-primary/10 bg-primary/5"
            )}
          >
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm",
                  msg.isRead ? "bg-muted text-muted-foreground" : "bg-primary text-white primary-glow"
                )}>
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-lg text-foreground truncate">{msg.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{msg.email}</p>
                </div>
                {!msg.isRead && (
                  <span className="px-2.5 py-0.5 rounded-full bg-primary text-[10px] font-bold uppercase text-white shadow-lg animate-pulse">New</span>
                )}
              </div>
              
              <div className="bg-background/50 p-5 rounded-xl border border-border/50 text-foreground leading-relaxed text-sm md:text-base relative group">
                <span className="text-primary/40 text-4xl absolute -top-2 -left-1 opacity-0 group-hover:opacity-100 transition-opacity select-none">"</span>
                {msg.content}
              </div>
              
              <div className="flex items-center gap-4 text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(msg.createdAt).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex md:flex-col gap-2 justify-end md:justify-start min-w-[140px]">
              {!msg.isRead && (
                <Button 
                  size="sm" 
                  onClick={() => handleMarkRead(msg._id)}
                  className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4" /> Mark Read
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleReply(msg.email, msg.name)}
                className="font-bold gap-2 rounded-lg border-border hover:bg-muted"
              >
                <Reply className="w-4 h-4" /> Reply
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleDelete(msg._id)}
                className="text-destructive hover:bg-destructive/10 font-bold gap-2 rounded-lg"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
            </div>
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="py-24 text-center card-premium bg-muted/20 border-dashed space-y-3">
             <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                <Mail className="w-8 h-8 opacity-20" />
             </div>
             <p className="text-muted-foreground font-medium italic">Your inbox is currently empty</p>
          </div>
        )}
      </div>
    </div>
  );
}

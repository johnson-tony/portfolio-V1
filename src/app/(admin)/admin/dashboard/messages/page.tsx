"use client";

import React, { useState, useEffect } from "react";
import { Mail, Trash2, Loader2, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getMessages, markAsRead, deleteMessage } from "@/app/actions/messages";

export default function MessagesManagement() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    const data = await getMessages();
    setMessages(data);
    setLoading(false);
  };

  const handleMarkRead = async (id: string) => {
    const res = await markAsRead(id);
    if (res.success) {
      toast.success("Marked as read");
      loadMessages();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
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
        <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
        <p className="text-gray-500 mt-1">View and manage messages from your contact form.</p>
      </div>

      <div className="space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg._id} 
            className={`glass-dark p-6 rounded-3xl border transition-all ${
              msg.isRead ? "border-white/5 opacity-60" : "border-primary/30 orange-glow"
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.isRead ? "bg-white/5 text-gray-500" : "bg-primary/20 text-primary"}`}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{msg.name}</h3>
                    <p className="text-sm text-gray-400">{msg.email}</p>
                  </div>
                  {!msg.isRead && (
                    <span className="px-2 py-0.5 rounded-full bg-primary text-[10px] font-bold uppercase text-white">New</span>
                  )}
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-gray-300 leading-relaxed italic">
                  "{msg.content}"
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(msg.createdAt).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex md:flex-col gap-2 justify-end">
                {!msg.isRead && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleMarkRead(msg._id)}
                    className="glass border-white/10 hover:bg-white/10 text-xs font-bold gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Mark Read
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => handleDelete(msg._id)}
                  className="text-xs font-bold gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="py-20 text-center glass-dark rounded-3xl border border-white/5 text-gray-500">
            Your inbox is empty.
          </div>
        )}
      </div>
    </div>
  );
}

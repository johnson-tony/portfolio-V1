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
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#EDF2F4]">Communications</h1>
          <p className="text-[#8D99AE] text-sm mt-1">Audit and respond to inbound inquiries from portfolio engagement.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#34384F] border border-[rgba(141,153,174,0.1)] text-[#8D99AE] text-[10px] font-bold uppercase tracking-widest">
           {messages.filter(m => !m.isRead).length} Unread Sequences
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {messages.map((msg) => (
          <div 
            key={msg._id} 
            className={cn(
              "card-premium p-8 flex flex-col md:flex-row justify-between gap-8 transition-all group",
              !msg.isRead && "border-[#8D99AE]/30 bg-[#34384F]/80"
            )}
          >
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center border border-[rgba(141,153,174,0.1)]",
                  msg.isRead ? "bg-[#2B2D42] text-[#8D99AE]" : "bg-[#8D99AE] text-[#1F2233]"
                )}>
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-lg text-[#EDF2F4] truncate">{msg.name}</h3>
                  <p className="text-[13px] font-bold text-[#8D99AE] truncate uppercase tracking-tight">{msg.email}</p>
                </div>
                {!msg.isRead && (
                  <span className="px-2 py-0.5 rounded-md bg-[#EF233C]/10 text-[#EF233C] border border-[#EF233C]/20 text-[10px] font-bold uppercase tracking-widest ml-2">Priority</span>
                )}
              </div>
              
              <div className="bg-[#2B2D42] p-6 rounded-2xl border border-[rgba(141,153,174,0.05)] text-[#EDF2F4] leading-relaxed text-sm md:text-base">
                {msg.content}
              </div>
              
              <div className="flex items-center gap-6 text-[10px] text-[#8D99AE] font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2 px-3 py-1 bg-[#2B2D42] rounded-md border border-[rgba(141,153,174,0.05)]">
                  <Clock className="w-3.5 h-3.5" /> 
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
                <span className="text-[rgba(141,153,174,0.3)]">ID: {msg._id.slice(-8)}</span>
              </div>
            </div>
            
            <div className="flex md:flex-col gap-3 justify-end md:justify-start min-w-[160px]">
              {!msg.isRead && (
                <Button 
                  size="sm" 
                  onClick={() => handleMarkRead(msg._id)}
                  className="bg-[#8D99AE] hover:bg-[#8D99AE]/90 text-[#1F2233] font-bold gap-2 rounded-xl shadow-lg h-10 px-4 active:scale-95 transition-all"
                >
                  <CheckCircle className="w-4 h-4" /> Resolve
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleReply(msg.email, msg.name)}
                className="font-bold gap-2 rounded-xl border-[rgba(141,153,174,0.1)] text-[#8D99AE] hover:bg-[#2B2D42] hover:text-[#EDF2F4] h-10 px-4 active:scale-95 transition-all"
              >
                <Reply className="w-4 h-4" /> Reply
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleDelete(msg._id)}
                className="text-[#EF233C] hover:bg-[#EF233C]/10 font-bold gap-2 rounded-xl h-10 px-4 active:scale-95 transition-all"
              >
                <Trash2 className="w-4 h-4" /> Terminate
              </Button>
            </div>
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="py-32 text-center card-premium bg-[#2B2D42]/20 border-dashed border-[rgba(141,153,174,0.1)] space-y-4">
             <div className="w-20 h-20 bg-[#2B2D42] rounded-3xl flex items-center justify-center mx-auto text-[#8D99AE]/20 border border-[rgba(141,153,174,0.05)]">
                <Mail className="w-10 h-10" />
             </div>
             <p className="text-[#8D99AE] font-bold uppercase tracking-widest text-xs">Communication Queue Empty</p>
          </div>
        )}
      </div>
    </div>
  );
}

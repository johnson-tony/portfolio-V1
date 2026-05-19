import mongoose, { Schema, model, models } from "mongoose";

const MessageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

const Message = models.Message || model("Message", MessageSchema);
export default Message;

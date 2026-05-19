import mongoose, { Schema, model, models } from "mongoose";

const MaterialSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  fileUrl: { type: String, required: true },
  thumbnailUrl: String,
}, { timestamps: true });

const Material = models.Material || model("Material", MaterialSchema);
export default Material;

import mongoose, { Schema, model, models } from "mongoose";

const ExperienceSchema = new Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  period: { type: String, required: true },
  location: String,
  description: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const Experience = models.Experience || model("Experience", ExperienceSchema);
export default Experience;

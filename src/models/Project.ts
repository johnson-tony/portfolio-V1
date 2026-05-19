import mongoose, { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  detailedDescription: String,
  techStack: [String],
  imageUrl: { type: String, required: true },
  screenshots: [String],
  githubUrl: String,
  liveDemoUrl: String,
  order: { type: Number, default: 0 },
}, { timestamps: true });

const Project = models.Project || model("Project", ProjectSchema);
export default Project;

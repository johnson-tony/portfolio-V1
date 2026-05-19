import mongoose, { Schema, model, models } from "mongoose";

const SettingsSchema = new Schema({
  siteTitle: { type: String, default: "Portfolio" },
  logoUrl: String,
  accentColor: { type: String, default: "#F97316" },
  heroHeading: { type: String, default: "Building Modern Digital Experiences" },
  heroSubheading: { type: String, default: "Full-stack developer focused on premium SaaS design and performance." },
}, { timestamps: true });

const Settings = models.Settings || model("Settings", SettingsSchema);
export default Settings;

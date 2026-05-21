import mongoose, { Schema, model, models } from "mongoose";

const ProfileSchema = new Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  about: { type: String, required: true },
  education: [{ 
    institution: String, 
    degree: String, 
    year: String 
  }],
  skills: [String],
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    email: String,
  },
}, { timestamps: true });

const Profile = models.Profile || model("Profile", ProfileSchema);
export default Profile;

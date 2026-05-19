import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    console.log("Seeding process started...");
    const conn = await dbConnect();
    const dbName = conn.connection.db?.databaseName;
    console.log("DB Connected for seeding:", dbName);

    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    // Check if user already exists
    const existingUser = await User.findOne({ username: "admin" });
    console.log("Existing admin check in", dbName, ":", existingUser ? "Found" : "Not Found");

    if (existingUser) {
      existingUser.password = hashedPassword;
      await existingUser.save();
      console.log("Admin password reset successfully.");
      return NextResponse.json({ message: "Admin password reset successfully. Use admin / admin123 to login." });
    }

    const admin = new User({
      username: "admin",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("Admin user created successfully.");
    return NextResponse.json({ message: "Admin user created successfully. Use admin / admin123 to login." });
  } catch (error: any) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

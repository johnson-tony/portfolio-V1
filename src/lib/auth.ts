import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Login Attempt:", credentials?.username);
        
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing username or password");
        }

        const conn = await dbConnect();
        const dbName = conn.connection.db?.databaseName;
        console.log("Connected to DB:", dbName);

        const user = await User.findOne({ username: credentials.username });
        console.log("User Lookup in", dbName, ":", user ? "Found" : "Not Found");

        if (!user || !user.password) {
          throw new Error("No user found with that username");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );
        console.log("Password Correct:", isPasswordCorrect ? "Yes" : "No");

        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.username,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

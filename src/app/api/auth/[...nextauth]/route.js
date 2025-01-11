// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          return null;
        }
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signUp: "/signup",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.sub = user.id; // Add this line - NextAuth sometimes uses 'sub' for ID
      }
      console.log("JWT Callback - Token after:", token); // Add this log
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.id || token.sub; // Modify this line to check both

      return session;
    },
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
        });
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: profile.email,
              name: profile.name,
              role: "USER",
            },
          });
        }
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

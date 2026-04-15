import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { users } from "@/lib/data/demo-data";
import { roleLabels } from "@/lib/auth/permissions";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4)
});

const demoPassword = process.env.DEMO_PASSWORD ?? "demo1234";
const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

function parseBoolean(value: string | undefined) {
  if (value === "true") return true;
  if (value === "false") return false;

  return undefined;
}

const trustHost = parseBoolean(process.env.AUTH_TRUST_HOST) ?? Boolean(process.env.VERCEL_URL);

export const authConfig: NextAuthConfig = {
  secret: authSecret,
  trustHost,
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt" as const
  },
  providers: [
    Credentials({
      name: "Demo credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) return null;

        const user = users.find((item) => item.email === parsed.data.email);

        if (!user) return null;
        if (parsed.data.password !== demoPassword) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          title: user.title,
          roleLabel: roleLabels[user.role]
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.title = user.title;
        token.roleLabel = user.roleLabel;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = typeof token.role === "string" ? token.role : undefined;
        session.user.title = typeof token.title === "string" ? token.title : undefined;
        session.user.roleLabel =
          typeof token.roleLabel === "string" ? token.roleLabel : undefined;
      }

      return session;
    }
  }
};

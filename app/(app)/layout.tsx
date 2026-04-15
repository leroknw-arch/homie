import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppShell } from "@/components/layout/app-shell";

export default async function ProductLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <AppShell
      user={{
        name: session.user.name ?? "Demo User",
        email: session.user.email ?? "",
        role: session.user.role ?? "HEAD_OF_MARKETING",
        title: session.user.title ?? "Head of Marketing"
      }}
    >
      {children}
    </AppShell>
  );
}

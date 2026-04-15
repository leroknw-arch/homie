 "use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button
      className="w-full"
      onClick={() => signOut({ callbackUrl: "/login" })}
      type="button"
      variant="outline"
    >
      <LogOut className="mr-2 size-4" />
      Cerrar sesión
    </Button>
  );
}

"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";

import { authenticate } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState = undefined;

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <Input id="email" name="email" type="email" defaultValue="ariana@homie.app" required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>
        <Input id="password" name="password" type="password" defaultValue="demo1234" required />
      </div>

      {errorMessage ? <p className="text-sm text-rose-700">{errorMessage}</p> : null}

      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? "Entrando..." : "Continuar al workspace"}
        <ArrowRight className="ml-2 size-4" />
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        El rol demo depende del email que uses
      </p>
    </form>
  );
}

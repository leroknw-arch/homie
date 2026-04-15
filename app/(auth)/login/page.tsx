import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen bg-hero-grid px-4 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
      <section className="flex items-center px-4 py-10 sm:px-8">
        <div className="max-w-xl space-y-8">
          <div className="inline-flex rounded-full bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.18em] text-surface-800 shadow-soft">
            HOMIE Marketing Execution Platform
          </div>
          <div className="space-y-4">
            <h1 className="text-balance font-display text-5xl font-semibold tracking-tight text-surface-900 sm:text-6xl">
              Ejecuta marketing con una lectura ejecutiva, simple y brutalmente clara.
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              HOMIE une plan, presupuesto, ROI, avance y carga operativa en una sola capa de decisión.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              "Budget visibility",
              "Campaign ROI",
              "Operational drill-down"
            ].map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-white/70 bg-white/75 p-4 shadow-soft">
                <div className="text-sm font-medium text-surface-900">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm text-surface-700">
              <ShieldCheck className="size-4" />
              Acceso protegido
            </div>
            <CardTitle>Inicia sesión en HOMIE</CardTitle>
            <CardDescription>Usa las credenciales demo para entrar al workspace protegido.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

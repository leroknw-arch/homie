"use client";

export function DemoFormMessage({
  tone,
  children
}: {
  tone: "default" | "error";
  children: React.ReactNode;
}) {
  return (
    <div
      aria-live="polite"
      role={tone === "error" ? "alert" : "status"}
      className={
        tone === "error"
          ? "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          : "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
      }
    >
      {children}
    </div>
  );
}

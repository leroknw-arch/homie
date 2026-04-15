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
          ? "rounded-[1.2rem] border border-rose-200 bg-[linear-gradient(180deg,#fff1f1_0%,#fff8f0_100%)] px-4 py-3 text-sm text-rose-700"
          : "rounded-[1.2rem] border border-emerald-200 bg-[linear-gradient(180deg,#eef9f1_0%,#f8fbf7_100%)] px-4 py-3 text-sm text-emerald-700"
      }
    >
      {children}
    </div>
  );
}

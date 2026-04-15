"use client";

import { useState } from "react";

import { DemoFormMessage } from "@/components/forms/demo-form-message";
import { FormField, FormSelect } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { performancePlatformLabels } from "@/lib/presentation";
import { PerformancePlatform } from "@/types/domain";

const platforms: PerformancePlatform[] = ["META", "GOOGLE", "TIKTOK"];

export function PerformanceInputForm({
  campaignName,
  defaultDate
}: {
  campaignName: string;
  defaultDate: string;
}) {
  const [message, setMessage] = useState<{ tone: "default" | "error"; text: string } | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      setMessage({ tone: "error", text: "Complete spend, revenue, purchases, platform and date to validate this performance entry." });
      return;
    }

    setMessage({
      tone: "default",
      text: `Performance entry for ${campaignName} validated successfully. Connect this form to persistence or CSV import in Phase 6.`
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual performance input</CardTitle>
        <CardDescription>Carga gasto, revenue y purchases manualmente mientras todavía no conectamos APIs.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 lg:grid-cols-2">
            <FormField htmlFor="performance-date" hint="Use the marketing reporting day for this entry." label="Date" required>
              <Input defaultValue={defaultDate} id="performance-date" required type="date" />
            </FormField>
            <FormField htmlFor="performance-platform" hint="Choose the paid platform that generated this result." label="Platform" required>
              <FormSelect defaultValue="" id="performance-platform" required>
                <option disabled value="">
                  Select platform
                </option>
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {performancePlatformLabels[platform]}
                  </option>
                ))}
              </FormSelect>
            </FormField>
            <FormField htmlFor="performance-spend" hint="Paid media investment for the selected platform and day." label="Spend" required>
              <Input id="performance-spend" min="0" placeholder="12000" required type="number" />
            </FormField>
            <FormField htmlFor="performance-revenue" hint="Attributed revenue for the same period." label="Revenue" required>
              <Input id="performance-revenue" min="0" placeholder="24000" required type="number" />
            </FormField>
            <FormField htmlFor="performance-purchases" hint="Use completed purchases or the closest conversion count available." label="Purchases" required>
              <Input id="performance-purchases" min="1" placeholder="42" required type="number" />
            </FormField>
            <FormField htmlFor="performance-campaign" hint="This input is scoped to the campaign currently open." label="Campaign">
              <Input disabled id="performance-campaign" value={campaignName} />
            </FormField>
          </div>
          {message ? <DemoFormMessage tone={message.tone}>{message.text}</DemoFormMessage> : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">Manual input only for now. CSV upload or API sync can come later without changing this model.</p>
            <Button type="submit">Validate performance entry</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DemoFormMessage } from "@/components/forms/demo-form-message";
import { FormField, FormSelect } from "@/components/forms/form-field";
import { formOptions } from "@/lib/data/form-options";

export function CampaignForm() {
  const [message, setMessage] = useState<{ tone: "default" | "error"; text: string } | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      setMessage({ tone: "error", text: "Complete the required fields to save this campaign draft." });
      return;
    }

    setMessage({
      tone: "default",
      text: "Campaign draft validated successfully. This demo form is ready to connect to a real create action."
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create campaign</CardTitle>
        <CardDescription>Define business context first, then execution boundaries and budget.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 lg:grid-cols-2">
            <FormField hint="Use a short campaign name that reads well in dashboards and tables." htmlFor="campaign-name" label="Campaign name" required>
              <Input id="campaign-name" placeholder="Aurora Pulse Launch" required />
            </FormField>
            <FormField hint="One clear business goal helps the rest of the execution model stay aligned." htmlFor="campaign-objective" label="Objective" required>
              <Input id="campaign-objective" placeholder="Drive awareness and pipeline" required />
            </FormField>
            <FormField hint="Top-level company context for executive reporting." htmlFor="campaign-company" label="Company" required>
              <FormSelect defaultValue="" id="campaign-company" required>
                <option value="" disabled>
                  Select company
                </option>
                {formOptions.companies.map((company) => (
                  <option key={company.value} value={company.value}>
                    {company.label}
                  </option>
                ))}
              </FormSelect>
            </FormField>
            <FormField hint="Optional if this is a corporate initiative rather than a product campaign." htmlFor="campaign-product" label="Product">
              <FormSelect defaultValue="" id="campaign-product">
                <option value="">Corporate initiative</option>
                {formOptions.products.map((product) => (
                  <option key={product.value} value={product.value}>
                    {product.label}
                  </option>
                ))}
              </FormSelect>
            </FormField>
            <FormField hint="Owner is accountable for the campaign outcome." htmlFor="campaign-owner" label="Owner" required>
              <FormSelect defaultValue="" id="campaign-owner" required>
                <option value="" disabled>
                  Select owner
                </option>
                {formOptions.owners.map((owner) => (
                  <option key={owner.value} value={owner.value}>
                    {owner.label}
                  </option>
                ))}
              </FormSelect>
            </FormField>
            <FormField hint="Use the full planned budget for this initiative." htmlFor="campaign-budget" label="Budget" required>
              <Input id="campaign-budget" min="0" placeholder="185000" required type="number" />
            </FormField>
            <FormField className="lg:col-span-2" hint="Keep this short enough to scan quickly in the campaign detail view." htmlFor="campaign-description" label="Description" required>
              <Textarea id="campaign-description" placeholder="Integrated launch to build awareness and create demand." required />
            </FormField>
            <FormField hint="Execution begins here." htmlFor="campaign-start-date" label="Start date" required>
              <Input id="campaign-start-date" required type="date" />
            </FormField>
            <FormField hint="Used by timeline, risk logic and Gantt." htmlFor="campaign-end-date" label="End date" required>
              <Input id="campaign-end-date" required type="date" />
            </FormField>
          </div>
          {message ? <DemoFormMessage tone={message.tone}>{message.text}</DemoFormMessage> : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Demo create form only. Validation is active; persistence is still pending.
            </p>
            <Button type="submit">Validate campaign</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

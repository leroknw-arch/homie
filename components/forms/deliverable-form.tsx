"use client";

import { useState } from "react";

import { DemoFormMessage } from "@/components/forms/demo-form-message";
import { FormField, FormSelect } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formOptions } from "@/lib/data/form-options";

export function DeliverableForm() {
  const [message, setMessage] = useState<{ tone: "default" | "error"; text: string } | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      setMessage({ tone: "error", text: "Complete the required deliverable fields before continuing." });
      return;
    }

    setMessage({
      tone: "default",
      text: "Deliverable draft validated successfully. This demo form is ready to connect to a create action."
    });
  }

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Create deliverable</CardTitle>
        <CardDescription>Define ownership, timing and effort so the deliverable is easy to track.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 lg:grid-cols-2">
            <FormField hint="Use a title that is clear enough for timeline, workload and review views." htmlFor="deliverable-title" label="Title" required>
              <Input id="deliverable-title" placeholder="Launch Landing Page" required />
            </FormField>
            <FormField hint="The type helps group deliverables in executive reporting." htmlFor="deliverable-type" label="Type" required>
              <FormSelect defaultValue="" id="deliverable-type" required>
                <option value="" disabled>
                  Select type
                </option>
                {formOptions.deliverableTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </FormSelect>
            </FormField>
            <FormField hint="Owner is the person driving this piece to done." htmlFor="deliverable-owner" label="Owner" required>
              <FormSelect defaultValue="" id="deliverable-owner" required>
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
            <FormField hint="The responsible team should match the Unit of Work owner." htmlFor="deliverable-team" label="Team" required>
              <FormSelect defaultValue="" id="deliverable-team" required>
                <option value="" disabled>
                  Select team
                </option>
                {formOptions.teams.map((team) => (
                  <option key={team.value} value={team.value}>
                    {team.label}
                  </option>
                ))}
              </FormSelect>
            </FormField>
            <FormField hint="Used in dashboards and upcoming deadlines." htmlFor="deliverable-due-date" label="Due date" required>
              <Input id="deliverable-due-date" required type="date" />
            </FormField>
            <FormField hint="Optional when the deliverable has already shipped." htmlFor="deliverable-final-url" label="Final URL">
              <Input id="deliverable-final-url" placeholder="https://example.com/asset" type="url" />
            </FormField>
            <FormField hint="Planned effort supports capacity and pacing views." htmlFor="deliverable-estimated-hours" label="Estimated hours" required>
              <Input id="deliverable-estimated-hours" min="0" placeholder="24" required type="number" />
            </FormField>
            <FormField hint="Use actual hours only if the work has already started." htmlFor="deliverable-actual-hours" label="Actual hours">
              <Input id="deliverable-actual-hours" min="0" placeholder="18" type="number" />
            </FormField>
          </div>
          {message ? <DemoFormMessage tone={message.tone}>{message.text}</DemoFormMessage> : null}
          <div className="rounded-[1.35rem] border border-white/70 bg-white/70 p-4">
            <div className="mb-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">Deliverable draft</div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">This demo create form validates required fields and keeps terminology aligned with the product model.</p>
            <Button type="submit">Validate deliverable</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

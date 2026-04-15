"use client";

import { useState } from "react";

import { DemoFormMessage } from "@/components/forms/demo-form-message";
import { FormField, FormSelect } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formOptions } from "@/lib/data/form-options";

export function TaskForm() {
  const [message, setMessage] = useState<{ tone: "default" | "error"; text: string } | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      setMessage({ tone: "error", text: "Fill in the required task fields to validate the task draft." });
      return;
    }

    setMessage({
      tone: "default",
      text: "Task draft validated successfully. The form is ready to connect with a real create action."
    });
  }

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Create task</CardTitle>
        <CardDescription>Keep task capture simple: responsible person, dates, effort and dependency.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 lg:grid-cols-2">
            <FormField hint="Use action-oriented language." htmlFor="task-title" label="Title" required>
              <Input id="task-title" placeholder="Review Launch Landing Page" required />
            </FormField>
            <FormField hint="Tasks should always have a clear assignee for workload visibility." htmlFor="task-assignee" label="Assignee" required>
              <FormSelect defaultValue="" id="task-assignee" required>
                <option value="" disabled>
                  Select assignee
                </option>
                {formOptions.assignees.map((assignee) => (
                  <option key={assignee.value} value={assignee.value}>
                    {assignee.label}
                  </option>
                ))}
              </FormSelect>
            </FormField>
            <FormField hint="Used by team workload and filters." htmlFor="task-team" label="Team" required>
              <FormSelect defaultValue="" id="task-team" required>
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
            <FormField hint="Optional if the task starts independently." htmlFor="task-dependency" label="Dependency task ID">
              <Input id="task-dependency" placeholder="task_123" />
            </FormField>
            <FormField hint="When execution begins." htmlFor="task-start-date" label="Start date" required>
              <Input id="task-start-date" required type="date" />
            </FormField>
            <FormField hint="Used in risk logic and gantt." htmlFor="task-due-date" label="Due date" required>
              <Input id="task-due-date" required type="date" />
            </FormField>
            <FormField hint="Planned capacity required for this task." htmlFor="task-estimated-hours" label="Estimated hours" required>
              <Input id="task-estimated-hours" min="0" placeholder="8" required type="number" />
            </FormField>
            <FormField hint="Optional when the task has not started yet." htmlFor="task-actual-hours" label="Actual hours">
              <Input id="task-actual-hours" min="0" placeholder="5" type="number" />
            </FormField>
            <FormField className="lg:col-span-2" hint="Keep it concise enough to scan from the detail view." htmlFor="task-description" label="Description" required>
              <Textarea id="task-description" placeholder="Run QA, collect feedback and close approval loop." required />
            </FormField>
          </div>
          {message ? <DemoFormMessage tone={message.tone}>{message.text}</DemoFormMessage> : null}
          <div className="rounded-[1.35rem] border border-white/70 bg-white/70 p-4">
            <div className="mb-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">Task draft</div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">This demo create form keeps dependencies, hours and dates aligned with the execution model.</p>
            <Button type="submit">Validate task</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

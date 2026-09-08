"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { currentUser } from "@/lib/mock-data";

export default function SettingsPage() {
  const [status, setStatus] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    const message =
      "Settings kept in memory only. Persist them when the database exists.";
    setStatus(message);
    toast.success(message);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as {currentUser.email} in this mock session.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>These fields preview the account surface.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={onSubmit}
            action="#"
            method="post"
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="workspace">Workspace name</Label>
              <Input id="workspace" name="workspace" defaultValue="Northline Product" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" name="timezone" defaultValue="America/Los_Angeles" />
            </div>
            {status ? (
              <p className="text-sm text-muted-foreground" role="status">
                {status}
              </p>
            ) : null}
            <Button type="submit">Save changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

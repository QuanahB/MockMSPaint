"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthMode = "sign-in" | "sign-up";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const isSignUp = mode === "sign-up";

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    if (!email || !password || (isSignUp && password.length < 8)) {
      const error = isSignUp
        ? "Use a valid email and a password with at least 8 characters."
        : "Enter your email and password.";
      setStatus(error);
      toast.error(error);
      return;
    }

    setPending(true);
    setStatus(null);
    window.setTimeout(() => {
      const message =
        "No account service yet. Point this form at your auth API when you add a backend.";
      setPending(false);
      setStatus(message);
      toast.message("No account service yet", {
        description: "This form is UI-only. Point it at your auth API when you add a backend.",
      });
    }, 400);
  }

  return (
    <form
      onSubmit={onSubmit}
      action="#"
      method="post"
      className="space-y-4"
      noValidate
    >
      {isSignUp ? (
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" placeholder="Alex Rivera" autoComplete="name" />
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder={isSignUp ? "At least 8 characters" : "Your password"}
          autoComplete={isSignUp ? "new-password" : "current-password"}
        />
      </div>
      {status ? (
        <p className="text-sm text-muted-foreground" role="status">
          {status}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending
          ? "Working…"
          : isSignUp
            ? "Create account"
            : "Sign in"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <Link href="/sign-in" className="text-foreground underline-offset-4 hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/sign-up" className="text-foreground underline-offset-4 hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

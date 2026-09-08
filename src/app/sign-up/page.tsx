import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { site } from "@/lib/site";

export default function SignUpPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
            N
          </span>
          {site.name}
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Create your workspace</CardTitle>
            <CardDescription>
              No users are created. After you add a backend, this form can POST to sign-up.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm mode="sign-up" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

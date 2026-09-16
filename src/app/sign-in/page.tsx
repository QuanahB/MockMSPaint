import { AuthForm } from "@/components/auth-form";
import { PaintIcon } from "@/components/paint-icon";
import { WindowControls } from "@/components/window-controls";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { site } from "@/lib/site";

export default function SignInPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-desktop p-4">
      <div className="win-window w-full max-w-md">
        <div className="win-titlebar">
          <PaintIcon />
          <span className="flex-1">Sign in - {site.name}</span>
          <WindowControls />
        </div>
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>
                Accounts are not stored yet. Use this screen to shape your auth flow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthForm mode="sign-in" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

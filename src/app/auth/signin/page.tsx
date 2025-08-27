import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { SignIn } from "~/components/auth/sign-in-form";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;

  if (session) {
    redirect(callbackUrl || "/");
  }

  return <SignIn callbackUrl={callbackUrl} />;
}

import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { SignIn } from "~/components/auth/sign-in-form";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const session = await auth();

  if (session) {
    redirect(searchParams.callbackUrl || "/");
  }

  return <SignIn callbackUrl={searchParams.callbackUrl} />;
}

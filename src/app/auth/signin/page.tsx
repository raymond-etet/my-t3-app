import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { SignIn } from "~/components/auth/sign-in-form";

export default async function SignInPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return <SignIn />;
}

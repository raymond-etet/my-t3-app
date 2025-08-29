import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { SignUp } from "~/components/auth/sign-up-form";

export const runtime = "edge";

export default async function SignUpPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return <SignUp />;
}

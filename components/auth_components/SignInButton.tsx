import Link from "next/link";
import { Button } from "../ui/button";

const SignInButton = ({ signInUrl = "/sign-in" }: { signInUrl?: string }) => {
  return (
    <Button asChild>
      <Link href={signInUrl}>Sign in</Link>
    </Button>
  );
};

export default SignInButton;
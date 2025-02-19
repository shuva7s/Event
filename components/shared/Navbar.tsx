import { headers } from "next/headers";
import { ModeToggle } from "../theme/ModeToggle";
import { auth } from "@/lib/auth";
import Dp from "./cards/Dp";
import Link from "next/link";

const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  return (
    <header className="wrapper">
      <nav className="w-full py-5 flex justify-between items-center">
        <p className="h_md">Evently</p>
        <div className="flex flex-row flex-wrap gap-3 items-center">
          <ModeToggle />
          {session && (
            <>
              <div className="h-4 w-0.5 rounded-full bg-accent" />
              <Link href="/profile">
                <Dp src={session.user.image} name={session.user.name} />
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

const Footer = () => {
  return (
    <footer className="wrapper bg-accent dark:bg-accent/50 pt-4 pb-10 rounded-t-2xl">
      <Link
        className="flex items-center gap-2 pt-4 pb-2 flex-wrap"
        target="_blank"
        href="https://github.com/shuva7s/Event"
      >
        <p className="p_lg font-semibold">Evently</p>
        <Image
          src="/github.svg"
          className="dark:invert"
          alt="github"
          width={20}
          height={20}
          priority={true}
        />
      </Link>
      <div className="text-muted-foreground">
        <p>Evently is a free open source event hosting platform.</p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <p>
            Developed by:{" "}
            <span className="text-foreground">Shuvadeep Mandal</span>
          </p>
          <Button variant={"outline"} size={"sm"} asChild>
            <Link href="https://github.com/shuva7s" target="_blank">
              <Image
                src="/github.svg"
                className="dark:invert"
                alt="github"
                width={20}
                height={20}
                priority={true}
              />{" "}
              shuva7s
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

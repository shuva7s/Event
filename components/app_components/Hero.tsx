import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <section className="w-full fl_center gap-10 flex-col md:flex-row text-center md:text-left py-10">
      <p className="h_xl font-bold max-w-[400px] md:max-w-full text-muted-foreground">
        <span className="text-primary">Create</span>,{" "}
        <span className="text-primary">manage</span>,{" "}
        <span className="text-primary">join</span> <br />
        <span className="text-foreground">events with ease</span>
      </p>
      <div className="relative">
        <Image
          src="/banner.png"
          alt="hero"
          width={300}
          height={300}
          draggable={false}
          className="rounded-2xl dark:opacity-90 select-none"
        />
        <div className="absolute w-full h-full top-0 left-0 z-[-1] dark:bg-primary/40 blur-3xl"/>
      </div>
    </section>
  );
};

export default Hero;

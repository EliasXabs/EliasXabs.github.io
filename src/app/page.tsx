import React from "react";
import { SparklesCore } from "../components/ui/sparkles";
import { FloatingNav } from "../components/ui/floating-navbar";
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";

export default function Home() {
  const navItems = [
    {
      name: "Home",
      link: "#Home", // Matches the section id="Home"
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "#About", // Matches the section id="About"
      icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "#Contact", // Make sure this matches the id="Contact"
      icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];

  return (
    <div>
      <FloatingNav navItems={navItems} />
      {/* Home Section */}
      <section id="Home" className="h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center justify-center overflow-hidden rounded-md">
          <h1 className="h1-shadow md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
            EliasXabs
          </h1>
          <div className="w-[60vw] h-40 relative">
            {/* Gradient Lines */}
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />

            <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="About" className="min-h-screen bg-gray-100">
        <div className=" w-full p-0 m-4 mr-4 flex items-center justify-center">
        <h2 className="text-gray-800 text-4xl pt-2">About Me</h2>
        </div>
        <div className="flex m-2">
          <span className="w-[50vw]"> Test this the right part</span>
          <p className="w-[50vw]">Hi, I'm Elias Abou Samra, a senior computer science student at the Lebanese American University (LAU)
            focusing my studies on full-stack developpment; specializing in building scalable web applications using modern technologies like React, Node.js, and MySQL.
            Continuously learning new things in the ever-evolving tech landscape.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="Contact" className="min-h-screen bg-gray-200 flex items-center justify-center">
        <h2 className="text-gray-800 text-4xl">Contact Me</h2>
      </section>
    </div>
  );
}

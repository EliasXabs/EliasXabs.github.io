"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollY } = useScroll();

  // Map scrollY to opacity and y position
  const y = useTransform(scrollY, [0, 100], [-100, 0]); // At 0px scroll, y is -100 (hidden), at 100px scroll, y is 0 (fully visible)
  const opacity = useTransform(scrollY, [0, 100], [0, 1]); // At 0px scroll, opacity is 0, at 100px scroll, opacity is 1 (fully visible)

  return (
    <motion.div
      style={{ y, opacity }} // Apply the scroll-based values directly
      className={cn(
        "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-8 pl-8 py-2  items-center justify-center space-x-4",
        className
      )}
    >
      {navItems.map((navItem: any, idx: number) => (
        <a
          key={`link=${idx}`}
          href={navItem.link}
          className={cn(
            "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
          )}
        >
          <span className="hidden sm:block text-sm">{navItem.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

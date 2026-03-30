import React from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
          {siteConfig.heroHeading} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">{siteConfig.abbreviation}</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 font-medium">
          {siteConfig.description}
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild className="rounded-full h-12 px-8 text-md font-semibold bg-gray-900 dark:bg-white dark:text-gray-900 shadow-xl hover:scale-105 transition-all">
            <Link to="/Signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full h-12 px-8 text-md font-semibold bg-white/50 dark:bg-black/50 backdrop-blur-md border-white/20 hover:bg-white/80 transition-all text-gray-900 dark:text-white">
            <Link to="/About">Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

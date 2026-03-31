import React, { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

import video1 from "@/assets/bg-video-1.mp4";
import video2 from "@/assets/bg-video-2.mp4";

export default function Home() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const videos = [video1, video2];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4 w-full overflow-hidden">
      
      {/* Background Video Playlist Engine */}
      <video 
        key={currentVideo}
        autoPlay 
        muted 
        playsInline
        onEnded={() => setCurrentVideo(prev => (prev + 1) % videos.length)}
        className="fixed top-0 left-0 w-full h-[100vh] object-cover opacity-25 dark:opacity-30 pointer-events-none -z-20 mix-blend-luminosity dark:mix-blend-screen"
      >
        <source src={videos[currentVideo]} type="video/mp4" />
      </video>

      {/* Cinematic Contrast Overlay */}
      <div className="fixed top-0 left-0 w-full h-[100vh] bg-gradient-to-b from-white/60 via-white/80 to-white/95 dark:from-black/50 dark:via-black/80 dark:to-[#09090b] backdrop-blur-[1px] pointer-events-none -z-10" />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-3xl relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
          {siteConfig.heroHeading} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">{siteConfig.abbreviation}</span>
        </h1>
        <p className="text-xl text-gray-800 dark:text-gray-300 mb-10 font-medium drop-shadow-sm">
          {siteConfig.description}
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild className="rounded-full h-12 px-8 text-md font-semibold bg-gray-900 dark:bg-white dark:text-gray-900 shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-all">
            <Link to="/Signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full h-12 px-8 text-md font-semibold bg-white/70 dark:bg-black/70 backdrop-blur-xl border-black/10 dark:border-white/20 hover:bg-white dark:hover:bg-black transition-all text-gray-900 dark:text-white shadow-xl">
            <Link to="/About">Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

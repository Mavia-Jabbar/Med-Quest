import React, { useRef } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useVideoTheme } from "@/Context/VideoThemeContext";

import video1 from "@/assets/bg-video-1.mp4"; // dark video → light text
import video2 from "@/assets/bg-video-2.mp4"; // light video → dark text

// videoIndex 0 = video2 (light), videoIndex 1 = video1 (dark)
const videoPairs = [video2, video1];

export default function Home() {
  const { videoIndex, setVideoIndex } = useVideoTheme();
  const loopCount = useRef(0);
  const videoRef = useRef(null);

  const handleVideoEnd = () => {
    loopCount.current += 1;
    if (loopCount.current >= 5) {
      loopCount.current = 0;
      setVideoIndex(prev => (prev + 1) % videoPairs.length);
    } else {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }
  };

  // videoIndex 0 = light video → dark text; videoIndex 1 = dark video → light text
  const isLightBg = videoIndex === 0;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4 w-full overflow-hidden">
      
      {/* Background Video — full opacity, no blur */}
      <video
        ref={videoRef}
        key={videoIndex}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className="fixed top-0 left-0 w-full h-[100vh] object-cover opacity-100 pointer-events-none -z-20"
      >
        <source src={videoPairs[videoIndex]} type="video/mp4" />
      </video>

      {/* Subtle vignette only — no whitewash */}
      <div className="fixed top-0 left-0 w-full h-[100vh] bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none -z-10" />

      {/* Hero Content — text color flips with video */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-3xl relative z-10">
        <h1 className={`text-5xl md:text-7xl font-black tracking-tight mb-6 drop-shadow-lg transition-colors duration-1000 ${isLightBg ? 'text-gray-900' : 'text-white'}`}>
          {siteConfig.heroHeading}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
            {siteConfig.abbreviation}
          </span>
        </h1>
        <p className={`text-xl mb-10 font-semibold drop-shadow-md transition-colors duration-1000 ${isLightBg ? 'text-gray-800' : 'text-gray-100'}`}>
          {siteConfig.description}
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild className={`rounded-full h-12 px-8 text-md font-semibold shadow-2xl hover:scale-105 transition-all ${isLightBg ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <Link to="/Signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" className={`rounded-full h-12 px-8 text-md font-semibold backdrop-blur-xl transition-all shadow-xl ${isLightBg ? 'bg-white/70 border-black/10 text-gray-900 hover:bg-white' : 'bg-black/40 border-white/30 text-white hover:bg-black/60'}`}>
            <Link to="/About">Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

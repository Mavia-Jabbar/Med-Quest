import { createContext, useContext, useState } from "react";

// videoIndex 0 = bg-video-2 (light bg → dark text)
// videoIndex 1 = bg-video-1 (dark bg → light text)
const VideoThemeContext = createContext({ videoIndex: 0, setVideoIndex: () => {} });

export const VideoThemeProvider = ({ children }) => {
  const [videoIndex, setVideoIndex] = useState(0);
  return (
    <VideoThemeContext.Provider value={{ videoIndex, setVideoIndex }}>
      {children}
    </VideoThemeContext.Provider>
  );
};

export const useVideoTheme = () => useContext(VideoThemeContext);

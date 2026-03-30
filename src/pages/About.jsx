import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export default function About() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <Card className="max-w-2xl w-full bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-700">
        <CardHeader className="text-center pb-4 pt-10">
          <CardTitle className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">About {siteConfig.name}</CardTitle>
          <CardDescription className="text-lg text-gray-500 font-medium mt-2">
            Why we built this platform
          </CardDescription>
        </CardHeader>
        <CardContent className="px-10 pb-10 text-gray-600 dark:text-gray-300 leading-relaxed text-center font-medium">
          {siteConfig.aboutMission}
        </CardContent>
      </Card>
    </div>
  );
}

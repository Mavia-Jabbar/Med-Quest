import React from "react";
import { useFirebase } from "@/Context/firebase";
import { Flame } from "lucide-react";
import StreakWidget from "@/components/dashboard/StreakWidget";
import MasteryWidget from "@/components/dashboard/MasteryWidget";
import QuickActions from "@/components/dashboard/QuickActions";
import { useSubjectProgress, useStreak } from "@/services/progressService";

const Dashboard = () => {
  const { userData, user } = useFirebase();
  const userName = userData?.name || "Student";
  const progressData = useSubjectProgress(user?.uid);
  const currentStreak = useStreak(user?.uid);

  // Transform real progress data into UI format
  // Fallback to 0 if subject not studied yet
  const getSubjectScore = (subjectName) => {
    const record = progressData.find((item) => item.subject === subjectName);
    return record ? Math.min(record.score, 100) : 0; // Cap at 100 for visual progress bar
  };

  const analytics = [
    {
      subject: "Biology",
      score: getSubjectScore("Biology"),
      color: "bg-emerald-500",
      glow: "shadow-[0_0_10px_rgba(16,185,129,0.5)]",
    },
    {
      subject: "Chemistry",
      score: getSubjectScore("Chemistry"),
      color: "bg-blue-500",
      glow: "shadow-[0_0_10px_rgba(59,130,246,0.5)]",
    },
    {
      subject: "Physics",
      score: getSubjectScore("Physics"),
      color: "bg-red-500",
      glow: "shadow-[0_0_10px_rgba(239,68,68,0.5)]",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
      {/* Animated Greeting Header */}
      <div className="mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Ready to study,{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {userName}
            </span>
            ? 🩺
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-xs sm:text-sm font-medium">
            Here's a breakdown of your current MDCAT preparation.
          </p>
        </div>
        <div className="md:hidden flex items-center gap-2 bg-orange-50 dark:bg-orange-500/10 px-2.5 py-1.5 rounded-full border border-orange-200 dark:border-orange-500/20">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
            {currentStreak}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 md:mb-8 mt-2">
        <StreakWidget currentStreak={currentStreak} />
        <MasteryWidget analytics={analytics} />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Quick Actions
        </h2>
      </div>

      <QuickActions />
    </div>
  );
};

export default Dashboard;

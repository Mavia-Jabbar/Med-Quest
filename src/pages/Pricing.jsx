import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { pricingTiers } from "@/config/pricing";

export default function Pricing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Simple Pricing
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Invest in your MDCAT score.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {pricingTiers.map((tier) => (
          <Card
            key={tier.id}
            className={
              tier.isPro
                ? "bg-linear-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-6 transition-all hover:-translate-y-2 hover:shadow-cyan-500/10 ring-1 ring-white/20"
                : "bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-xl rounded-3xl p-6 transition-all hover:-translate-y-2 hover:shadow-2xl"
            }
          >
            <CardHeader>
              <CardTitle
                className={`text-2xl font-bold ${tier.isPro ? "text-white" : "text-gray-900 dark:text-white"}`}
              >
                {tier.title}
              </CardTitle>
              <CardDescription
                className={`text-4xl font-bold mt-2 ${tier.isPro ? "text-white" : "text-gray-900 dark:text-white"}`}
              >
                ${tier.price}{" "}
                <span
                  className={`text-sm font-normal ${tier.isPro ? "text-gray-400" : "text-gray-500"}`}
                >
                  /mo
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <ul
                className={`space-y-3 font-medium ${tier.isPro ? "text-gray-300" : "text-gray-600 dark:text-gray-300"}`}
              >
                {tier.features.map((feature, i) => (
                  <li
                    key={i}
                    className={
                      tier.isPro && i === 0
                        ? "text-white font-semibold flex items-center gap-2"
                        : "flex items-center gap-2"
                    }
                  >
                    <span
                      className={
                        tier.isPro ? "text-emerald-400" : "text-emerald-500"
                      }
                    >
                      ✓
                    </span>{" "}
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={
                  tier.isPro
                    ? "w-full rounded-xl bg-white text-gray-900 hover:scale-105 transition-transform shadow-lg border-none mt-auto font-bold"
                    : "w-full mt-4 rounded-xl bg-white/50 backdrop-blur-md text-gray-900 border border-gray-200 hover:bg-white transition-all shadow-sm font-bold"
                }
              >
                <Link to="/Signup">{tier.buttonText}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

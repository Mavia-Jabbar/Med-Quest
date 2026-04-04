import { useSignupForm } from "@/hooks/useSignupForm";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function SignupForm({ className, ...props }) {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    loading,
    showPassword,
    setShowPassword,
    handleSubmit,
    handleGoogleAuth,
  } = useSignupForm();

  return (
    <div
      className={cn(
        "flex flex-col gap-6 items-center justify-center w-full max-w-md mx-auto my-12",
        className,
      )}
      {...props}
    >
      <Card className="w-full bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Create Account
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 font-medium">
            Join the platform today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 mt-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium text-center">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label
                  htmlFor="name"
                  className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl bg-white/50 dark:bg-black/50 border-white/20 dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 h-11 px-4 shadow-inner"
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl bg-white/50 dark:bg-black/50 border-white/20 dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 h-11 px-4 shadow-inner"
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl bg-white/50 dark:bg-black/50 border-white/20 dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 h-11 px-4 pr-12 shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="rounded-xl bg-white/50 dark:bg-black/50 border-white/20 dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 h-11 px-4 pr-12 shadow-inner"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl h-12 mt-4 bg-linear-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 dark:text-black hover:scale-[1.02] shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold text-md border-none"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Sign Up"
                )}
              </Button>

              <div className="mt-6 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
                Already have an account?{" "}
                <Link
                  to="/Login"
                  className="underline underline-offset-4 hover:text-primary transition-colors font-bold"
                >
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

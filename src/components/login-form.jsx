import { useLoginForm } from "@/hooks/useLoginForm";
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

export function LoginForm({ className, ...props }) {
  const {
    email, setEmail,
    password, setPassword,
    error,
    loading,
    showPassword, setShowPassword,
    handleSubmit,
    handleGoogleAuth,
  } = useLoginForm();

  return (
    <div className={cn("flex flex-col gap-6 items-center justify-center w-full max-w-md mx-auto my-12", className)} {...props}>
      <Card className="w-full bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome back</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 font-medium">
            Login to your Apple-style account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5 mt-4">
              
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium text-center">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl bg-white/50 dark:bg-black/50 border-white/20 dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 h-12 px-4 shadow-inner"
                />
              </div>

              <div className="grid gap-2 relative">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Password</Label>
                  <a href="#" className="text-xs font-medium text-primary hover:underline hover:text-primary/80 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl bg-white/50 dark:bg-black/50 border-white/20 dark:border-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 h-12 px-4 pr-12 shadow-inner"
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

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full rounded-xl h-12 mt-2 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 dark:text-black hover:scale-[1.02] shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold text-md border-none"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300/50 dark:border-gray-700/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGoogleAuth}
                className="w-full rounded-xl h-12 bg-white/50 dark:bg-black/50 border-white/30 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 font-semibold text-gray-700 dark:text-gray-200 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Google
              </Button>
            </div>
            <div className="mt-8 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
              Don&apos;t have an account?{" "}
              <Link to="/Signup" className="underline underline-offset-4 hover:text-primary transition-colors font-bold">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

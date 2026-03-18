"use client";

import { useActionState, useState } from "react";
import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from "lucide-react";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Connect our server actions to the UI state
  const [loginState, loginAction, isLoginPending] = useActionState(login, null);
  const [signupState, signupAction, isSignupPending] = useActionState(signup, null);

  const activeError = isSignUp ? signupState?.error : loginState?.error;
  const isPending = isSignUp ? isSignupPending : isLoginPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-sans p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center shadow-lg">
            <Layers className="text-white w-6 h-6" />
          </div>
        </div>

        <Card className="border-zinc-200 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {isSignUp ? "Create an account" : "Welcome back"}
            </CardTitle>
            <CardDescription className="text-zinc-500">
              {isSignUp 
                ? "Enter your agency details below to start your 14-day trial." 
                : "Enter your email to sign in to your agency portal."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={isSignUp ? signupAction : loginAction} className="space-y-4">
              
              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="agencyName">
                    Agency Name
                  </label>
                  <Input 
                    id="agencyName" 
                    name="agencyName" 
                    placeholder="Optima Logic" 
                    required 
                    className="h-11"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">
                  Email
                </label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="founder@agency.com" 
                  required 
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="password">
                  Password
                </label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  className="h-11"
                />
              </div>

              {activeError && (
                <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200">
                  {activeError}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isPending} 
                className="w-full bg-zinc-900 text-white h-11 text-base mt-2"
              >
                {isPending ? "Processing..." : (isSignUp ? "Start Free Trial" : "Sign In")}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-zinc-500">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button 
                onClick={() => setIsSignUp(!isSignUp)} 
                className="font-semibold text-zinc-900 hover:underline"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
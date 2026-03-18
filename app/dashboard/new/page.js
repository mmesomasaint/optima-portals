"use client";

import { useActionState } from "react";
import { provisionPortal } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewPortalPage() {
  const [state, action, isPending] = useActionState(provisionPortal, null);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Provision New Portal</h1>
        <p className="text-zinc-500 mt-1">Our AI will map relations and generate the workspace automatically.</p>
      </div>

      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
          <CardTitle className="text-lg">Client Details</CardTitle>
          <CardDescription>Enter the specifics of the new engagement.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={action} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-900" htmlFor="clientName">
                Client / Company Name
              </label>
              <Input 
                id="clientName" 
                name="clientName" 
                placeholder="e.g., TechCorp Industries" 
                required 
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-900" htmlFor="projectScope">
                Project Scope & Requirements
              </label>
              <Textarea 
                id="projectScope" 
                name="projectScope" 
                placeholder="Describe what this client needs. E.g., 'A web design retainer with a sprint tracker, an invoice database, and a feedback board.'" 
                required 
                className="min-h-[120px] resize-none"
              />
              <p className="text-xs text-zinc-500">Optima's LangGraph agents will use this to design the database architecture.</p>
            </div>

            {state?.error && (
              <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200 font-medium">
                {state.error}
              </div>
            )}

            <div className="pt-4 border-t border-zinc-100 flex justify-end">
              <Button 
                type="submit" 
                disabled={isPending} 
                className="bg-zinc-900 text-white h-11 px-6 text-base shadow-md"
              >
                {isPending ? (
                  <>Processing via LangGraph...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Generate Workspace</>
                )}
              </Button>
            </div>
            
          </form>
        </CardContent>
      </Card>
      
    </div>
  );
}
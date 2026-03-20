"use client";

import { useState } from "react";
import { saveMasterPageId } from "./actions"; // Import the server action we just built
import { Input } from "@/components/ui/input";
import { CardDescription, CardTitle } from "@/components/ui/card"
import { LoaderCircleIcon, CheckCircle2, AlertCircle } from "lucide-react";

export default function MasterUrlInput({ initialUrl = "", isNotionConnected }) {
  const [inputValue, setInputValue] = useState(initialUrl);
  const [isUpdating, setIsUpdating] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleBlur = async () => {
    // Don't fire the database call if the input hasn't changed or is empty
    if (inputValue === initialUrl || !inputValue.trim() || isNotionConnected) return;

    setIsUpdating(true);
    setSaveStatus("idle");

    const result = await saveMasterPageId(inputValue);

    if (result.error) {
      setSaveStatus("error");
      setErrorMessage(result.error);
    } else {
      setSaveStatus("success");
      // Optionally reset to idle after 3 seconds so the green checkmark fades
      setTimeout(() => setSaveStatus("idle"), 3000); 
    }
    
    setIsUpdating(false);
  };

  return (
    <div className="mt-4 border-t border-zinc-100 pt-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-900 flex justify-between items-center" htmlFor="masterClientURL">
          <CardTitle>Master Client URL</CardTitle>
          
          {saveStatus === "success" && <span className="text-xs text-green-600 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Saved</span>}
          {saveStatus === "error" && <span className="text-xs text-red-600 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Error</span>}
        </label>
        
        <CardDescription className="text-zinc-500 mb-2">Paste the URL of your main Notion page. We extract the ID automatically.</CardDescription>
        
        <div className="relative">
          {isUpdating && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <LoaderCircleIcon className="w-5 h-5 text-zinc-500 animate-spin" />
            </div>
          )}
          
          <Input 
            id="masterClientURL" 
            name="masterClientURL" 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            readOnly={isNotionConnected || isUpdating}
            placeholder="e.g., https://notion.so/Agency-Operations-8a3b2..." 
            className={`h-11 w-full ${isUpdating ? "pr-10" : "pr-3"} ${
              isNotionConnected ? "bg-zinc-50 cursor-not-allowed text-zinc-400" : "cursor-text"
            }`}
          />
        </div>
        
        {saveStatus === "error" && (
          <p className="text-xs text-red-600 font-medium mt-1">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
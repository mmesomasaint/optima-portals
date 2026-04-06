"use client";

import { useState } from "react";
import { saveMasterPageId } from "@/app/dashboard/integrations/actions"; 
import { LoaderCircleIcon, CheckCircle2, AlertCircle } from "lucide-react";

export default function MasterUrlInput({ initialUrl = "", isNotionConnected }) {
  const [inputValue, setInputValue] = useState(initialUrl);
  const [isUpdating, setIsUpdating] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); 
  const [errorMessage, setErrorMessage] = useState("");

  const handleBlur = async () => {
    if (inputValue === initialUrl || !inputValue.trim() || isNotionConnected) return;

    setIsUpdating(true);
    setSaveStatus("idle");

    const result = await saveMasterPageId(inputValue);

    if (result.error) {
      setSaveStatus("error");
      setErrorMessage(result.error);
    } else {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000); 
    }
    
    setIsUpdating(false);
  };

  return (
    <div className="mb-6 border-t border-white/10 pt-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-1">
          <label className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500" htmlFor="masterClientURL">
            Master Client URL
          </label>
          
          {saveStatus === "success" && <span className="text-xs text-emerald-400 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Saved</span>}
          {saveStatus === "error" && <span className="text-xs text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Error</span>}
        </div>
        
        <p className="text-[13px] text-zinc-400 font-light mb-3">Paste the URL of your main Notion page. We extract the ID automatically.</p>
        
        <div className="relative">
          {isUpdating && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <LoaderCircleIcon className="w-4 h-4 text-emerald-500 animate-spin" />
            </div>
          )}
          
          <input 
            id="masterClientURL" 
            name="masterClientURL" 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            readOnly={isNotionConnected || isUpdating}
            placeholder="e.g., https://notion.so/Agency-Operations-8a3b2..." 
            className={`w-full bg-black border rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-colors ${
              isUpdating ? "pr-10 border-white/10" : "pr-4"
            } ${
              isNotionConnected 
                ? "bg-white/5 border-white/5 text-zinc-600 cursor-not-allowed" 
                : "border-white/10 focus:border-emerald-500"
            }`}
          />
        </div>
        
        {saveStatus === "error" && (
          <p className="text-xs text-red-400 font-medium mt-2">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
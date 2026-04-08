'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';

export default function OnboardingTour({ isNotionReady, briefStatus }: { isNotionReady: boolean, briefStatus: string }) {
  useEffect(() => {
    // Check our local storage memory banks
    const hasSeenPhase1 = localStorage.getItem('optima_tour_phase1');
    const hasSeenPhase2 = localStorage.getItem('optima_tour_phase2');

    let driverObj: any;

    // We only want this tour running if they haven't ignited the engine yet
    if (briefStatus !== 'pending_ai_build') return;

    if (!isNotionReady && !hasSeenPhase1) {
      // PHASE 1: Notion is NOT connected yet.
      driverObj = driver({
        showProgress: true,
        animate: true,
        steps: [
          { 
            popover: { title: 'Welcome to Optima Portals', description: 'Your brief is secured. Let\'s prepare your architecture for deployment.', align: 'center' } 
          },
          { 
            element: '#tour-step-1', 
            popover: { title: 'Step 1: The Master URL', description: 'We need a destination. You must provide the Base Notion Page ID where the AI will build your system.', side: 'bottom', align: 'start' } 
          },
          { 
            element: '#tour-step-1-btn', 
            popover: { title: 'Step 2: Link Notion', description: 'Click here to head to Integrations. Connect your account and paste your Page ID.', side: 'bottom', align: 'start' } 
          },
        ],
        onDestroyStarted: () => {
          localStorage.setItem('optima_tour_phase1', 'true');
          driverObj.destroy();
        }
      });
      setTimeout(() => driverObj.drive(), 1000);

    } else if (isNotionReady && !hasSeenPhase2) {
      // PHASE 2: They returned from integrations. Notion IS connected.
      driverObj = driver({
        showProgress: false, // Only one step, so hide progress
        animate: true,
        steps: [
          { 
            element: '#tour-step-2', 
            popover: { title: 'Step 3: Ignition 🚀', description: 'Systems are go. Click here to ignite the LangGraph AI and deploy your workspace.', side: 'top', align: 'center' } 
          }
        ],
        onDestroyStarted: () => {
          localStorage.setItem('optima_tour_phase2', 'true');
          driverObj.destroy();
        }
      });
      setTimeout(() => driverObj.drive(), 800);
    }

    return () => {
      if (driverObj) driverObj.destroy();
    };
  }, [isNotionReady, briefStatus]);

  return null;
}
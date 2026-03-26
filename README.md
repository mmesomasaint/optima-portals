# ⚡️ Optima Portals: Client Dashboard

The frontend architecture for Optima Logic's AI-powered Notion Operating System generator. Built to provide a seamless, high-converting UX for agencies to request, manage, and deploy custom relational databases.

## 🏗 Tech Stack
* **Framework:** Next.js (React)
* **Styling:** Tailwind CSS
* **Database & Auth:** Supabase (Row Level Security enabled)
* **Deployment:** Vercel

## 🚀 Features
* **OAuth Integration:** Securely connects to client Notion workspaces.
* **Real-time Status Tracking:** Next.js UI pulses and updates as the Python backend processes LangGraph agents, builds databases, and maps relations.
* **Error Boundaries:** Intercepts strict API failures (like missing Notion permissions) and translates them into actionable UI prompts for the user.

## 🛠 Local Development

1. **Install Dependencies**
   ```bash
   npm install

2. **Environmental Variables**
    Create a .env.local file in the root directory:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    NEXT_PUBLIC_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000) # Switch to Render URL in production

3. **Run the Developmnet Server**
    ```bash
    npm run dev
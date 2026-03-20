"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, Zap, Layers, Lock, ArrowUpRight } from "lucide-react";
import Link from "next/link";

// Standardized animation variants for Framer Motion
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">
      
      {/* --- NAVIGATION --- */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-900 rounded-md flex items-center justify-center">
            <Layers className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">Optima Portals</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600">
          <a href="#features" className="hover:text-zinc-900 transition">Features</a>
          <a href="#pricing" className="hover:text-zinc-900 transition">Pricing</a>
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Button className="bg-zinc-900 text-white">Get Started</Button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-6 max-w-5xl mx-auto text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={fadeUp} className="mb-6">
            <Badge variant="outline" className="bg-white border-zinc-200 text-zinc-600 py-2.5 px-4">
              FOR HIGH-TICKET FREELANCERS & AGENCIES
            </Badge>
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-zinc-900 leading-[1.1]">
            Stop Duplicating Notion Templates. <br className="hidden md:block" />
            <span className="text-zinc-400">Automate Client Onboarding.</span>
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-zinc-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect your Stripe or CRM. The second a client pays, our AI engine provisions a highly customized, secure Notion Client Portal with their branding—in exactly 12 seconds.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-zinc-900 text-white w-full sm:w-auto text-base h-14 px-8">
              Start Your 14-Day Free Trial <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-14 px-8 bg-white">
              Watch 1-Minute Demo
            </Button>
          </motion.div>
          
          <motion.p variants={fadeUp} className="mt-8 text-xs font-medium text-zinc-400 uppercase tracking-widest">
            Powered by the enterprise infrastructure at Optima Logic
          </motion.p>
        </motion.div>
      </section>

      {/* --- AGITATION SECTION (THE PAIN) --- */}
      <section className="py-24 bg-white border-y border-zinc-200 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">You sell premium services, but your onboarding feels like manual labor.</h2>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { title: "The Template Trap", desc: "Duplicating your master Notion template for the 50th time and manually clearing out old dummy data." },
              { title: "The Permission Nightmare", desc: "Wasting 20 minutes manually inviting clients as guests, adjusting page permissions, and hiding internal databases." },
              { title: "The Workflow Friction", desc: "Making high-ticket clients wait 24 hours for their workspace while you manually build out their task board." }
            ].map((item, index) => (
              <motion.div key={index} variants={fadeUp}>
                <Card className="bg-zinc-50 border-none shadow-none h-full">
                  <CardContent className="p-8">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-6">
                      <span className="text-red-600 font-bold text-lg">✕</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- SOLUTION SECTION --- */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.h2 variants={fadeUp} className="text-4xl font-bold tracking-tight mb-6">
              Zero-Touch Provisioning. <br/>From Payment to Portal.
            </motion.h2>
            
            <div className="space-y-8 mt-10">
              {[
                { icon: Zap, title: "Step 1: The Trigger", desc: "Connects seamlessly with Zapier. When a lead signs your contract or pays an invoice, the workflow begins invisibly in the background." },
                { icon: Layers, title: "Step 2: The AI Architect", desc: "Our backend maps out the required database relations for their specific project scope and perfectly locks down guest permissions." },
                { icon: Lock, title: "Step 3: The Handoff", desc: "Your client automatically receives an email with a magic link to their beautifully branded, fully populated Notion workspace." }
              ].map((step, index) => (
                <motion.div key={index} variants={fadeUp} className="flex gap-4">
                  <div className="mt-1 bg-zinc-100 p-3 rounded-lg h-fit">
                    <step.icon className="w-6 h-6 text-zinc-900" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                    <p className="text-zinc-500 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Abstract UI Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="bg-zinc-900 rounded-2xl p-8 shadow-2xl relative overflow-hidden h-[600px] flex flex-col"
          >
            <div className="flex gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
            </div>
            <div className="flex-1 border border-zinc-800 rounded-xl bg-zinc-950 p-6 relative">
               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/50 z-10"></div>
               <div className="w-3/4 h-8 bg-zinc-800 rounded-md mb-6 animate-pulse"></div>
               <div className="space-y-4">
                 <div className="w-full h-24 bg-zinc-800/50 rounded-lg"></div>
                 <div className="w-5/6 h-24 bg-zinc-800/50 rounded-lg"></div>
                 <div className="w-full h-24 bg-zinc-800/50 rounded-lg"></div>
               </div>
               {/* Overlay Success Notification */}
               <div className="absolute bottom-10 right-[-20px] bg-green-500 text-white px-6 py-4 rounded-xl shadow-xl z-20 flex items-center gap-3 font-medium">
                 <CheckCircle2 className="w-5 h-5" /> Workspace Deployed
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- CTA FOOTER --- */}
      <section className="py-24 bg-zinc-900 text-center px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-8">
            Your next client closes tomorrow. Will you build their workspace by hand?
          </h2>
          <Button size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100 text-base h-14 px-10">
            Deploy Your First Portal Now <ArrowUpRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </section>

    </div>
  );
}
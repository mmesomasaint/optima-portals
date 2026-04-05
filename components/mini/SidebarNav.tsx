'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Webhook } from 'lucide-react';

export function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Blueprints', href: '/dashboard/templates', icon: Users },
    { name: 'API & Zapier', href: '/dashboard/integrations', icon: Webhook },
  ];

  return (
    <nav className="flex-1 px-4 space-y-1.5 mt-6">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.name} 
            href={item.href} 
            className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive 
                ? 'bg-white/10 text-white border border-white/10 shadow-sm' 
                : 'text-zinc-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-emerald-500' : 'text-zinc-400'}`} /> 
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CreditCard, Settings } from 'lucide-react';
import { SignOutButton } from './SignOutButton';

export function SidebarBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="p-4 border-t border-white/10 space-y-1.5">
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
      
      {/* The Active Sign Out Button */}
      <SignOutButton />
    </div>
  );
}
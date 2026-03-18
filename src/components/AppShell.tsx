"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, BookOpen, Dumbbell } from "lucide-react";
import { StarCounter } from "./StarCounter";
import { SoundToggle } from "./SoundToggle";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Clock },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: Dumbbell },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-xl">🕐</span>
            <span className="text-lg font-black text-purple-700">TimeBuddy</span>
          </Link>
          <div className="flex items-center gap-2">
            <StarCounter />
            <SoundToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="sticky bottom-0 bg-white border-t border-gray-100 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
        <div className="max-w-lg mx-auto flex">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-3 transition-colors",
                  active ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Icon className={cn("w-5 h-5", active && "drop-shadow-sm")} />
                <span className={cn("text-xs font-bold", active ? "text-purple-600" : "")}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Home, Search, PlusCircle, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const items = [
  { icon: Home,       label: "HOME",    href: "/" },
  { icon: Search,     label: "SEARCH",  href: "/search" },
  { icon: PlusCircle, label: "POST",    href: "/post" },
  { icon: User,       label: "ACCOUNT", href: "/account" },
];

export default function Nav({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      {/* ── Desktop: fixed top header ─────────────────────────── */}
      <header className="hidden md:flex fixed top-0 left-0 w-full h-16 bg-sand/95 backdrop-blur-md border-b border-ink/10 items-center justify-between px-12 z-100">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="text-ink hover:text-violet transition-colors cursor-pointer bg-transparent border-none p-0"
        >
          {open ? (
            <X className="w-6 h-6 stroke-[1.2px]" />
          ) : (
            <Menu className="w-6 h-6 stroke-[1.2px]" />
          )}
        </button>

        <Link
          href="/"
          className="text-sm font-black tracking-[0.4em] text-ink uppercase hover:text-violet transition-colors"
        >
          MY-COLE
        </Link>

        {/* Auth buttons */}
        <div className="flex items-center gap-x-3">
          {user ? (
            <>
              <span className="text-[10px] tracking-widest text-ink/40 uppercase hidden lg:block">
                {user.email?.split("@")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="text-[10px] tracking-[0.3em] uppercase text-ink/50 hover:text-violet transition-colors"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[10px] tracking-[0.3em] uppercase text-ink/50 hover:text-violet transition-colors"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="text-[10px] tracking-[0.3em] uppercase bg-ink text-sand px-4 py-2 hover:bg-violet transition-colors"
              >
                新規登録
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ── Desktop: dropdown menu ─────────────────────────────── */}
      <div
        className={`
          hidden md:block fixed top-16 left-0 w-full bg-sand border-b border-ink/10 z-90
          overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${open ? "max-h-24 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
        `}
      >
        <nav className="flex items-center gap-x-12 px-12 py-6">
          {items.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`
                  text-[11px] uppercase tracking-[0.4em] font-medium transition-colors
                  ${active ? "text-violet" : "text-ink/50 hover:text-violet"}
                `}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="hidden md:block fixed inset-0 z-80 top-16"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile: fixed bottom tab bar ──────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-sand/95 backdrop-blur-md border-t border-ink/10 z-50 flex justify-around items-center h-16">
        {items.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center flex-1 h-full gap-y-1"
            >
              <Icon
                className={`w-5 h-5 stroke-[1.5px] transition-colors ${
                  active ? "text-violet" : "text-ink/40"
                }`}
              />
              <span
                className={`text-[8px] font-bold tracking-[0.2em] transition-colors ${
                  active ? "text-violet" : "text-ink/40"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="min-h-screen pb-16 md:pb-0">{children}</div>
    </>
  );
}
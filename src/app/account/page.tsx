import { User, Archive, Star } from "lucide-react";

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-sand text-ink px-6 md:px-16 pt-24 md:pt-24 pb-24 max-w-7xl mx-auto">
      <header className="border-b border-ink/5 pb-8 mb-12">
        <div className="flex items-baseline gap-x-4 mb-3">
          <span className="text-[10px] font-mono text-ink/30">04 /</span>
          <h1 className="text-xs font-bold tracking-[0.3em] uppercase border-l-[3px] border-violet pl-3">
            Account
          </h1>
        </div>
        <p className="text-[10px] tracking-[0.4em] text-ink/40 uppercase">
          Manage your profile & archive.
        </p>
      </header>

      {/* Profile card */}
      <div className="bg-white border border-ink/10 p-8 flex items-center gap-x-6 mb-10 max-w-lg">
        <div className="w-16 h-16 rounded-full bg-violet/10 border border-violet/20 flex items-center justify-center shrink-0">
          <User className="w-7 h-7 text-violet stroke-[1.2px]" />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-widest text-ink mb-1">
            CURATOR
          </h2>
          <p className="text-[10px] tracking-[0.3em] text-ink/40 uppercase">
            Starter · 0 posts
          </p>
          <button className="mt-3 text-[9px] font-bold tracking-[0.4em] uppercase text-violet border border-violet/30 px-4 py-1.5 hover:bg-violet hover:text-white transition-colors cursor-pointer">
            Upgrade for 50% OFF
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-lg mb-10">
        {[
          { label: "Items", value: "0" },
          { label: "Followers", value: "0" },
          { label: "Following", value: "0" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-ink/10 p-4 text-center">
            <div className="text-xl font-black font-mono text-ink">{value}</div>
            <div className="text-[9px] tracking-[0.3em] uppercase text-ink/40 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Menu items */}
      <div className="max-w-lg space-y-1">
        {[
          { icon: Star, label: "Favorites" },
          { icon: Archive, label: "Archive" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-x-4 bg-white border border-ink/10 px-6 py-4 hover:border-violet/20 transition-colors cursor-pointer group"
          >
            <Icon className="w-4 h-4 stroke-[1.5px] text-ink/40 group-hover:text-violet transition-colors" />
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-ink group-hover:text-violet transition-colors">
              {label}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
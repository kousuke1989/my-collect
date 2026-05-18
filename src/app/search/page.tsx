import { Search } from "lucide-react";

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-sand text-ink px-6 md:px-16 pt-24 md:pt-24 pb-24 max-w-7xl mx-auto">
      <header className="border-b border-ink/5 pb-8 mb-12">
        <div className="flex items-baseline gap-x-4 mb-3">
          <span className="text-[10px] font-mono text-ink/30">02 /</span>
          <h1 className="text-xs font-bold tracking-[0.3em] uppercase border-l-[3px] border-violet pl-3">
            Search
          </h1>
        </div>
        <p className="text-[10px] tracking-[0.4em] text-ink/40 uppercase">
          Filter by artifact type or curator.
        </p>
      </header>

      <div className="flex items-center gap-x-4 border border-ink/10 bg-white px-5 py-4 focus-within:border-violet/40 transition-colors">
        <Search className="w-4 h-4 text-ink/30 stroke-[1.5px] shrink-0" />
        <input
          type="text"
          placeholder="Search items, curators, brands..."
          className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink/30 tracking-wider outline-none"
        />
      </div>

      <div className="mt-16 flex flex-col items-center justify-center gap-y-4 text-ink/20">
        <Search className="w-12 h-12 stroke-[0.8px]" />
        <p className="text-[10px] tracking-[0.4em] uppercase">
          Start typing to explore the collection
        </p>
      </div>
    </main>
  );
}
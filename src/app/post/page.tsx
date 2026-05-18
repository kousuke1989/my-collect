import { PlusCircle } from "lucide-react";

export default function PostPage() {
  return (
    <main className="min-h-screen bg-sand text-ink px-6 md:px-16 pt-24 md:pt-24 pb-24 max-w-7xl mx-auto">
      <header className="border-b border-ink/5 pb-8 mb-12">
        <div className="flex items-baseline gap-x-4 mb-3">
          <span className="text-[10px] font-mono text-ink/30">03 /</span>
          <h1 className="text-xs font-bold tracking-[0.3em] uppercase border-l-[3px] border-violet pl-3">
            Post
          </h1>
        </div>
        <p className="text-[10px] tracking-[0.4em] text-ink/40 uppercase">
          Share your essential curated items.
        </p>
      </header>

      <div className="space-y-6 max-w-lg">
        <div className="flex flex-col gap-y-2">
          <label className="text-[9px] tracking-[0.4em] uppercase text-ink/40 font-bold">
            Item Name
          </label>
          <input
            type="text"
            placeholder="e.g. Le Labo Santal 33"
            className="bg-white border border-ink/10 px-4 py-3 text-sm text-ink placeholder:text-ink/30 tracking-wider outline-none focus:border-violet/40 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-y-2">
          <label className="text-[9px] tracking-[0.4em] uppercase text-ink/40 font-bold">
            Brand
          </label>
          <input
            type="text"
            placeholder="e.g. Le Labo"
            className="bg-white border border-ink/10 px-4 py-3 text-sm text-ink placeholder:text-ink/30 tracking-wider outline-none focus:border-violet/40 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-y-2">
          <label className="text-[9px] tracking-[0.4em] uppercase text-ink/40 font-bold">
            Category
          </label>
          <select className="bg-white border border-ink/10 px-4 py-3 text-sm text-ink/60 tracking-wider outline-none focus:border-violet/40 transition-colors appearance-none">
            <option value="">Select a category</option>
            <option>Fragrance</option>
            <option>Leather Goods</option>
            <option>Footwear</option>
            <option>Home Decor</option>
            <option>Design Objects</option>
          </select>
        </div>

        <div className="flex flex-col gap-y-2">
          <label className="text-[9px] tracking-[0.4em] uppercase text-ink/40 font-bold">
            Your Note
          </label>
          <textarea
            rows={4}
            placeholder="Why is this item essential to your collection?"
            className="bg-white border border-ink/10 px-4 py-3 text-sm text-ink placeholder:text-ink/30 tracking-wider outline-none focus:border-violet/40 transition-colors resize-none"
          />
        </div>

        <button className="flex items-center gap-x-3 bg-violet text-white px-6 py-3 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-violet/90 transition-colors cursor-pointer">
          <PlusCircle className="w-4 h-4 stroke-[1.5px]" />
          Post to Collection
        </button>
      </div>
    </main>
  );
}
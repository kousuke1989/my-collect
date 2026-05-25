"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ArrowRight, Loader2 } from "lucide-react";

type RakutenItem = {
  itemName: string;
  shopName: string;
  itemPrice: number;
  itemUrl: string;
  mediumImageUrls: { imageUrl: string }[];
  reviewAverage: number;
};

const CATEGORIES = [
  { label: "Fragrance",       keyword: "フレグランス 香水" },
  { label: "Leather Goods",   keyword: "レザー 革小物" },
  { label: "Footwear",        keyword: "スニーカー シューズ" },
  { label: "Home",            keyword: "インテリア 雑貨" },
  { label: "Design Objects",  keyword: "デザイン プロダクト" },
];

const hdImage = (url: string) => url.replace(/_ex=\d+x\d+/, "_ex=500x500");

export default function SearchPage() {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [items, setItems] = useState<RakutenItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setItems([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/rakuten/search?keyword=${encodeURIComponent(q)}`);
      const data = await res.json();
      setItems(data.Items ? data.Items.map((i: { Item: RakutenItem }) => i.Item) : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce typed input
  useEffect(() => {
    if (activeCategory) return;
    const timer = setTimeout(() => doSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory, doSearch]);

  const handleInput = (value: string) => {
    setInputValue(value);
    setSearchQuery(value);
    setActiveCategory(null);
  };

  const handleCategory = (cat: (typeof CATEGORIES)[number]) => {
    if (activeCategory === cat.label) {
      setActiveCategory(null);
      setInputValue("");
      setSearchQuery("");
      setItems([]);
      setSearched(false);
    } else {
      setActiveCategory(cat.label);
      setInputValue(cat.label);
      setSearchQuery(cat.keyword);
      doSearch(cat.keyword);
    }
  };

  return (
    <main className="min-h-screen bg-sand text-ink px-6 md:px-16 pt-24 md:pt-24 pb-24 max-w-7xl mx-auto">

      {/* Header */}
      <header className="border-b border-ink/5 pb-8 mb-10">
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

      {/* Search input */}
      <div className="flex items-center gap-x-4 border border-ink/10 bg-white px-5 py-4 focus-within:border-violet/40 transition-colors">
        {loading ? (
          <Loader2 className="w-4 h-4 text-violet animate-spin shrink-0" />
        ) : (
          <Search className="w-4 h-4 text-ink/30 stroke-[1.5px] shrink-0" />
        )}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="Search items, curators, brands..."
          className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink/30 tracking-wider outline-none"
          autoFocus
        />
        {inputValue && (
          <button
            onClick={() => handleInput("")}
            className="text-[10px] tracking-widest text-ink/30 hover:text-ink transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mt-5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            onClick={() => handleCategory(cat)}
            className={`
              text-[9px] font-bold tracking-[0.3em] uppercase border px-3 py-2 transition-colors cursor-pointer
              ${activeCategory === cat.label
                ? "bg-violet text-white border-violet"
                : "bg-transparent text-ink/50 border-ink/10 hover:border-violet/40 hover:text-violet"}
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mt-10">
        {!loading && !searched && (
          <div className="flex flex-col items-center justify-center gap-y-4 text-ink/20 pt-16">
            <Search className="w-12 h-12 stroke-[0.8px]" />
            <p className="text-[10px] tracking-[0.4em] uppercase">
              Start typing to explore the collection
            </p>
          </div>
        )}

        {!loading && searched && items.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-y-4 text-ink/20 pt-16">
            <Search className="w-12 h-12 stroke-[0.8px]" />
            <p className="text-[10px] tracking-[0.4em] uppercase">No items found</p>
          </div>
        )}

        {items.length > 0 && (
          <>
            <p className="text-[9px] font-mono text-ink/30 mb-6 tracking-widest">
              {items.length} results
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {items.map((item, i) => (
                <a
                  key={i}
                  href={item.itemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white/40 border border-ink/5 p-4 transition-all duration-300 hover:border-ink/20 block"
                >
                  <div className="flex justify-between text-[9px] font-mono text-ink/40 mb-3">
                    <span className="truncate max-w-[80%]">
                      {item.shopName.toUpperCase().slice(0, 14)}
                    </span>
                    <ArrowRight className="w-3 h-3 text-violet opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>

                  <div className="aspect-square bg-white mb-4 border border-ink/5 overflow-hidden flex items-center justify-center">
                    {item.mediumImageUrls[0] ? (
                      <img
                        src={hdImage(item.mediumImageUrls[0].imageUrl)}
                        alt={item.itemName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[9px] text-ink/20 uppercase tracking-widest italic px-2 text-center">
                        {item.shopName}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-[11px] font-bold tracking-wide text-ink line-clamp-2 leading-snug">
                      {item.itemName}
                    </h3>
                    <div className="flex items-center gap-x-2 mt-1">
                      {item.reviewAverage > 0 && (
                        <span className="text-[9px] text-ink/40">★ {item.reviewAverage}</span>
                      )}
                      {item.itemPrice > 0 && (
                        <span className="text-[10px] font-bold text-violet">
                          ¥{item.itemPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import { Award, MessageSquare, Layers, ArrowRight } from "lucide-react";

type RakutenItem = {
  itemName: string;
  shopName: string;
  itemPrice: number;
  itemUrl: string;
  mediumImageUrls: { imageUrl: string }[];
  reviewAverage: number;
};

type RakutenRankingItem = RakutenItem & { rank: number };

const posts = [
  { id: "001", user: "Aoyama_92", item: "LE LABO SANTAL 33", brand: "Fragrance" },
  { id: "002", user: "S.Kousuke", item: "Hender Scheme Key", brand: "Leather" },
  { id: "003", user: "Mina_Minimal", item: "Aesop Resurrection", brand: "Body Care" },
  { id: "004", user: "Yuki_001", item: "Common Projects", brand: "Footwear" },
  { id: "005", user: "Hiro_Collect", item: "Artek Stool 60", brand: "Furniture" },
  { id: "006", user: "Design_Life", item: "Braun BC02", brand: "Clock" },
];

const reviews = [
  {
    text: "このアイテムは私のコレクションの中でも特別な存在です。使い込むほどに馴染んでいく感覚が最高です。",
    user: "@minimal_life",
    item: "LE LABO",
  },
  {
    text: "Santal 33とHender Schemeの組み合わせは、空間の雰囲気を一気に引き締めてくれます。",
    user: "@archivist_01",
    item: "KEY SHACKLE",
  },
  {
    text: "持ち歩くだけでモチベーションが上がるプロダクト。パープルの差し色デザインがWebでも映えますね。",
    user: "@ritual_03",
    item: "AESOP",
  },
  {
    text: "無駄を削ぎ落としたフォルムでありながら、圧倒的な存在感を放つ名作家具です。",
    user: "@interior_curator",
    item: "ARTEK STOOL",
  },
];

const categories = [
  { name: "Leather", desc: "The tactile essence of daily utility." },
  { name: "Home", desc: "Curated objects for living space." },
  { name: "Footwear", desc: "Minimalist foundations for travel." },
  { name: "Fragrance", desc: "Invisible layers of identity." },
  { name: "Design Objects", desc: "Precision in everyday form." },
];

const hdImage = (url: string) => url.replace(/_ex=\d+x\d+/, "_ex=500x500");

const rankings = [
  { rank: "01", name: "Santal 33", brand: "LE LABO", rating: "4.9", type: "Fragrance" },
  { rank: "02", name: "Original Achilles", brand: "COMMON PROJECTS", rating: "4.8", type: "Footwear" },
  { rank: "03", name: "Key Shackle", brand: "HENDER SCHEME", rating: "4.7", type: "Leather Goods" },
  { rank: "04", name: "Stool 60", brand: "ARTEK", rating: "4.6", type: "Furniture" },
];

// avatar: Lummi ライセンスの AI 生成ポートレート（実在しない人物）。
// 詳細な出典は public/curators/CREDITS.md を参照。
const curators = [
  {
    id: "C01",
    handle: "Aoyama_92",
    avatar: "/curators/aoyama-92.jpg",
    specialty: "Fragrance",
    items: 48,
    followers: 312,
    brands: ["LE LABO", "BYREDO", "DIPTYQUE"],
  },
  {
    id: "C02",
    handle: "minimal_life",
    avatar: "/curators/minimal-life.jpg",
    specialty: "Leather Goods",
    items: 36,
    followers: 284,
    brands: ["HENDER SCHEME", "IL BISONTE", "PORTER"],
  },
  {
    id: "C03",
    handle: "archivist_01",
    avatar: "/curators/archivist-01.jpg",
    specialty: "Furniture",
    items: 27,
    followers: 201,
    brands: ["ARTEK", "VITRA", "MUJI"],
  },
  {
    id: "C04",
    handle: "S.Kousuke",
    avatar: "/curators/s-kousuke.jpg",
    specialty: "Footwear",
    items: 53,
    followers: 430,
    brands: ["COMMON PROJECTS", "BLUEOVER", "REPRODUCTION"],
  },
  {
    id: "C05",
    handle: "interior_curator",
    avatar: "/curators/interior-curator.jpg",
    specialty: "Design Objects",
    items: 31,
    followers: 178,
    brands: ["BRAUN", "ANGLEPOISE", "HAY"],
  },
];

const faqs = [
  {
    q: "MY-COLE とはどんなサービスですか？",
    a: "こだわりのあるユーザーが愛用品を投稿・共有するキュレーションコミュニティです。モノを通じて、価値観の近い人と繋がれます。",
  },
  {
    q: "誰でも投稿できますか？",
    a: "はい。アカウントを作成すれば、どなたでも無料で投稿・閲覧が可能です。特別な審査はありません。",
  },
  {
    q: "どんなアイテムを投稿できますか？",
    a: "ブランドやカテゴリは問いません。あなたが本当に気に入っているアイテムであれば、何でも投稿できます。",
  },
  {
    q: "キュレーターとは何ですか？",
    a: "審美眼を持ち、自分の「いいもの」を積極的に共有するユーザーのことです。投稿数やレビュー数に応じてランクが上がります。",
  },
];

export default function Home() {
  const [newItems, setNewItems] = useState<RakutenItem[]>([]);
  const [rankingItems, setRankingItems] = useState<RakutenRankingItem[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/rakuten/items").then((r) => r.json()),
      fetch("/api/rakuten/ranking").then((r) => r.json()),
    ]).then(([itemsData, rankingData]) => {
      if (itemsData.Items) setNewItems(itemsData.Items.map((i: { Item: RakutenItem }) => i.Item));
      if (rankingData.Items) {
        const items = rankingData.Items.map((i: { Item: RakutenRankingItem }) => i.Item);
        setRankingItems(items.sort((a: RakutenRankingItem, b: RakutenRankingItem) => a.rank - b.rank).slice(0, 4));
      }
    }).catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-sand text-ink px-6 md:px-16 pt-24 md:pt-24 pb-24 space-y-20 max-w-7xl mx-auto">

      {/* Header */}
      <header className="border-b border-ink/5 pb-8">
        <div className="flex items-center gap-x-4 mb-3">
          <img src="/logo.png" alt="MY-COLE logo" className="w-14 h-14 object-contain shrink-0 mix-blend-multiply" />
          <h1 className="text-4xl md:text-5xl font-black tracking-[0.3em] text-ink uppercase">
            MY-COLE
          </h1>
        </div>
        <p className="text-[10px] tracking-[0.4em] text-ink/40 uppercase">
          Curated Community Collection
        </p>
      </header>

      {/* ── HERO CARDS ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src="/hero-1.jpg"
          alt="MY-COLEマイコレとは？"
          className="w-full h-64 md:h-80 object-cover"
        />
        <img
          src="/hero-2.jpg"
          alt="みんなのお気に入りを探す"
          className="w-full h-64 md:h-80 object-cover"
        />
      </div>

      {/* ── ABOUT ─────────────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="max-w-2xl space-y-5">
          <p className="text-[9px] tracking-[0.6em] text-violet/70 uppercase font-medium">
            About MY-COLE
          </p>
          <p className="text-xl md:text-2xl font-bold text-ink leading-relaxed tracking-wide">
            こだわりを持つ人たちが、<br />
            愛用品を共有するコミュニティ。
          </p>
          <p className="text-xs text-ink/60 leading-loose">
            フレグランス、家具、革小物、シューズ——日常に溶け込む「本物」のアイテムが、ここに集まります。
            投稿して、共有して、発見する。あなたの審美眼を、このコミュニティと共に育てていきましょう。
          </p>
        </div>

        <div className="flex gap-x-8 md:gap-x-12 border-t border-ink/5 pt-8">
          {[
            { value: "1,240", label: "キュレーター" },
            { value: "8,430", label: "投稿アイテム" },
            { value: "32K",   label: "レビュー数" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl font-black font-mono text-ink">{value}</div>
              <div className="text-[9px] tracking-[0.3em] text-ink/40 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 00 Q & A ───────────────────────────────────────────────── */}
      <section className="space-y-6">
        <SectionLabel index="00" title="Q &amp; A" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-ink/10 p-6 space-y-3">
              <div className="flex items-start gap-x-3">
                <span className="text-[11px] font-black text-violet shrink-0 mt-0.5">Q.</span>
                <p className="text-sm font-bold text-ink leading-snug">{faq.q}</p>
              </div>
              <div className="flex items-start gap-x-3 pt-3 border-t border-ink/5">
                <span className="text-[11px] font-black text-ink/25 shrink-0 mt-0.5">A.</span>
                <p className="text-xs text-ink/60 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 01 NEW ARRIVALS ─────────────────────────────────────────── */}
      <section className="space-y-6">
        <SectionLabel index="01" title="NEW ARRIVALS" />

        <Swiper
          slidesPerView={1.2}
          spaceBetween={20}
          speed={400}
          freeMode={{ enabled: true, momentum: true, momentumRatio: 0.9, momentumVelocityRatio: 1.0, momentumBounce: false }}
          mousewheel={{ sensitivity: 0.5, releaseOnEdges: true }}
          modules={[FreeMode, Mousewheel]}
          breakpoints={{
            640: { slidesPerView: 2.2, spaceBetween: 30 },
            1024: { slidesPerView: 3.2, spaceBetween: 40 },
          }}
        >
          {(newItems.length > 0 ? newItems : posts.map((p) => ({
            itemName: p.item,
            shopName: p.brand,
            itemPrice: 0,
            itemUrl: "#",
            mediumImageUrls: [],
            reviewAverage: 0,
          }))).map((item, i) => (
            <SwiperSlide key={i} className="pb-4">
              <a
                href={item.itemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group cursor-pointer block bg-white/40 border border-ink/5 p-6 transition-all duration-300 hover:border-ink/20"
              >
                <div className="flex justify-between text-[9px] font-mono text-ink/40 mb-4">
                  <span>{String(i + 1).padStart(3, "0")} // {item.shopName.toUpperCase().slice(0, 12)}</span>
                  <ArrowRight className="w-3 h-3 text-violet opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="aspect-3/4 bg-white mb-6 border border-ink/5 overflow-hidden flex items-center justify-center">
                  {item.mediumImageUrls[0] ? (
                    <img
                      src={hdImage(item.mediumImageUrls[0].imageUrl)}
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] text-ink/20 uppercase tracking-widest italic">
                      {item.shopName}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold tracking-wide text-ink line-clamp-2 leading-snug">
                    {item.itemName}
                  </h3>
                  {item.itemPrice > 0 && (
                    <p className="text-[10px] tracking-widest text-violet font-bold">
                      ¥{item.itemPrice.toLocaleString()}
                    </p>
                  )}
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ── 02 RECOMMENDED REVIEWS ──────────────────────────────────── */}
      <section className="space-y-6">
        <SectionLabel index="02" title="RECOMMENDED REVIEWS" />

        <Swiper
          slidesPerView={1.1}
          spaceBetween={20}
          speed={400}
          freeMode={{ enabled: true, momentum: true, momentumRatio: 0.9, momentumVelocityRatio: 1.0, momentumBounce: false }}
          mousewheel={{ sensitivity: 0.5, releaseOnEdges: true }}
          modules={[FreeMode, Mousewheel]}
          breakpoints={{
            768: { slidesPerView: 2.2, spaceBetween: 30 },
            1024: { slidesPerView: 3.2, spaceBetween: 30 },
          }}
        >
          {reviews.map((rev, i) => (
            <SwiperSlide key={i}>
              <div className="bg-white border border-ink/10 p-6 relative overflow-hidden h-50 flex flex-col justify-between shadow-sm">
                <div className="absolute top-0 right-0 w-16 h-16 bg-violet/5 rounded-bl-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-violet/30 translate-x-1 -translate-y-1" />
                </div>
                <div>
                  <div className="text-[9px] font-mono text-ink/40 mb-3 tracking-wider uppercase">
                    Reviewing: {rev.item}
                  </div>
                  <p className="text-xs leading-relaxed italic text-ink/80 line-clamp-3">
                    "{rev.text}"
                  </p>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="w-5 h-5 rounded-full bg-violet/10 border border-violet/20 flex items-center justify-center text-[9px] text-violet font-bold">
                    C
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-ink/70">
                    {rev.user}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ── 03 CATEGORIES ───────────────────────────────────────────── */}
      <section className="space-y-6">
        <SectionLabel index="03" title="RECOMMENDED CATEGORIES" />

        <Swiper
          slidesPerView={2.2}
          spaceBetween={15}
          speed={400}
          freeMode={{ enabled: true, momentum: true, momentumRatio: 0.9, momentumVelocityRatio: 1.0, momentumBounce: false }}
          mousewheel={{ sensitivity: 0.5, releaseOnEdges: true }}
          modules={[FreeMode, Mousewheel]}
          breakpoints={{
            640: { slidesPerView: 3.2, spaceBetween: 20 },
            1024: { slidesPerView: 4.5, spaceBetween: 25 },
          }}
        >
          {categories.map((cat, i) => (
            <SwiperSlide key={i}>
              <div className="group bg-white/30 border border-ink/5 hover:border-violet/30 p-4 transition-all cursor-pointer flex items-center gap-x-3">
                <div className="p-2 bg-white border border-ink/5 text-violet group-hover:bg-violet group-hover:text-white transition-colors shrink-0">
                  <Layers className="w-4 h-4 stroke-[1.5px]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold tracking-wider truncate group-hover:text-violet transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-[9px] text-ink/40 mt-0.5 truncate">{cat.desc}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ── 04 POPULAR RANKING ──────────────────────────────────────── */}
      <section className="space-y-6">
        <SectionLabel index="04" title="POPULAR RANKING" />

        <div className="space-y-3">
          {(rankingItems.length > 0 ? rankingItems : rankings.map((r, i) => ({
            rank: i + 1,
            itemName: r.name,
            shopName: r.brand,
            itemPrice: 0,
            itemUrl: "#",
            mediumImageUrls: [],
            reviewAverage: Number(r.rating),
          }))).map((item) => (
            <a
              key={item.rank}
              href={item.itemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-ink/10 p-5 flex items-center gap-x-5 shadow-sm hover:border-violet/20 transition-colors cursor-pointer block"
            >
              <div className="text-2xl font-black font-mono text-violet tracking-tighter w-10 text-center border-r border-ink/10 pr-3 shrink-0">
                {String(item.rank).padStart(2, "0")}
              </div>
              {item.mediumImageUrls[0] && (
                <img
                  src={hdImage(item.mediumImageUrls[0].imageUrl)}
                  alt={item.itemName}
                  className="w-12 h-12 object-cover shrink-0 border border-ink/5"
                />
              )}
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-mono text-ink/40 uppercase tracking-widest block truncate">
                  {item.shopName}
                </span>
                <h4 className="text-xs font-bold tracking-wide line-clamp-2 leading-snug mt-0.5">
                  {item.itemName}
                </h4>
                <div className="flex items-center gap-x-3 mt-1.5">
                  {item.reviewAverage > 0 && (
                    <div className="flex items-center gap-x-1">
                      <Award className="w-3 h-3 text-violet" />
                      <span className="text-[10px] font-bold text-ink/60">
                        {item.reviewAverage}
                      </span>
                    </div>
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
      </section>

      {/* ── 05 FEATURED CURATORS ────────────────────────────────────── */}
      <section className="space-y-6">
        <SectionLabel index="05" title="FEATURED CURATORS" />

        <Swiper
          slidesPerView={1.2}
          spaceBetween={20}
          speed={400}
          freeMode={{ enabled: true, momentum: true, momentumRatio: 0.9, momentumVelocityRatio: 1.0, momentumBounce: false }}
          mousewheel={{ sensitivity: 0.5, releaseOnEdges: true }}
          modules={[FreeMode, Mousewheel]}
          breakpoints={{
            640: { slidesPerView: 2.2, spaceBetween: 24 },
            1024: { slidesPerView: 3.2, spaceBetween: 30 },
          }}
        >
          {curators.map((c) => (
            <SwiperSlide key={c.id}>
              <div className="group cursor-grab active:cursor-grabbing bg-white border border-ink/10 p-6 space-y-5 hover:border-violet/20 transition-colors">

                {/* Header row */}
                <div className="flex justify-between items-start text-[9px] font-mono text-ink/30">
                  <span>{c.id} // {c.specialty.toUpperCase()}</span>
                  <ArrowRight className="w-3 h-3 text-violet opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Avatar */}
                <div className="flex flex-col items-center gap-y-3 py-2">
                  <div className="w-16 h-16 rounded-full bg-violet/10 border border-violet/20 overflow-hidden">
                    <Image
                      src={c.avatar}
                      alt={`@${c.handle}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold tracking-widest text-ink">@{c.handle}</p>
                    <p className="text-[9px] tracking-[0.3em] text-violet/70 uppercase mt-0.5">{c.specialty}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-around border-t border-b border-ink/5 py-3">
                  <div className="text-center">
                    <div className="text-base font-black font-mono text-ink">{c.items}</div>
                    <div className="text-[8px] tracking-[0.3em] uppercase text-ink/30 mt-0.5">Items</div>
                  </div>
                  <div className="w-px bg-ink/5" />
                  <div className="text-center">
                    <div className="text-base font-black font-mono text-ink">{c.followers}</div>
                    <div className="text-[8px] tracking-[0.3em] uppercase text-ink/30 mt-0.5">Followers</div>
                  </div>
                </div>

                {/* Brand tags */}
                <div className="flex flex-wrap gap-1.5">
                  {c.brands.map((brand) => (
                    <span
                      key={brand}
                      className="text-[8px] font-bold tracking-widest uppercase border border-ink/10 px-2 py-1 text-ink/50"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="border-t border-ink/10 pt-14 pb-8 space-y-8">

        {/* ロゴ＋ブランド名 */}
        <div className="flex items-center gap-x-3">
          <img src="/logo.png" alt="MY-COLE" className="w-10 h-10 object-contain mix-blend-multiply" />
          <span className="text-sm font-black tracking-[0.3em] text-ink uppercase">MY-COLE</span>
        </div>

        {/* タグライン */}
        <p className="text-xs text-ink/50 leading-relaxed max-w-sm">
          こだわりを、もっと楽しく。<br />
          あなたの愛用品をシェアして、価値観の近い人と繋がろう。
        </p>

        {/* SNS アイコン */}
        <div className="flex items-center gap-x-5">
          {/* X (Twitter) */}
          <a href="#" aria-label="X" className="text-ink/30 hover:text-ink transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          {/* Instagram */}
          <a href="#" aria-label="Instagram" className="text-ink/30 hover:text-ink transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
            </svg>
          </a>
          {/* TikTok */}
          <a href="#" aria-label="TikTok" className="text-ink/30 hover:text-ink transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.79 1.54V6.78a4.85 4.85 0 0 1-1.02-.09z" />
            </svg>
          </a>
          {/* YouTube */}
          <a href="#" aria-label="YouTube" className="text-ink/30 hover:text-ink transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
        </div>

        {/* フッターナビ */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/5 pt-6">
          {["サービスについて", "利用規約", "プライバシーポリシー", "特定商取引法に基づく表記", "お問い合わせ"].map((label) => (
            <a key={label} href="#" className="text-[10px] tracking-[0.2em] text-ink/40 hover:text-ink transition-colors">
              {label}
            </a>
          ))}
        </div>

        {/* コピーライト */}
        <p className="text-[9px] tracking-[0.4em] text-ink/20 uppercase">
          © 2026 MY-COLE All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-baseline gap-x-4">
      <span className="text-[10px] font-mono text-ink/30">{index} /</span>
      <h2 className="text-xs font-bold tracking-[0.3em] uppercase border-l-[3px] border-violet pl-3">
        {title}
      </h2>
    </div>
  );
}
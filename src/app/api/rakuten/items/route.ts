import https from "https";
import { NextResponse } from "next/server";

export async function GET() {
  const appId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  if (!appId || !accessKey) {
    return NextResponse.json(
      { error: "RAKUTEN_APP_ID or RAKUTEN_ACCESS_KEY is not set" },
      { status: 500 }
    );
  }

  // 時間帯ごとに異なるカテゴリをローテーション
  const KEYWORDS = [
    "フレグランス オードパルファム ブランド",
    "レザー 本革 財布 小物 ブランド",
    "北欧 インテリア デザイン 雑貨",
    "スニーカー レザーシューズ ブランド メンズ",
    "アロマ キャンドル ディフューザー ブランド",
    "メンズ シンプル Tシャツ カットソー ブランド",
    "レディース ミニマル ワンピース ブラウス ブランド",
  ];
  const keyword = KEYWORDS[Math.floor(Date.now() / (1000 * 60 * 60 * 4)) % KEYWORDS.length];

  const params = new URLSearchParams({
    applicationId: appId,
    accessKey: accessKey,
    hits: "6",
    sort: "-reviewCount",
    imageFlag: "1",
    minPrice: "3000",
    availability: "1",
    keyword,
  });

  const appUrl = process.env.APP_URL ?? "https://my-collect-mauve.vercel.app";

  return new Promise<NextResponse>((resolve) => {
    const req = https.get(
      {
        hostname: "openapi.rakuten.co.jp",
        path: `/ichibams/api/IchibaItem/Search/20260401?${params.toString()}`,
        headers: {
          Referer: appUrl,
          Origin: appUrl,
          "User-Agent": "Mozilla/5.0 (compatible; MY-COLE/1.0)",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk: Buffer) => { data += chunk; });
        res.on("end", () => {
          try {
            resolve(NextResponse.json(JSON.parse(data)));
          } catch {
            resolve(NextResponse.json({ error: "parse error", raw: data }, { status: 500 }));
          }
        });
      }
    );
    req.on("error", (err: Error) => {
      resolve(NextResponse.json({ error: err.message }, { status: 500 }));
    });
  });
}
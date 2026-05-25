import https from "https";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword") ?? "";

  if (!keyword.trim()) {
    return NextResponse.json({ Items: [] });
  }

  const appId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  if (!appId || !accessKey) {
    return NextResponse.json(
      { error: "RAKUTEN_APP_ID or RAKUTEN_ACCESS_KEY is not set" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    applicationId: appId,
    accessKey: accessKey,
    hits: "12",
    sort: "-reviewCount",
    imageFlag: "1",
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
            resolve(NextResponse.json({ error: "parse error" }, { status: 500 }));
          }
        });
      }
    );
    req.on("error", (err: Error) => {
      resolve(NextResponse.json({ error: err.message }, { status: 500 }));
    });
  });
}

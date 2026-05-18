import https from "https";
import { NextResponse } from "next/server";

export async function GET() {
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  return new Promise<NextResponse>((resolve) => {
    https.get(
      {
        hostname: "httpbin.org",
        path: "/headers",
        headers: {
          Referer: appUrl,
          "User-Agent": "MY-COLE/1.0",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk: Buffer) => { data += chunk; });
        res.on("end", () => {
          resolve(NextResponse.json({ sentAppUrl: appUrl, echo: JSON.parse(data) }));
        });
      }
    );
  });
}
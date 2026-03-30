/**
 * ビルド後にサイトマップを生成するスクリプト
 * npm run build の後に実行する
 */

import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-tool-navi.vercel.app";

async function main() {
  console.log("=== Generating Sitemap ===");

  const [
    { data: tools },
    { data: categories },
    { data: comparisons },
  ] = await Promise.all([
    supabase.from("tools").select("slug"),
    supabase.from("categories").select("slug"),
    supabase.from("comparisons").select("slug"),
  ]);

  const today = new Date().toISOString().split("T")[0];

  const urls: { loc: string; priority: string; changefreq: string }[] = [
    { loc: "/", priority: "1.0", changefreq: "daily" },
    { loc: "/categories", priority: "0.8", changefreq: "weekly" },
    { loc: "/blog", priority: "0.6", changefreq: "weekly" },
  ];

  for (const t of tools || []) {
    urls.push({ loc: `/tools/${t.slug}`, priority: "0.9", changefreq: "weekly" });
    urls.push({ loc: `/alternatives/${t.slug}`, priority: "0.7", changefreq: "monthly" });
  }

  for (const c of categories || []) {
    urls.push({ loc: `/categories/${c.slug}`, priority: "0.7", changefreq: "weekly" });
  }

  for (const comp of comparisons || []) {
    urls.push({ loc: `/compare/${comp.slug}`, priority: "0.8", changefreq: "monthly" });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  writeFileSync("out/sitemap.xml", xml);
  console.log(`Generated sitemap with ${urls.length} URLs.`);
}

main().catch(console.error);

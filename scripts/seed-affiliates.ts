/**
 * アフィリエイトリンクの初期登録スクリプト
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// アフィリエイト情報（実際のリンクは各ASPで発行後に更新する）
const affiliateData: {
  slug: string;
  affiliate_url: string;
  affiliate_program: string;
  commission_rate: string;
}[] = [
  {
    slug: "chatgpt",
    affiliate_url: "", // OpenAIアフィリエイト
    affiliate_program: "OpenAI",
    commission_rate: "20%",
  },
  {
    slug: "canva",
    affiliate_url: "", // Canvaアフィリエイト
    affiliate_program: "impact.com",
    commission_rate: "月額30%継続",
  },
  {
    slug: "jasper",
    affiliate_url: "", // Jasperアフィリエイト
    affiliate_program: "Jasper直接",
    commission_rate: "30%継続",
  },
  {
    slug: "copy-ai",
    affiliate_url: "", // Copy.aiアフィリエイト
    affiliate_program: "Copy.ai直接",
    commission_rate: "45%初年度",
  },
  {
    slug: "notion-ai",
    affiliate_url: "", // Notionアフィリエイト
    affiliate_program: "Notion",
    commission_rate: "50%初回",
  },
  {
    slug: "grammarly",
    affiliate_url: "", // Grammarlyアフィリエイト
    affiliate_program: "ShareASale",
    commission_rate: "$20/件",
  },
  {
    slug: "github-copilot",
    affiliate_url: "",
    affiliate_program: "Microsoft",
    commission_rate: "変動",
  },
  {
    slug: "cursor",
    affiliate_url: "",
    affiliate_program: "直接",
    commission_rate: "20%",
  },
];

async function main() {
  console.log("=== Seeding Affiliate Data ===");

  for (const aff of affiliateData) {
    const { error } = await supabase
      .from("tools")
      .update({
        affiliate_url: aff.affiliate_url || null,
        affiliate_program: aff.affiliate_program,
        commission_rate: aff.commission_rate,
      })
      .eq("slug", aff.slug);

    if (error) {
      console.error(`Failed: ${aff.slug}`, error.message);
    } else {
      console.log(`Updated: ${aff.slug}`);
    }
  }

  console.log("Done.");
}

main().catch(console.error);

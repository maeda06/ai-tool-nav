import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export interface ScrapedTool {
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory?: string;
  pricing_type: "free" | "freemium" | "paid";
  pricing_detail?: string;
  url: string;
  logo_url?: string;
  features?: string[];
  rating?: number;
  source: string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function upsertTools(tools: ScrapedTool[]) {
  const supabase = getSupabaseAdmin();

  for (const tool of tools) {
    const { error } = await supabase.from("tools").upsert(
      {
        slug: tool.slug,
        name: tool.name,
        description: tool.description,
        category: tool.category,
        subcategory: tool.subcategory || null,
        pricing_type: tool.pricing_type,
        pricing_detail: tool.pricing_detail || null,
        url: tool.url,
        logo_url: tool.logo_url || null,
        features: tool.features || [],
        rating: tool.rating || null,
        source: tool.source,
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error(`Failed to upsert ${tool.name}:`, error.message);
    } else {
      console.log(`Upserted: ${tool.name}`);
    }
  }

  // カテゴリのtool_countを更新
  const { data: categories } = await supabase
    .from("tools")
    .select("category");

  if (categories) {
    const counts: Record<string, number> = {};
    for (const t of categories) {
      counts[t.category] = (counts[t.category] || 0) + 1;
    }
    for (const [slug, count] of Object.entries(counts)) {
      await supabase
        .from("categories")
        .upsert(
          { slug, name: slug, tool_count: count },
          { onConflict: "slug" }
        );
    }
  }
}

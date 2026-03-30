/**
 * 人気ツール同士の比較記事をClaude APIで自動生成
 */

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// 同カテゴリの人気ツール同士で比較ペアを生成
async function getComparisonPairs() {
  const { data: tools } = await supabase
    .from("tools")
    .select("id, name, slug, category, description, features")
    .order("rating", { ascending: false, nullsFirst: false });

  if (!tools) return [];

  // カテゴリごとにグルーピング
  const byCategory: Record<string, typeof tools> = {};
  for (const tool of tools) {
    if (!byCategory[tool.category]) byCategory[tool.category] = [];
    byCategory[tool.category].push(tool);
  }

  const pairs: { a: (typeof tools)[0]; b: (typeof tools)[0] }[] = [];

  // 各カテゴリの上位ツール同士でペア作成
  for (const [, catTools] of Object.entries(byCategory)) {
    const top = catTools.slice(0, 5); // 上位5ツール
    for (let i = 0; i < top.length; i++) {
      for (let j = i + 1; j < top.length; j++) {
        pairs.push({ a: top[i], b: top[j] });
      }
    }
  }

  return pairs;
}

async function generateComparison(
  a: { id: string; name: string; slug: string; description: string; features: string[] },
  b: { id: string; name: string; slug: string; description: string; features: string[] }
) {
  const slug = `${a.slug}-vs-${b.slug}`;

  // 既存チェック
  const { data: existing } = await supabase
    .from("comparisons")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) {
    console.log(`  Skip (exists): ${slug}`);
    return;
  }

  console.log(`Generating: ${a.name} vs ${b.name}`);

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 3000,
    messages: [
      {
        role: "user",
        content: `以下の2つのAIツールを比較する記事を日本語で書いてください。

ツールA: ${a.name}
概要: ${a.description || "不明"}
機能: ${(a.features || []).join(", ") || "不明"}

ツールB: ${b.name}
概要: ${b.description || "不明"}
機能: ${(b.features || []).join(", ") || "不明"}

以下のJSON形式で返してください（JSONのみ）:
{
  "content": "1500文字程度のMarkdown形式の比較記事。## 見出しを使い、機能比較、料金比較、おすすめユーザー層、まとめを含む",
  "summary": "100文字程度の要約",
  "winner": "総合的におすすめのツール名（引き分けの場合は '用途による'）"
}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const parsed = JSON.parse(text);
    const { error } = await supabase.from("comparisons").insert({
      tool_a_id: a.id,
      tool_b_id: b.id,
      slug,
      content: parsed.content,
      summary: parsed.summary,
      winner: parsed.winner,
    });
    if (error) throw error;
    console.log(`  Created: ${slug}`);
  } catch (e) {
    console.error(`  Failed: ${slug}`, e);
  }
}

async function main() {
  console.log("=== Comparison Generation ===");

  const pairs = await getComparisonPairs();
  console.log(`Found ${pairs.length} comparison pairs.`);

  for (const { a, b } of pairs) {
    await generateComparison(a, b);
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log("Done.");
}

main().catch(console.error);

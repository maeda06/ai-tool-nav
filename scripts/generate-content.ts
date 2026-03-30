/**
 * Claude APIで各ツールの詳細説明・メリット・デメリットを自動生成
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

async function generateForTool(tool: {
  id: string;
  name: string;
  description: string;
  features: string[];
}) {
  console.log(`Generating content for: ${tool.name}`);

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `以下のAIツールについて、日本語で詳細な説明を書いてください。

ツール名: ${tool.name}
概要: ${tool.description || "不明"}
主な機能: ${(tool.features || []).join(", ") || "不明"}

以下のJSON形式で返してください（JSONのみ、他のテキストは不要）:
{
  "long_description": "500文字程度の詳細説明。ツールの特徴、使い方、向いているユーザー層を含む",
  "pros": ["メリット1", "メリット2", "メリット3", "メリット4"],
  "cons": ["デメリット1", "デメリット2", "デメリット3"],
  "features": ["機能1", "機能2", "機能3", "機能4", "機能5"]
}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const parsed = JSON.parse(text);
    await supabase
      .from("tools")
      .update({
        long_description: parsed.long_description,
        pros: parsed.pros,
        cons: parsed.cons,
        features: parsed.features,
      })
      .eq("id", tool.id);
    console.log(`  Updated: ${tool.name}`);
  } catch (e) {
    console.error(`  Failed to parse response for ${tool.name}:`, e);
  }
}

async function main() {
  console.log("=== Content Generation ===");

  // long_descriptionが未設定のツールを対象
  const { data: tools, error } = await supabase
    .from("tools")
    .select("id, name, description, features")
    .is("long_description", null)
    .limit(50);

  if (error) {
    console.error("Failed to fetch tools:", error);
    return;
  }

  if (!tools || tools.length === 0) {
    console.log("No tools to generate content for.");
    return;
  }

  console.log(`Found ${tools.length} tools without content.`);

  for (const tool of tools) {
    await generateForTool(tool);
    // Rate limit対策: 1秒待機
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log("Done.");
}

main().catch(console.error);

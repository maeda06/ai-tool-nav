import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function generateToolDescription(
  name: string,
  description: string,
  features: string[]
): Promise<{ long_description: string; pros: string[]; cons: string[] }> {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `以下のAIツールについて、日本語で詳細な説明を書いてください。

ツール名: ${name}
概要: ${description}
主な機能: ${features.join(", ")}

以下のJSON形式で返してください:
{
  "long_description": "500文字程度の詳細説明",
  "pros": ["メリット1", "メリット2", "メリット3"],
  "cons": ["デメリット1", "デメリット2"]
}

JSONのみを返してください。`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  return JSON.parse(text);
}

export async function generateComparisonContent(
  toolA: { name: string; description: string; features: string[] },
  toolB: { name: string; description: string; features: string[] }
): Promise<{ content: string; summary: string; winner: string }> {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 3000,
    messages: [
      {
        role: "user",
        content: `以下の2つのAIツールを比較する記事を日本語で書いてください。

ツールA: ${toolA.name}
概要: ${toolA.description}
機能: ${toolA.features.join(", ")}

ツールB: ${toolB.name}
概要: ${toolB.description}
機能: ${toolB.features.join(", ")}

以下のJSON形式で返してください:
{
  "content": "1500文字程度の比較記事（Markdown形式）。機能比較、料金比較、おすすめユーザー層を含む",
  "summary": "100文字程度の要約",
  "winner": "総合的におすすめのツール名"
}

JSONのみを返してください。`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  return JSON.parse(text);
}

export async function generateAlternativesContent(
  toolName: string,
  alternatives: { name: string; description: string }[]
): Promise<string> {
  const altList = alternatives
    .map((a) => `- ${a.name}: ${a.description}`)
    .join("\n");

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `「${toolName}」の代替ツールを紹介する記事を日本語で書いてください。Markdown形式で1000文字程度。

代替ツール一覧:
${altList}

各ツールの特徴と、どんなユーザーにおすすめかを含めてください。
Markdownのみを返してください。`,
      },
    ],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}

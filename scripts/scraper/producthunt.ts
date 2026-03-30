/**
 * Product Hunt APIからAIツールを取得するスクレイパー
 *
 * Product Hunt GraphQL API (v2)を利用
 * API Token: https://www.producthunt.com/v2/oauth/applications で取得
 */

import { slugify, upsertTools, type ScrapedTool } from "./common";

const PH_API_URL = "https://api.producthunt.com/v2/api/graphql";
const PH_TOKEN = process.env.PRODUCTHUNT_TOKEN;

interface PHNode {
  name: string;
  tagline: string;
  url: string;
  website: string;
  thumbnail?: { url: string };
  topics?: { edges: { node: { name: string } }[] };
  votesCount: number;
}

const categoryMap: Record<string, string> = {
  "Artificial Intelligence": "ai-general",
  "Writing": "writing",
  "Developer Tools": "coding",
  "Design Tools": "image-generation",
  "Productivity": "productivity",
  "Marketing": "marketing",
  "Education": "education",
  "ChatGPT": "chatbot",
  "Video": "video",
  "Audio": "audio",
};

function mapCategory(topics: string[]): string {
  for (const topic of topics) {
    if (categoryMap[topic]) return categoryMap[topic];
  }
  return "ai-general";
}

async function fetchAIProducts(): Promise<PHNode[]> {
  if (!PH_TOKEN) {
    console.log("PRODUCTHUNT_TOKEN not set. Using seed data instead.");
    return [];
  }

  const query = `
    query {
      posts(
        topic: "artificial-intelligence"
        order: VOTES
        first: 50
      ) {
        edges {
          node {
            name
            tagline
            url
            website
            thumbnail { url }
            topics(first: 5) { edges { node { name } } }
            votesCount
          }
        }
      }
    }
  `;

  const res = await fetch(PH_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PH_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    console.error("Product Hunt API error:", res.status);
    return [];
  }

  const json = await res.json();
  return json.data?.posts?.edges?.map((e: { node: PHNode }) => e.node) || [];
}

async function main() {
  console.log("=== Product Hunt Scraper ===");

  const products = await fetchAIProducts();

  if (products.length === 0) {
    console.log("No products fetched. Make sure PRODUCTHUNT_TOKEN is set.");
    return;
  }

  const tools: ScrapedTool[] = products.map((p) => {
    const topics =
      p.topics?.edges?.map((e) => e.node.name) || [];
    return {
      name: p.name,
      slug: slugify(p.name),
      description: p.tagline,
      category: mapCategory(topics),
      pricing_type: "freemium" as const,
      url: p.website || p.url,
      logo_url: p.thumbnail?.url,
      rating: Math.min(5, Math.round((p.votesCount / 200) * 10) / 10),
      source: "producthunt",
    };
  });

  await upsertTools(tools);
  console.log(`Done. Processed ${tools.length} tools.`);
}

main().catch(console.error);

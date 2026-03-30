import { getSupabase } from "./supabase";
import type { Tool, Category, Comparison } from "@/types/tool";

// Supabase未設定時のダミーデータ
const DEMO_TOOLS: Tool[] = [
  {
    id: "1", slug: "chatgpt", name: "ChatGPT", description: "OpenAIが開発した大規模言語モデルベースのAIチャットボット",
    long_description: "ChatGPTは、OpenAIが開発した対話型AIです。自然な日本語での会話、文章作成、翻訳、プログラミング支援など幅広いタスクに対応します。GPT-4oモデルでは画像認識やファイル分析も可能で、プラグインによる機能拡張もサポートしています。無料プランでも基本的な機能が使え、Plus（月額$20）でより高性能なモデルにアクセスできます。",
    category: "chatbot", subcategory: null, pricing_type: "freemium", pricing_detail: "無料プラン / Plus $20/月 / Team $25/月",
    url: "https://chat.openai.com", affiliate_url: null, affiliate_program: null, commission_rate: null,
    logo_url: null, features: ["自然言語対話", "文章作成・要約", "コード生成", "画像認識", "プラグイン拡張"],
    pros: ["日本語対応が優秀", "幅広いタスクに対応", "無料プランあり", "豊富なプラグイン"],
    cons: ["情報の正確性に注意が必要", "無料プランは機能制限あり", "長文で精度が落ちることがある"],
    rating: 4.8, source: "seed", created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "2", slug: "claude", name: "Claude", description: "Anthropicが開発した安全性を重視したAIアシスタント",
    long_description: "Claudeは、Anthropicが開発した対話型AIアシスタントです。安全性と正確性を重視した設計が特徴で、長文の理解・要約、コーディング支援、分析タスクに優れています。200Kトークンの長いコンテキストウィンドウにより、長い文書の一括処理が可能です。",
    category: "chatbot", subcategory: null, pricing_type: "freemium", pricing_detail: "無料プラン / Pro $20/月",
    url: "https://claude.ai", affiliate_url: null, affiliate_program: null, commission_rate: null,
    logo_url: null, features: ["長文理解・要約", "コーディング支援", "安全性重視の設計", "200Kコンテキスト", "ファイル分析"],
    pros: ["安全性が高い", "長文処理に強い", "日本語の品質が高い"],
    cons: ["リアルタイム情報なし", "画像生成非対応"],
    rating: 4.7, source: "seed", created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "3", slug: "midjourney", name: "Midjourney", description: "高品質な画像を生成できるAIアートツール",
    long_description: null, category: "image-generation", subcategory: null, pricing_type: "paid",
    pricing_detail: "Basic $10/月 / Standard $30/月", url: "https://www.midjourney.com",
    affiliate_url: null, affiliate_program: null, commission_rate: null, logo_url: null,
    features: ["高品質画像生成", "スタイル指定", "アップスケール", "バリエーション生成"],
    pros: ["画質が非常に高い", "アート性に優れる"], cons: ["無料プランなし", "Discord経由の操作"],
    rating: 4.6, source: "seed", created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "4", slug: "github-copilot", name: "GitHub Copilot", description: "AIがコード補完・生成を支援するプログラミングアシスタント",
    long_description: null, category: "coding", subcategory: null, pricing_type: "paid",
    pricing_detail: "Individual $10/月 / Business $19/月", url: "https://github.com/features/copilot",
    affiliate_url: null, affiliate_program: null, commission_rate: null, logo_url: null,
    features: ["コード補完", "コード生成", "チャット機能", "多言語対応"],
    pros: ["IDE統合が優秀", "生産性が大幅向上"], cons: ["月額料金が必要", "コード品質にばらつき"],
    rating: 4.5, source: "seed", created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "5", slug: "cursor", name: "Cursor", description: "AIファーストのコードエディタ",
    long_description: null, category: "coding", subcategory: null, pricing_type: "freemium",
    pricing_detail: "Hobby 無料 / Pro $20/月", url: "https://cursor.sh",
    affiliate_url: null, affiliate_program: null, commission_rate: null, logo_url: null,
    features: ["AIコード生成", "コードベース理解", "マルチファイル編集", "チャット機能"],
    pros: ["AIネイティブ設計", "VS Code互換"], cons: ["大規模プロジェクトで重い場合あり"],
    rating: 4.5, source: "seed", created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "6", slug: "canva", name: "Canva", description: "AIデザイン機能を備えたオンラインデザインツール",
    long_description: null, category: "image-generation", subcategory: null, pricing_type: "freemium",
    pricing_detail: "無料 / Pro ¥1,000/月", url: "https://www.canva.com",
    affiliate_url: null, affiliate_program: "impact.com", commission_rate: "月額30%継続",
    logo_url: null, features: ["テンプレート豊富", "AI画像生成", "チーム共有", "動画編集"],
    pros: ["初心者に優しい", "テンプレートが豊富", "無料でも十分使える"],
    cons: ["高度な編集は制限あり"],
    rating: 4.7, source: "seed", created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "7", slug: "notion-ai", name: "Notion AI", description: "Notion内でAIが文章作成・要約・翻訳を支援",
    long_description: null, category: "productivity", subcategory: null, pricing_type: "paid",
    pricing_detail: "メンバーあたり $10/月（追加）", url: "https://www.notion.so/product/ai",
    affiliate_url: null, affiliate_program: null, commission_rate: null, logo_url: null,
    features: ["文章作成", "要約", "翻訳", "Q&A", "Notion統合"],
    pros: ["Notionとシームレス連携", "ワークフロー内で使える"],
    cons: ["Notion契約が前提", "追加料金が必要"],
    rating: 4.3, source: "seed", created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "8", slug: "perplexity", name: "Perplexity", description: "AI搭載の検索エンジン。情報源を明示した回答を提供",
    long_description: null, category: "research", subcategory: null, pricing_type: "freemium",
    pricing_detail: "無料 / Pro $20/月", url: "https://www.perplexity.ai",
    affiliate_url: null, affiliate_program: null, commission_rate: null, logo_url: null,
    features: ["AI検索", "ソース引用", "フォローアップ質問", "ファイル分析"],
    pros: ["情報源が明確", "最新情報に対応"], cons: ["日本語検索の精度がやや劣る"],
    rating: 4.4, source: "seed", created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "9", slug: "elevenlabs", name: "ElevenLabs", description: "高品質なAI音声合成・音声クローニングツール",
    long_description: null, category: "audio", subcategory: null, pricing_type: "freemium",
    pricing_detail: "無料 / Starter $5/月", url: "https://elevenlabs.io",
    affiliate_url: null, affiliate_program: null, commission_rate: null, logo_url: null,
    features: ["音声合成", "音声クローニング", "多言語対応", "API提供"],
    pros: ["音声品質が高い", "日本語対応"], cons: ["無料枠が少ない"],
    rating: 4.4, source: "seed", created_at: "2026-01-01", updated_at: "2026-01-01",
  },
];

const DEMO_CATEGORIES: Category[] = [
  { id: "1", slug: "chatbot", name: "AIチャットボット", description: "対話型AIアシスタント", icon: "💬", tool_count: 3 },
  { id: "2", slug: "image-generation", name: "画像生成AI", description: "AIによる画像・デザイン生成", icon: "🎨", tool_count: 3 },
  { id: "3", slug: "coding", name: "コーディングAI", description: "プログラミング支援AI", icon: "💻", tool_count: 2 },
  { id: "4", slug: "productivity", name: "生産性向上AI", description: "業務効率化AIツール", icon: "⚡", tool_count: 1 },
  { id: "5", slug: "writing", name: "文章作成AI", description: "AIライティングツール", icon: "✍️", tool_count: 0 },
  { id: "6", slug: "video", name: "動画AI", description: "AI動画生成・編集", icon: "🎬", tool_count: 0 },
  { id: "7", slug: "audio", name: "音声AI", description: "AI音声合成・編集", icon: "🎵", tool_count: 1 },
  { id: "8", slug: "research", name: "リサーチAI", description: "AI検索・調査ツール", icon: "🔬", tool_count: 1 },
];

const DEMO_COMPARISONS: (Comparison & { tool_a: Tool; tool_b: Tool })[] = [
  {
    id: "1", tool_a_id: "1", tool_b_id: "2", slug: "chatgpt-vs-claude",
    content: "## 機能比較\n\nChatGPTとClaudeはどちらも高性能な対話型AIですが、それぞれに特徴があります。\n\n### ChatGPTの強み\n- プラグインエコシステムが充実\n- 画像生成（DALL-E）統合\n- GPTsによるカスタマイズ\n\n### Claudeの強み\n- 長文処理能力（200Kトークン）\n- 安全性重視の設計\n- 日本語の自然さ\n\n## 料金比較\n\n両者とも無料プランを提供していますが、有料プランはどちらも月額$20です。\n\n## おすすめユーザー\n\n- **ChatGPT**: 多機能を求めるユーザー、プラグインを活用したいユーザー\n- **Claude**: 長文処理が多いユーザー、安全性を重視するユーザー",
    summary: "ChatGPTは多機能性、Claudeは長文処理と安全性が強み。用途に応じて選択を。",
    winner: "用途による", generated_at: "2026-01-01",
    tool_a: DEMO_TOOLS[0], tool_b: DEMO_TOOLS[1],
  },
];

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && url !== "your_supabase_url" && url.startsWith("http");
}

export async function getAllTools(): Promise<Tool[]> {
  if (!isSupabaseConfigured()) return DEMO_TOOLS;
  const { data, error } = await getSupabase()
    .from("tools").select("*")
    .order("rating", { ascending: false, nullsFirst: false });
  if (error) return DEMO_TOOLS;
  return data || [];
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  if (!isSupabaseConfigured()) return DEMO_TOOLS.find((t) => t.slug === slug) || null;
  const { data, error } = await getSupabase()
    .from("tools").select("*").eq("slug", slug).single();
  if (error) return null;
  return data;
}

export async function getToolsByCategory(category: string): Promise<Tool[]> {
  if (!isSupabaseConfigured()) return DEMO_TOOLS.filter((t) => t.category === category);
  const { data, error } = await getSupabase()
    .from("tools").select("*").eq("category", category)
    .order("rating", { ascending: false, nullsFirst: false });
  if (error) return [];
  return data || [];
}

export async function getAllCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return DEMO_CATEGORIES;
  const { data, error } = await getSupabase()
    .from("categories").select("*")
    .order("tool_count", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isSupabaseConfigured()) return DEMO_CATEGORIES.find((c) => c.slug === slug) || null;
  const { data, error } = await getSupabase()
    .from("categories").select("*").eq("slug", slug).single();
  if (error) return null;
  return data;
}

export async function getComparison(slug: string): Promise<(Comparison & { tool_a: Tool; tool_b: Tool }) | null> {
  if (!isSupabaseConfigured()) return DEMO_COMPARISONS.find((c) => c.slug === slug) || null;
  const { data, error } = await getSupabase()
    .from("comparisons")
    .select("*, tool_a:tools!tool_a_id(*), tool_b:tools!tool_b_id(*)")
    .eq("slug", slug).single();
  if (error) return null;
  return data;
}

export async function getAllComparisons(): Promise<Comparison[]> {
  if (!isSupabaseConfigured()) return DEMO_COMPARISONS;
  const { data, error } = await getSupabase()
    .from("comparisons")
    .select("*, tool_a:tools!tool_a_id(name, slug), tool_b:tools!tool_b_id(name, slug)");
  if (error) return [];
  return data || [];
}

export async function getAlternatives(slug: string): Promise<Tool[]> {
  if (!isSupabaseConfigured()) {
    const tool = DEMO_TOOLS.find((t) => t.slug === slug);
    if (!tool) return [];
    return DEMO_TOOLS.filter((t) => t.category === tool.category && t.slug !== slug);
  }
  const tool = await getToolBySlug(slug);
  if (!tool) return [];
  const { data, error } = await getSupabase()
    .from("tools").select("*").eq("category", tool.category).neq("slug", slug)
    .order("rating", { ascending: false, nullsFirst: false }).limit(10);
  if (error) return [];
  return data || [];
}

export async function getPopularTools(limit = 20): Promise<Tool[]> {
  if (!isSupabaseConfigured()) return DEMO_TOOLS.slice(0, limit);
  const { data, error } = await getSupabase()
    .from("tools").select("*")
    .order("rating", { ascending: false, nullsFirst: false }).limit(limit);
  if (error) return [];
  return data || [];
}

export async function getAllToolSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return DEMO_TOOLS.map((t) => t.slug);
  const { data, error } = await getSupabase().from("tools").select("slug");
  if (error) return [];
  return (data || []).map((d) => d.slug);
}

export async function getAllComparisonSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return DEMO_COMPARISONS.map((c) => c.slug);
  const { data, error } = await getSupabase().from("comparisons").select("slug");
  if (error) return [];
  return (data || []).map((d) => d.slug);
}

export async function getAllCategorySlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return DEMO_CATEGORIES.map((c) => c.slug);
  const { data, error } = await getSupabase().from("categories").select("slug");
  if (error) return [];
  return (data || []).map((d) => d.slug);
}

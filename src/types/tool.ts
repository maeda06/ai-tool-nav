export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  long_description: string | null;
  category: string;
  subcategory: string | null;
  pricing_type: "free" | "freemium" | "paid";
  pricing_detail: string | null;
  url: string;
  affiliate_url: string | null;
  affiliate_program: string | null;
  commission_rate: string | null;
  logo_url: string | null;
  features: string[] | null;
  pros: string[] | null;
  cons: string[] | null;
  rating: number | null;
  source: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  tool_count: number;
}

export interface Comparison {
  id: string;
  tool_a_id: string;
  tool_b_id: string;
  slug: string;
  content: string | null;
  summary: string | null;
  winner: string | null;
  generated_at: string;
  tool_a?: Tool;
  tool_b?: Tool;
}

export interface AffiliateClick {
  id: string;
  tool_id: string;
  page_type: "tool" | "compare" | "alternative";
  page_slug: string;
  clicked_at: string;
}

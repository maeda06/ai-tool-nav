"use client";

import { getSupabase } from "@/lib/supabase";
import type { Tool } from "@/types/tool";

interface Props {
  tool: Tool;
  pageType: "tool" | "compare" | "alternative";
  pageSlug: string;
}

export default function AffiliateButton({ tool, pageType, pageSlug }: Props) {
  const handleClick = async () => {
    try {
      await getSupabase().from("affiliate_clicks").insert({
        tool_id: tool.id,
        page_type: pageType,
        page_slug: pageSlug,
      });
    } catch {
      // トラッキング失敗は無視
    }
  };

  const url = tool.affiliate_url || tool.url;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={handleClick}
      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
    >
      {tool.name}を試してみる
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  );
}

import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/seo";

export const metadata: Metadata = genMeta({
  title: "AIツールブログ - 最新情報・活用術",
  description:
    "AIツールの最新情報、活用術、比較まとめ記事をお届けします。",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">ブログ</h1>
      <p className="text-gray-600 mb-8">
        AIツールの最新情報、活用術、比較まとめ記事をお届けします。
      </p>
      <div className="text-center py-12 text-gray-500">
        <p>記事を準備中です。</p>
      </div>
    </div>
  );
}

import { getAllCategories } from "@/lib/data";
import { generateMetadata as genMeta } from "@/lib/seo";
import CategoryNav from "@/components/CategoryNav";
import type { Metadata } from "next";

export const metadata: Metadata = genMeta({
  title: "AIツール カテゴリ一覧",
  description:
    "AIツールをカテゴリ別に探せます。文章作成、画像生成、コーディング、生産性向上など多数のカテゴリから最適なツールを見つけましょう。",
  path: "/categories",
});

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">カテゴリ一覧</h1>
      <p className="text-gray-600 mb-8">
        AIツールをカテゴリ別に探せます。
      </p>
      <CategoryNav categories={categories} />
    </div>
  );
}

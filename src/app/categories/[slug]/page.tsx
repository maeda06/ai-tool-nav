import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getToolsByCategory,
  getAllCategorySlugs,
} from "@/lib/data";
import { generateMetadata as genMeta } from "@/lib/seo";
import ToolCard from "@/components/ToolCard";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return genMeta({
    title: `${category.name} AIツール一覧【2026年おすすめ】`,
    description:
      category.description ||
      `${category.name}のAIツールを比較・検索できます。`,
    path: `/categories/${slug}`,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const tools = await getToolsByCategory(slug);

  return (
    <div>
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-blue-600">
          ホーム
        </a>
        {" > "}
        <a href="/categories" className="hover:text-blue-600">
          カテゴリ
        </a>
        {" > "}
        <span className="text-gray-900">{category.name}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      <p className="text-gray-600 mb-8">
        {category.description ||
          `${category.name}のAIツール${tools.length}件を比較できます。`}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>このカテゴリにはまだツールが登録されていません。</p>
        </div>
      )}
    </div>
  );
}

import { notFound } from "next/navigation";
import { getToolBySlug, getAllToolSlugs, getAlternatives } from "@/lib/data";
import { generateMetadata as genMeta } from "@/lib/seo";
import ToolCard from "@/components/ToolCard";
import AffiliateButton from "@/components/AffiliateButton";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllToolSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return {};
  return genMeta({
    title: `${tool.name}の代替ツール・類似サービス【2026年版】`,
    description: `${tool.name}の代わりに使えるAIツールを紹介。無料・有料の代替サービスを比較できます。`,
    path: `/alternatives/${slug}`,
    ogType: "article",
  });
}

export default async function AlternativesPage({ params }: Props) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) notFound();

  const alternatives = await getAlternatives(slug);

  return (
    <div>
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-blue-600">
          ホーム
        </a>
        {" > "}
        <a href={`/tools/${slug}`} className="hover:text-blue-600">
          {tool.name}
        </a>
        {" > "}
        <span className="text-gray-900">代替ツール</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">
        {tool.name}の代替ツール・類似サービス
      </h1>
      <p className="text-gray-600 mb-8">
        {tool.name}の代わりに使えるAIツール{alternatives.length}
        件を紹介します。
      </p>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          {tool.logo_url ? (
            <img
              src={tool.logo_url}
              alt={tool.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
              {tool.name.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="font-semibold">{tool.name}</h2>
            <p className="text-sm text-gray-600">{tool.description}</p>
          </div>
        </div>
        <AffiliateButton
          tool={tool}
          pageType="alternative"
          pageSlug={slug}
        />
      </div>

      <h2 className="text-xl font-bold mb-6">
        代替ツール一覧（{alternatives.length}件）
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alternatives.map((alt) => (
          <ToolCard key={alt.id} tool={alt} />
        ))}
      </div>

      {alternatives.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>代替ツールが見つかりませんでした。</p>
        </div>
      )}
    </div>
  );
}

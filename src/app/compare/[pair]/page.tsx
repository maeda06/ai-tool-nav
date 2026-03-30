import { notFound } from "next/navigation";
import { getComparison, getAllComparisonSlugs } from "@/lib/data";
import { generateMetadata as genMeta, generateComparisonJsonLd } from "@/lib/seo";
import ComparisonTable from "@/components/ComparisonTable";
import AffiliateButton from "@/components/AffiliateButton";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ pair: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllComparisonSlugs();
  return slugs.map((pair) => ({ pair }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const comparison = await getComparison(pair);
  if (!comparison) return {};
  return genMeta({
    title: `${comparison.tool_a.name} vs ${comparison.tool_b.name} 徹底比較【2026年最新】`,
    description:
      comparison.summary ||
      `${comparison.tool_a.name}と${comparison.tool_b.name}を料金・機能・使いやすさで徹底比較。`,
    path: `/compare/${pair}`,
    ogType: "article",
  });
}

export default async function ComparePage({ params }: Props) {
  const { pair } = await params;
  const comparison = await getComparison(pair);
  if (!comparison) notFound();

  const { tool_a, tool_b } = comparison;
  const jsonLd = generateComparisonJsonLd(
    tool_a.name,
    tool_b.name,
    comparison.summary || ""
  );

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-blue-600">
          ホーム
        </a>
        {" > "}
        <span className="text-gray-900">
          {tool_a.name} vs {tool_b.name}
        </span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">
        {tool_a.name} vs {tool_b.name} 徹底比較
      </h1>
      <p className="text-gray-600 mb-8">
        {tool_a.name}と{tool_b.name}の料金・機能・使いやすさを比較します。
      </p>

      {comparison.winner && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h2 className="font-bold text-lg mb-2">総合おすすめ</h2>
          <p className="text-gray-700">
            総合的には<span className="font-bold text-blue-600">{comparison.winner}</span>がおすすめです。
          </p>
          {comparison.summary && (
            <p className="text-sm text-gray-600 mt-2">{comparison.summary}</p>
          )}
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">比較表</h2>
        <ComparisonTable toolA={tool_a} toolB={tool_b} />
      </section>

      {comparison.content && (
        <section className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-bold mb-4">詳しい比較</h2>
          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
            {comparison.content}
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <h3 className="font-bold text-lg mb-4">{tool_a.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{tool_a.description}</p>
          <AffiliateButton tool={tool_a} pageType="compare" pageSlug={pair} />
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <h3 className="font-bold text-lg mb-4">{tool_b.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{tool_b.description}</p>
          <AffiliateButton tool={tool_b} pageType="compare" pageSlug={pair} />
        </div>
      </section>
    </div>
  );
}

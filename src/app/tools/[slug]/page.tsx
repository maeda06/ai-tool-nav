import { notFound } from "next/navigation";
import { getToolBySlug, getAllToolSlugs, getAlternatives } from "@/lib/data";
import { generateMetadata as genMeta } from "@/lib/seo";
import { generateToolJsonLd } from "@/lib/seo";
import AffiliateButton from "@/components/AffiliateButton";
import ToolCard from "@/components/ToolCard";
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
    title: `${tool.name} - 料金・機能・評判`,
    description:
      tool.description || `${tool.name}の料金、機能、評判を徹底解説。`,
    path: `/tools/${slug}`,
    ogType: "article",
  });
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) notFound();

  const alternatives = await getAlternatives(slug);
  const jsonLd = generateToolJsonLd(tool);

  const pricingLabel: Record<string, string> = {
    free: "無料",
    freemium: "フリーミアム",
    paid: "有料",
  };

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
        <a
          href={`/categories/${tool.category}`}
          className="hover:text-blue-600"
        >
          {tool.category}
        </a>
        {" > "}
        <span className="text-gray-900">{tool.name}</span>
      </nav>

      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
        <div className="flex items-start gap-6 mb-6">
          {tool.logo_url ? (
            <img
              src={tool.logo_url}
              alt={tool.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
              {tool.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold mb-2">{tool.name}</h1>
            <p className="text-gray-600 text-lg">{tool.description}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                {pricingLabel[tool.pricing_type] || tool.pricing_type}
              </span>
              {tool.rating && (
                <span className="text-sm">
                  <span className="text-yellow-500">★</span> {tool.rating}
                </span>
              )}
            </div>
          </div>
        </div>

        <AffiliateButton tool={tool} pageType="tool" pageSlug={slug} />
      </div>

      {tool.long_description && (
        <section className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-bold mb-4">{tool.name}とは？</h2>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {tool.long_description}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {tool.features && tool.features.length > 0 && (
          <section className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-xl font-bold mb-4">主な機能</h2>
            <ul className="space-y-2">
              {tool.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">●</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="space-y-8">
          {tool.pros && tool.pros.length > 0 && (
            <section className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-bold mb-4 text-green-700">
                メリット
              </h2>
              <ul className="space-y-2">
                {tool.pros.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-green-700">
                    <span className="mt-0.5">✓</span>
                    <span className="text-gray-700">{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tool.cons && tool.cons.length > 0 && (
            <section className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-bold mb-4 text-red-700">
                デメリット
              </h2>
              <ul className="space-y-2">
                {tool.cons.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-red-700">
                    <span className="mt-0.5">✗</span>
                    <span className="text-gray-700">{c}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      {tool.pricing_detail && (
        <section className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-bold mb-4">料金プラン</h2>
          <p className="text-gray-700">{tool.pricing_detail}</p>
        </section>
      )}

      {alternatives.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {tool.name}の代替ツール
            </h2>
            <a
              href={`/alternatives/${slug}`}
              className="text-blue-600 text-sm hover:underline"
            >
              すべて見る →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alternatives.slice(0, 6).map((alt) => (
              <ToolCard key={alt.id} tool={alt} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

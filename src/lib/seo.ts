import type { Metadata } from "next";

const SITE_NAME = "AIツールナビ";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-tool-navi.vercel.app";

export function generateMetadata({
  title,
  description,
  path,
  ogType = "website",
}: {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: ogType,
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateToolJsonLd(tool: {
  name: string;
  description: string | null;
  rating: number | null;
  url: string;
  pricing_type: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: tool.url,
    applicationCategory: "AI Tool",
    offers: {
      "@type": "Offer",
      price: tool.pricing_type === "free" ? "0" : undefined,
      priceCurrency: "USD",
    },
    ...(tool.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: tool.rating,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

export function generateComparisonJsonLd(
  toolA: string,
  toolB: string,
  description: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${toolA} vs ${toolB} 徹底比較`,
    description,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

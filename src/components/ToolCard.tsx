import type { Tool } from "@/types/tool";

const pricingLabel: Record<string, { text: string; color: string }> = {
  free: { text: "無料", color: "bg-green-100 text-green-800" },
  freemium: { text: "フリーミアム", color: "bg-blue-100 text-blue-800" },
  paid: { text: "有料", color: "bg-orange-100 text-orange-800" },
};

export default function ToolCard({ tool }: { tool: Tool }) {
  const pricing = pricingLabel[tool.pricing_type] || pricingLabel.paid;

  return (
    <a
      href={`/tools/${tool.slug}`}
      className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
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
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {tool.name}
            </h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${pricing.color}`}
            >
              {pricing.text}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {tool.description}
          </p>
          {tool.rating && (
            <div className="mt-2 flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="text-sm font-medium">{tool.rating}</span>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

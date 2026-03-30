import type { Category } from "@/types/tool";

const defaultIcons: Record<string, string> = {
  writing: "✍️",
  "image-generation": "🎨",
  coding: "💻",
  productivity: "⚡",
  video: "🎬",
  audio: "🎵",
  chatbot: "💬",
  marketing: "📢",
  education: "📚",
  research: "🔬",
};

export default function CategoryNav({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {categories.map((cat) => (
        <a
          key={cat.slug}
          href={`/categories/${cat.slug}`}
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm hover:border-blue-300 transition-all"
        >
          <span className="text-2xl">
            {cat.icon || defaultIcons[cat.slug] || "🤖"}
          </span>
          <div>
            <div className="font-medium text-sm">{cat.name}</div>
            <div className="text-xs text-gray-500">{cat.tool_count}件</div>
          </div>
        </a>
      ))}
    </div>
  );
}

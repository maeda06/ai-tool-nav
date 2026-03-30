import { getPopularTools, getAllCategories } from "@/lib/data";
import ToolCard from "@/components/ToolCard";
import CategoryNav from "@/components/CategoryNav";
import SearchBar from "@/components/SearchBar";

export default async function HomePage() {
  const [tools, categories] = await Promise.all([
    getPopularTools(20),
    getAllCategories(),
  ]);

  return (
    <div>
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">
          最適なAIツールが見つかる
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          300以上のAIツールを比較・検索。料金・機能・評判で最適なツールを見つけよう
        </p>
        <SearchBar />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">カテゴリから探す</h2>
        <CategoryNav categories={categories} />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">人気のAIツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}

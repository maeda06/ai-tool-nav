import type { Tool } from "@/types/tool";

interface Props {
  toolA: Tool;
  toolB: Tool;
}

export default function ComparisonTable({ toolA, toolB }: Props) {
  const pricingLabel: Record<string, string> = {
    free: "無料",
    freemium: "フリーミアム",
    paid: "有料",
  };

  const rows: { label: string; a: string; b: string }[] = [
    {
      label: "料金タイプ",
      a: pricingLabel[toolA.pricing_type] || toolA.pricing_type,
      b: pricingLabel[toolB.pricing_type] || toolB.pricing_type,
    },
    {
      label: "料金詳細",
      a: toolA.pricing_detail || "-",
      b: toolB.pricing_detail || "-",
    },
    {
      label: "カテゴリ",
      a: toolA.category,
      b: toolB.category,
    },
    {
      label: "評価",
      a: toolA.rating ? `★ ${toolA.rating}` : "-",
      b: toolB.rating ? `★ ${toolB.rating}` : "-",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-500 w-1/4">
              項目
            </th>
            <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-900 w-[37.5%]">
              {toolA.name}
            </th>
            <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-900 w-[37.5%]">
              {toolB.name}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
                {row.label}
              </td>
              <td className="border border-gray-200 px-4 py-3 text-sm text-center">
                {row.a}
              </td>
              <td className="border border-gray-200 px-4 py-3 text-sm text-center">
                {row.b}
              </td>
            </tr>
          ))}
          <tr>
            <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
              主な機能
            </td>
            <td className="border border-gray-200 px-4 py-3 text-sm">
              <ul className="list-disc list-inside space-y-1">
                {toolA.features?.map((f) => <li key={f}>{f}</li>) || (
                  <li>-</li>
                )}
              </ul>
            </td>
            <td className="border border-gray-200 px-4 py-3 text-sm">
              <ul className="list-disc list-inside space-y-1">
                {toolB.features?.map((f) => <li key={f}>{f}</li>) || (
                  <li>-</li>
                )}
              </ul>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
              メリット
            </td>
            <td className="border border-gray-200 px-4 py-3 text-sm text-green-700">
              <ul className="space-y-1">
                {toolA.pros?.map((p) => <li key={p}>✓ {p}</li>) || <li>-</li>}
              </ul>
            </td>
            <td className="border border-gray-200 px-4 py-3 text-sm text-green-700">
              <ul className="space-y-1">
                {toolB.pros?.map((p) => <li key={p}>✓ {p}</li>) || <li>-</li>}
              </ul>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50">
              デメリット
            </td>
            <td className="border border-gray-200 px-4 py-3 text-sm text-red-700">
              <ul className="space-y-1">
                {toolA.cons?.map((c) => <li key={c}>✗ {c}</li>) || <li>-</li>}
              </ul>
            </td>
            <td className="border border-gray-200 px-4 py-3 text-sm text-red-700">
              <ul className="space-y-1">
                {toolB.cons?.map((c) => <li key={c}>✗ {c}</li>) || <li>-</li>}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIツールナビ - AI・ChatGPTツール比較サイト",
  description:
    "300以上のAIツールを徹底比較。ChatGPT、Claude、Midjourney等の料金・機能・評判を比較して最適なAIツールが見つかります。",
  keywords: [
    "AIツール",
    "比較",
    "ChatGPT",
    "Claude",
    "AI文章作成",
    "画像生成AI",
  ],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "AIツールナビ",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-blue-600">
              AIツールナビ
            </a>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a
                href="/categories"
                className="text-gray-600 hover:text-blue-600"
              >
                カテゴリ
              </a>
              <a
                href="/compare"
                className="text-gray-600 hover:text-blue-600"
              >
                比較
              </a>
              <a href="/blog" className="text-gray-600 hover:text-blue-600">
                ブログ
              </a>
            </div>
          </nav>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="bg-gray-800 text-gray-300 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-bold text-lg mb-4">
                  AIツールナビ
                </h3>
                <p className="text-sm">
                  最新のAIツールを比較・検索できるサイトです。あなたに最適なAIツールが見つかります。
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">カテゴリ</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="/categories/writing"
                      className="hover:text-white"
                    >
                      文章作成AI
                    </a>
                  </li>
                  <li>
                    <a
                      href="/categories/image-generation"
                      className="hover:text-white"
                    >
                      画像生成AI
                    </a>
                  </li>
                  <li>
                    <a
                      href="/categories/coding"
                      className="hover:text-white"
                    >
                      コーディングAI
                    </a>
                  </li>
                  <li>
                    <a
                      href="/categories/productivity"
                      className="hover:text-white"
                    >
                      生産性向上AI
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">人気の比較</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="/compare/chatgpt-vs-claude"
                      className="hover:text-white"
                    >
                      ChatGPT vs Claude
                    </a>
                  </li>
                  <li>
                    <a
                      href="/compare/midjourney-vs-stable-diffusion"
                      className="hover:text-white"
                    >
                      Midjourney vs Stable Diffusion
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
              <p>&copy; 2026 AIツールナビ. All rights reserved.</p>
              <p className="mt-2 text-xs text-gray-500">
                <a href="/privacy" className="hover:text-white underline">プライバシーポリシー</a>
                <span className="mx-2">|</span>
                ※ 当サイトはアフィリエイトプログラムに参加しています。
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | AIツールナビ",
  description: "AIツールナビのプライバシーポリシーです。",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">プライバシーポリシー</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">個人情報の取り扱いについて</h2>
          <p>当サイト「AIツールナビ」（以下、当サイト）は、ユーザーの個人情報を適切に保護することを重要と考えています。</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">収集する情報</h2>
          <p>当サイトでは、アクセス解析のためにCookieを使用する場合があります。Cookieによって個人を特定できる情報は収集していません。</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">アフィリエイトプログラムについて</h2>
          <p>当サイトは、各種アフィリエイトプログラムに参加しています。当サイト経由でサービスにお申し込みいただいた場合、当サイトが紹介報酬を受け取ることがあります。ユーザーの皆様に追加費用は発生しません。</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">免責事項</h2>
          <p>当サイトに掲載されている情報の正確性には細心の注意を払っておりますが、情報の正確性・完全性を保証するものではありません。掲載情報を利用したことによる損害について、当サイトは一切の責任を負いません。</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">お問い合わせ</h2>
          <p>当サイトに関するお問い合わせは、サイト運営者までご連絡ください。</p>
        </section>
        <p className="text-sm text-gray-500">制定日: 2026年3月28日</p>
      </div>
    </div>
  );
}

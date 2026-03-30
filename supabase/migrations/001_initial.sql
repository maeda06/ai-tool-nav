-- カテゴリテーブル
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  tool_count INTEGER DEFAULT 0
);

-- ツールテーブル
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  pricing_type TEXT NOT NULL DEFAULT 'freemium',
  pricing_detail TEXT,
  url TEXT NOT NULL,
  affiliate_url TEXT,
  affiliate_program TEXT,
  commission_rate TEXT,
  logo_url TEXT,
  features JSONB DEFAULT '[]',
  pros JSONB DEFAULT '[]',
  cons JSONB DEFAULT '[]',
  rating NUMERIC(3,2),
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 比較テーブル
CREATE TABLE comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_a_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  tool_b_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  summary TEXT,
  winner TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tool_a_id, tool_b_id)
);

-- アフィリエイトクリックトラッキング
CREATE TABLE affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  page_type TEXT,
  page_slug TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_tools_category ON tools(category);
CREATE INDEX idx_tools_slug ON tools(slug);
CREATE INDEX idx_tools_rating ON tools(rating DESC NULLS LAST);
CREATE INDEX idx_comparisons_slug ON comparisons(slug);
CREATE INDEX idx_affiliate_clicks_tool ON affiliate_clicks(tool_id);

-- updated_atを自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS (Row Level Security) ポリシー
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- 読み取りは全員許可
CREATE POLICY "tools_read" ON tools FOR SELECT USING (true);
CREATE POLICY "categories_read" ON categories FOR SELECT USING (true);
CREATE POLICY "comparisons_read" ON comparisons FOR SELECT USING (true);

-- affiliate_clicksはinsertのみ全員許可
CREATE POLICY "clicks_insert" ON affiliate_clicks FOR INSERT WITH CHECK (true);

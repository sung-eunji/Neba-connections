-- Create Products table in Supabase
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    product_number TEXT NOT NULL UNIQUE,
    color TEXT[] DEFAULT '{}',
    size TEXT[] DEFAULT '{}',
    origin TEXT,
    fabrics TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on product_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_product_number ON products(product_number);

-- Create an index on tags for filtering
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);

-- Create an index on colors for filtering
CREATE INDEX IF NOT EXISTS idx_products_colors ON products USING GIN(color);

-- Create an index on sizes for filtering
CREATE INDEX IF NOT EXISTS idx_products_sizes ON products USING GIN(size);

-- Create an index on fabrics for filtering
CREATE INDEX IF NOT EXISTS idx_products_fabrics ON products USING GIN(fabrics);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all users to read products
CREATE POLICY "Allow public read access to products" ON products
    FOR SELECT USING (true);

-- Create a policy that allows authenticated users to insert products
CREATE POLICY "Allow authenticated users to insert products" ON products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create a policy that allows authenticated users to update products
CREATE POLICY "Allow authenticated users to update products" ON products
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create a policy that allows authenticated users to delete products
CREATE POLICY "Allow authenticated users to delete products" ON products
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO products (product_number, color, size, origin, fabrics, tags) VALUES
('FJ-4075', ARRAY['Dark Blue Denim', 'Black Denim'], ARRAY['S', 'M', 'L', 'XL', '2XL'], 'South Korea', ARRAY['Cotton 83%', 'Polyester 17%'], ARRAY['eco_friendly_fabric', 'inner_banding']),
('FJ-4076', ARRAY['Dark Blue D', 'Black D'], ARRAY['S', 'M', 'L', 'XL', '2XL'], 'South Korea', ARRAY['Cotton 83%', 'Polyester 17%'], ARRAY['eco_friendly_fabric', 'excellent_drying', 'ykk_zipper']),
('FJ-4079', ARRAY['Black D', 'Medium D', 'Light D', 'Gray'], ARRAY['S', 'M', 'L', '2XL', '3XL'], 'South Korea', ARRAY['Cotton 100%'], ARRAY['non_stretch_fabric', 'elastic_waistband', 'authentic_ykk']),
('SL-2301', ARRAY['Dark Blue', 'Black'], ARRAY['S', 'M', 'L', 'XL'], 'South Korea', ARRAY['Premium Cotton', 'Elastane 2%'], ARRAY['Neba Connections', 'traveler', 'empowering']),
('SL-2205', ARRAY['Indigo', 'Black'], ARRAY['S', 'M', 'L', 'XL', '2XL'], 'South Korea', ARRAY['Organic Cotton', 'Recycled Polyester'], ARRAY['Neba Connections', 'explorer', 'trendy_chic']);

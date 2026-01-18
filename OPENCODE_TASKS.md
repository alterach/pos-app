# POS App - OpenCode Tasks (Phase 2)

## ✅ Prerequisites Ready
- Supabase project: READY
- Xendit API keys: READY
- .env file: CONFIGURED

---

## 🚀 START HERE

### Task 1: Install Dependencies
```bash
cd C:\Users\10\POS
npm install @supabase/supabase-js
```

### Task 2: Create Supabase Client
```
File: src/lib/supabase.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### Task 3: Create Database Schema
Run this SQL in Supabase Dashboard → SQL Editor:

```sql
-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  price INTEGER,
  stock INTEGER DEFAULT 0,
  image TEXT,
  rating DECIMAL DEFAULT 0,
  duration TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  items JSONB NOT NULL,
  subtotal INTEGER,
  tax INTEGER,
  total INTEGER,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  payment_id TEXT,
  customer_id UUID REFERENCES customers(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name TEXT DEFAULT 'F. POS',
  tax_percentage DECIMAL DEFAULT 11,
  currency TEXT DEFAULT 'IDR',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial products
INSERT INTO products (name, category, price, stock, image, rating, duration) VALUES
('Cappuccino', 'Coffee', 25000, 50, '☕', 4.9, '3-5min'),
('Croissant', 'Pastry', 18000, 30, '🥐', 4.7, '2min'),
('Matcha Latte', 'Drinks', 32000, 40, '🍵', 4.8, '4min'),
('Club Sandwich', 'Food', 45000, 25, '🥪', 4.6, '8min'),
('Cheesecake', 'Dessert', 35000, 20, '🍰', 4.9, '2min'),
('Americano', 'Coffee', 20000, 45, '☕', 4.5, '3min'),
('Croissant Chocolate', 'Pastry', 22000, 28, '🥐', 4.8, '2min'),
('Iced Lemon Tea', 'Drinks', 28000, 35, '🍋', 4.4, '3min');

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now, tighten later)
CREATE POLICY "Allow all" ON products FOR ALL USING (true);
CREATE POLICY "Allow all" ON customers FOR ALL USING (true);
CREATE POLICY "Allow all" ON transactions FOR ALL USING (true);
CREATE POLICY "Allow all" ON settings FOR ALL USING (true);
```

### Task 4: Update DataContext to Use Supabase
```
File: src/context/DataContext.jsx

- Replace useState with Supabase queries
- Add useEffect to fetch data on mount
- Update CRUD functions to use Supabase
- Add loading states
```

### Task 5: Add Xendit Payment Integration
```
File: src/lib/xendit.js
File: src/components/XenditPayment.jsx

- Create invoice via Supabase Edge Function
- Show payment link/QR
- Handle payment callback
```

---

## 📋 Dev Commands
```bash
cd C:\Users\10\POS
npm run dev
# http://localhost:5173/
```

## 🔗 Links
- Supabase Dashboard: https://supabase.com/dashboard/project/qeznicytgvgkkdsykizj
- Xendit Dashboard: https://dashboard.xendit.co
- GitHub: https://github.com/alterach/pos-app

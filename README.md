# Tiny Wins ✨

A minimalist public gratitude board built with **Next.js (App Router)**, **Tailwind CSS**, and **Supabase**.

Anyone can share a short (150 characters max) "win" for the day anonymously, and the homepage displays a real-time feed of everyone's celebrations.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Database & Backend**: Supabase (PostgreSQL with Row-Level Security)
- **Client**: `@supabase/supabase-js`

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/AYUSH22006/tiny-wins.git
cd tiny-wins
```

### 2. Configure Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Add your Supabase project credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### 3. Setup Supabase Database
Run the SQL queries from [`supabase-schema.sql`](./supabase-schema.sql) in your Supabase SQL Editor to create the table and enable anonymous public access via Row-Level Security (RLS).

### 4. Run Development Server
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

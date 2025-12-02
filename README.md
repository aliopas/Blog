# 🚀 The Blog – Modern Tech Insights Platform

A modern, high-performance content platform designed to deliver high-quality tech insights with an exceptional user experience. Built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **PostgreSQL**, and **Google Gemini AI**.

---

## ✨ Features

### 🔐 Admin Dashboard
- **Analytics Dashboard**: Traffic, post performance, and audience insights visualized using Recharts
- **Post Management**: Create, edit, and delete posts with a rich text editor
- **Category Manager**: Organize posts with custom categories
- **Site Settings**: Manage global platform configurations

### 🌍 Public Platform
- **Responsive UI**: Tailwind CSS + Shadcn UI components
- **SEO-Friendly URLs**: Dynamic routing with optimized slug generation
- **Theme Modes**: Full dark/light mode support
- **High Performance**: Built with App Router + Server Components

---

## 🤖 AI Automation Roadmap

### Phase 1 — Content Automation
- Automated article generation using Google Gemini
- Scheduled publishing (6 AI-generated articles per day)
- Draft creation for manual review
- Trend & topic research

### Phase 2 — AI Analytics
- AI-powered traffic pattern analysis
- Content performance forecasting
- Audience behavior understanding
- Personalized content recommendations

### Phase 3 — Quality Assurance
- Readability scoring
- SEO keyword analysis
- Keyword density optimization
- Content quality grading

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS, Shadcn UI |
| **Database** | PostgreSQL (Aiven) |
| **ORM** | Drizzle ORM |
| **AI** | Google Gemini + Genkit |
| **Validation** | Zod |
| **Charts** | Recharts |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google Gemini API Keys

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/aliopas/The-blog.git
cd The-blog
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Create `.env` File

#### Admin Credentials
```env
ADMIN_EMAIL=admin@techinsights.com
ADMIN_PASSWORD=secure_password_123
```

#### Database
```env
DATABASE_URL=postgresql://user:password@host:port/dbname?sslmode=require

DB_HOST=your-db-host
DB_PORT=your-db-port
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_SSL=true
```

#### Gemini Keys
```env
GOOGLE_GENAI_API_KEY_1=your_first_api_key
GOOGLE_GENAI_API_KEY_2=your_second_api_key
```

#### Cron Secret
```env
CRON_SECRET=your-secret-token
```

### 4️⃣ Database Setup
```bash
npm run db:generate  # Generate migrations
npm run db:push      # Push schema to DB
npm run db:seed      # Insert initial data
npm run db:insert-keys  # Add Gemini API keys
```

### 5️⃣ Start Development Server
```bash
npm run dev
```

🎉 App will run at: **http://localhost:9002**

---

## 📁 Project Structure

```
├── src
│   ├── ai                # Genkit flows + AI logic
│   ├── app               # Next.js App Router pages & layouts
│   ├── components        # Reusable UI components
│   ├── lib               # Database, utilities, helpers
│   └── middleware.ts     # Auth & tracking middleware
├── drizzle               # Database migrations
├── scripts               # Helper scripts
└── public                # Static assets
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production version |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate database migrations |
| `npm run db:push` | Apply schema to database |
| `npm run db:seed` | Seed the database |

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** this repository
2. Create a new branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** your changes
4. **Push** to your branch
5. Submit a **Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute with attribution.

---

## 🔗 Links

- **Live Demo**: https://ali-alaa-blog.netlify.app/

---

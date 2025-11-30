# The Blog - AI-Powered Tech Insights Platform

![Project Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Next.js](https://img.shields.io/badge/Next.js-15.3-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-green)

**The Blog** is a modern, AI-driven content platform built to deliver daily tech insights. It leverages **Google Gemini** via **Genkit** to automate content discovery, research, and generation, ensuring high-quality, SEO-optimized articles.

## 🚀 Features

### 🤖 AI Automation
- **Automated Content Pipeline**: Discovers trending topics, researches source material, and generates full articles.
- **Quality Assurance**: AI-powered analysis of readability, keyword density, and improvement suggestions.
- **Smart Analytics**: AI-driven insights into traffic patterns and content performance.
- **Key Rotation**: Robust API key management with automatic rotation and retry logic.

### 📊 Admin Dashboard
- **Comprehensive Analytics**: Visual charts for traffic, post performance, and visitor demographics (using Recharts).
- **Content Management**: Create, edit, and delete posts with a rich text editor.
- **Automation Control**: Trigger manual content generation and monitor system status.
- **Settings**: Manage API keys and system configurations.

### 🌐 Public Platform
- **Responsive Design**: Mobile-first UI built with Tailwind CSS and Shadcn UI.
- **Dynamic Routing**: SEO-friendly URLs for posts and categories.
- **Dark Mode**: Fully supported dark/light theme switching.
- **Performance**: Optimized with Next.js App Router and Server Components.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via Aiven)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **AI**: [Google Genkit](https://firebase.google.com/docs/genkit) & [Gemini API](https://ai.google.dev/)
- **Validation**: [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aliopas/The-blog.git
   cd The-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Admin Credentials
   ADMIN_EMAIL=admin@techinsights.com
   ADMIN_PASSWORD=secure_password_123

   # Database Connection
   DATABASE_URL=postgresql://user:password@host:port/dbname?sslmode=require
   
   # Database Config (Individual parts if needed by scripts)
   DB_HOST=your-db-host
   DB_PORT=your-db-port
   DB_NAME=your-db-name
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_SSL=true

   # Google Gemini API Keys (Get from Google AI Studio)
   GOOGLE_GENAI_API_KEY_1=your_first_api_key
   GOOGLE_GENAI_API_KEY_2=your_second_api_key

   # Cron Secret
   CRON_SECRET=your-secret-token
   ```

4. **Database Setup**
   ```bash
   # Generate migrations
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed initial data
   npm run db:seed
   
   # Insert API keys
   npm run db:insert-keys
   ```

5. **Run the Application**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:9002`.

## 📜 Scripts

- `npm run dev`: Start development server on port 9002.
- `npm run build`: Build the application for production.
- `npm start`: Start production server.
- `npm run lint`: Run ESLint.
- `npm run db:generate`: Generate Drizzle migrations.
- `npm run db:push`: Push schema changes to the database.
- `npm run db:seed`: Seed the database with sample data.

## 📂 Project Structure

```
├── src
│   ├── ai              # AI flows and Genkit configuration
│   ├── app             # Next.js App Router pages and layouts
│   ├── components      # Reusable UI components
│   ├── lib             # Utilities, database client, and types
│   └── middleware.ts   # Authentication and tracking middleware
├── scripts             # Helper scripts (seeding, testing)
├── drizzle             # Database migrations
└── public              # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

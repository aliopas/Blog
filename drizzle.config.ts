import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/lib/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
        ssl: process.env.DB_SSL === 'true' ? 'require' : false,
    },
});

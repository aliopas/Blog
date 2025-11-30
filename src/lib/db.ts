// Next.js loads .env files automatically, no need for dotenv/config
// import 'dotenv/config'; // ❌ Removed - causes issues in Edge Runtime (middleware)
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Read database config from environment variables
const connectionString = process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}${process.env.DB_SSL === 'true' ? '?sslmode=require' : ''}`;

// Singleton pattern for database client to prevent multiple connections in dev
const globalForDb = global as unknown as { conn: postgres.Sql | undefined };

const client = globalForDb.conn ?? postgres(connectionString, {
    ssl: process.env.DB_SSL === 'true' ? 'require' : false,
    max: process.env.NODE_ENV === 'production' ? 5 : 1, // Limit connections
    idle_timeout: 20, // Close idle connections after 20 seconds
    connect_timeout: 10,
});

if (process.env.NODE_ENV !== 'production') {
    globalForDb.conn = client;
}

// Create drizzle instance
export const db = drizzle(client, { schema });

// Export schema for use in queries
export { schema };

import { db } from '@/lib/db';
import { categories } from '@/lib/schema';

async function testDatabaseConnection() {
  console.log('Attempting to connect to the database and fetch categories...');

  try {
    const results = await db.select().from(categories).limit(1);
    console.log('✅ Success! Database connection is working.');
    if (results && results.length > 0) {
      console.log('Sample data fetched:', results[0]);
    } else {
      console.log('Connection successful, but no data found in categories table. Try seeding the database (`npm run db:seed`).');
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error! Failed to connect to the database.');
    console.error(error);
    process.exit(1);
  }
}

testDatabaseConnection();

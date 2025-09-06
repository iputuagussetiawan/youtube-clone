import { dataCategories } from './mockup/categories';
import { categories } from './schema';

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import 'dotenv/config';
async function main() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
	const db = drizzle(pool);
    console.log('🔄 Starting seed process...');
    try {
        console.log('🧹 Cleaning up...');
        await db.delete(categories); // deletes all rows

        console.log('🌱 Inserting categories...');
        const values = dataCategories.map((name) => ({
        name,
        description: `Video related to ${name.toLowerCase()}`,
        }));

        await db.insert(categories).values(values);

        console.log('✅ Seeding completed!');
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

main().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});

import { db } from "@/db";
import { categories } from "@/db/schema";

//TODO : Create Seed Categories
const categoryName = [
    "Action",
    "Adventure",
    "Animation",
    "Biographical",
    "Comedy",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "Gaming",
    "Historical",
    "Horror",
    "Musical",
    "Mystery",
    "News",
    "Reality TV",
    "Romance",
    "Science Fiction",
    "Sports",
    "Talk Show",
    "Thriller",
    "War",
    "Western",
];

async function main() {
    console.log("Seeding Categories");
    try {
        const values = categoryName.map((name) => ({
            name,
            description: `Video related to ${name.toLowerCase()}`,
        }));
        await db.insert(categories).values(values);
        console.log("Categories seeded successfully");
    } catch (error) {
        console.error("Error seeding categories:", error);
        process.exit(1);
    }
}

main();

import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config();
export default {
    schema: "./src/db/schema/script.ts",
    out: "./drizzle",
    driver: "pg",
    dbCredentials: {
        connectionString: process.env.POSTGRES_URL + "?sslmode=require" || "",
    },
} satisfies Config;
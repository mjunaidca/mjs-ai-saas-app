CREATE TABLE IF NOT EXISTS "UserApiLimit" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar NOT NULL,
	"count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "UserApiLimit_userId_unique" UNIQUE("userId")
);

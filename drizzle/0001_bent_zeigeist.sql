CREATE TABLE IF NOT EXISTS "UserSubscription" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar NOT NULL,
	"stripe_customer_id" varchar,
	"stripe_subscription_id" varchar,
	"stripe_price_id" varchar,
	"stripe_current_period_end" timestamp,
	CONSTRAINT "UserSubscription_userId_unique" UNIQUE("userId"),
	CONSTRAINT "UserSubscription_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "UserSubscription_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);

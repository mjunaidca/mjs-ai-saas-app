import {
    pgTable,
    serial,
    varchar,
    boolean,
    timestamp,
    integer,
    uuid
} from "drizzle-orm/pg-core";


export const UserApiLimit = pgTable("UserApiLimit", {
    id: serial("id").primaryKey(),
    userId: varchar("userId").notNull().unique(),
    count: integer("count").default(0),
    created_at: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
});

export const UserSubscription = pgTable("UserSubscription", {
    id: serial("id").primaryKey(),
    userId: varchar("userId").notNull().unique(),

    stripeCustomerId: varchar("stripe_customer_id").unique(),
    stripeSubscriptionId: varchar("stripe_subscription_id").unique(),
    stripePriceId: varchar("stripe_price_id"),
    stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),

});
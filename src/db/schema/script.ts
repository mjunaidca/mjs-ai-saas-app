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
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm'
import { UserApiLimit } from "./schema/script";

export type SelectUserApiLimit = InferSelectModel<typeof UserApiLimit>;
export type InsertUserApiLimit = InferInsertModel<typeof UserApiLimit>;
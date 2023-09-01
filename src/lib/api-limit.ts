import { auth } from "@clerk/nextjs"
import { UserApiLimit } from "@/db/schema/script"

import { db } from "@/db/drizzle"
import { MAX_FREE_COUNTS } from './constants'
import { eq } from "drizzle-orm"

export const incrementApiLimit = async () => {
    const { userId } = auth()

    if (!userId) {
        return;
    }

    const userApiLimitInArray = await db.selectDistinct().from(UserApiLimit).where(eq(UserApiLimit.userId, userId))
    const userApiLimit = userApiLimitInArray[0]


    if (userApiLimit) {

        await db.update(UserApiLimit).set({ count: (userApiLimit.count || 0) + 1 }).where(eq(UserApiLimit.userId, userId)).returning()
    } else {

        await db.insert(UserApiLimit).values({ userId: userId, count: 1 }).returning()
    }

}

export const checkApiLimit = async () => {
    const { userId } = auth()

    if (!userId) {
        return false
    }

    const userApiLimit = await db.selectDistinct().from(UserApiLimit).where(eq(UserApiLimit.userId, userId))


    if (!userApiLimit || (userApiLimit[0]?.count || 0) < MAX_FREE_COUNTS) {
        return true;
    } else {
        return false
    }

}

export const getApiLimitCount = async () => {
    const { userId } = auth()

    if (!userId) {
        return 0;
    }

    const getUserApiLimit = await db.selectDistinct().from(UserApiLimit).where(eq(UserApiLimit.userId, userId))

    const userApiLimit = getUserApiLimit[0];

    if (!userApiLimit) {
        return 0;
    }

    return userApiLimit.count;
}
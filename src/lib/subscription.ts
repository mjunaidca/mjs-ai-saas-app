import { auth } from "@clerk/nextjs";
import { db } from "@/db/drizzle";
import { UserSubscription } from "@/db/schema/script";
import { eq } from "drizzle-orm";

const DAY_IN_MS = 86_400_000

export const checkSubscription = async () => {
    const { userId } = auth();

    if (!userId) {
        return false;
    }

    const getUserSubscription = await db.selectDistinct({
        stripeSubscriptionId: UserSubscription.stripeSubscriptionId,
        stripeCurrentPeriodEnd: UserSubscription.stripeCurrentPeriodEnd,
        stripeCustomerId: UserSubscription.stripeCustomerId,
        stripePriceId: UserSubscription.stripePriceId
    }).from(UserSubscription).where(eq(UserSubscription.userId, userId));

    const userSubscription = getUserSubscription[0];


    if (!userSubscription) {
        return false;
    }

    const isValid =
        userSubscription.stripePriceId &&
        userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

    return !!isValid;
};
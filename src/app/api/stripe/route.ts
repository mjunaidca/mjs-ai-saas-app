import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/db/drizzle";

import { absoluteUrl } from "@/lib/utils";
import { stripe } from "@/lib/stripe";

import { UserSubscription } from "@/db/schema/script";
import { eq } from "drizzle-orm";

const settingsUrl = absoluteUrl("/settings");

export async function GET() {
    try {
        const { userId } = auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const getUserSubscription = await db.select().from(UserSubscription).where(eq(UserSubscription.userId, userId))

        console.log('[getUserSubscription ==========> STRIPE]', getUserSubscription);


        const userSubscription = getUserSubscription[0];

        if (userSubscription && userSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl,
            })

            return new NextResponse(JSON.stringify({ url: stripeSession.url }))
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: "USD",
                        product_data: {
                            name: "Genius Pro",
                            description: "Unlimited AI Generations"
                        },
                        unit_amount: 1999,
                        recurring: {
                            interval: "month"
                        }
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId,
            },
        })

        return new NextResponse(JSON.stringify({ url: stripeSession.url }))
    } catch (error) {
        console.log("[STRIPE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};
import Stripe from "stripe";
import { headers } from 'next/headers';
import { NextResponse } from "next/server";

import { db } from "@/db/drizzle";

import { stripe } from "@/lib/stripe";

import { UserSubscription } from "@/db/schema/script";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session

    if (event.type === "checkout.session.completed") {

        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )

        if (!session?.metadata?.userId) {
            return new NextResponse("User id is required", { status: 400 });
        }

        await db.insert(UserSubscription).values({
            userId: session?.metadata?.userId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
            )
        })
    }

    if (event.type === 'invoice.payment_succeeded') {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )

        await db.update(UserSubscription).set({
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
            )

        }).where(eq(UserSubscription.userId, subscription.id))
    }

    return new NextResponse(null, { status: 200 })

}
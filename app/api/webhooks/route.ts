import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '~/db';
import { stripe } from '~/lib/stripe';
import { Resend } from 'resend';
import { OrderReceivedEmail } from '~/components/emails/order-received-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return new Response('No signature', { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);

    if (event.type === 'checkout.session.completed') {
      if (!event.data.object.customer_details?.email) {
        throw new Error('No email found in event');
      }

      const session = event.data.object as Stripe.Checkout.Session;

      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      };

      if (!userId || !orderId) {
        throw new Error('No userId or orderId found in event');
      }

      const billingAddress = session.customer_details!.address;
      const shippingAddress = session.shipping_details!.address;

      const updatedOrder = await db.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          shippingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: shippingAddress!.city!,
              country: shippingAddress!.country!,
              postalCode: shippingAddress!.postal_code!,
              street: shippingAddress!.line1!,
              state: shippingAddress!.state,
            },
          },
          billingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: billingAddress!.city!,
              country: billingAddress!.country!,
              postalCode: billingAddress!.postal_code!,
              street: billingAddress!.line1!,
              state: billingAddress!.state,
            },
          },
        },
      });
      await resend.emails.send({
        from: 'CoverIt-Up <ahmetpalavann@gmail.com>',
        to: [event.data.object.customer_details.email],
        subject: 'Order Received',
        react: OrderReceivedEmail({
          orderDate: new Date().toLocaleDateString(),
          orderId,
          shippingAddress: {
            name: session.customer_details!.name!,
            orderId,
            phoneNumber: session.customer_details!.phone!,
            id: updatedOrder.id,
            city: shippingAddress!.city!,
            country: shippingAddress!.country!,
            postalCode: shippingAddress!.postal_code!,
            street: shippingAddress!.line1!,
            state: shippingAddress!.state,
          },
        }),
      });
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error', ok: false }, { status: 500 });
  }
}

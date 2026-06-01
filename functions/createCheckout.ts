import Stripe from 'npm:stripe@14.0.0';

Deno.serve(async (req) => {
  try {
    const key = Deno.env.get('STRIPE_SECRET_KEY');
    if (!key) {
      return Response.json({ error: 'Stripe key not set' }, { status: 500 });
    }
    const stripe = new Stripe(key);

    const product = await stripe.products.create({
      name: 'Premium Upgrade',
      description: 'Unlock premium features in Active Healing Mind',
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 1000, // 0.00
      currency: 'usd',
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: price.id, quantity: 1 }],
      mode: 'payment',
      success_url: 'https://superagent-b2f2196e.base44.app/success',
      cancel_url: 'https://superagent-b2f2196e.base44.app/cancel',
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

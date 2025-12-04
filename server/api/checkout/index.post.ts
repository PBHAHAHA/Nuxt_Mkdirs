/**
 * Unified checkout API
 * POST /api/checkout
 * 
 * Supports both Stripe and Creem payment providers
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const { itemId, pricePlan, provider = 'creem' } = body;

  if (!itemId || !pricePlan) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: itemId, pricePlan',
    });
  }

  // Get user session from cookie
  const sessionToken = getCookie(event, 'auth-token');
  if (!sessionToken) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  let userId: string;
  let userEmail: string | undefined;

  try {
    const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString('utf-8'));
    userId = sessionData.id;
    userEmail = sessionData.email;
  } catch {
    throw createError({
      statusCode: 401,
      message: 'Invalid session',
    });
  }

  // Determine price/product ID based on plan
  let stripePriceId: string | undefined;
  let creemProductId: string | undefined;

  if (pricePlan === 'pro') {
    stripePriceId = config.public.stripeProPriceId;
    creemProductId = config.public.creemProProductId;
  } else if (pricePlan === 'sponsor') {
    stripePriceId = config.public.stripeSponsorPriceId;
    creemProductId = config.public.creemSponsorProductId;
  } else {
    throw createError({
      statusCode: 400,
      message: 'Invalid price plan. Must be "pro" or "sponsor"',
    });
  }

  try {
    // Use Creem if configured and requested, otherwise fallback to Stripe
    const useCreem = provider === 'creem' && config.creemApiKey && creemProductId;

    if (useCreem) {
      // Creem checkout
      const checkout = await createCreemCheckout({
        productId: creemProductId!,
        userId,
        itemId,
        pricePlan,
        successUrl: `${config.public.appUrl}/publish/${itemId}?pay=success&provider=creem`,
        customerEmail: userEmail,
      });

      return {
        checkoutUrl: checkout.checkoutUrl,
        provider: 'creem',
      };
    } else {
      // Stripe checkout
      if (!stripePriceId) {
        throw createError({
          statusCode: 500,
          message: 'Stripe price ID not configured for this plan',
        });
      }

      const stripeSession = await createCheckoutSession({
        priceId: stripePriceId,
        userId,
        itemId,
        successUrl: `${config.public.appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${config.public.appUrl}/payment/${itemId}`,
      });

      return {
        checkoutUrl: stripeSession.url,
        provider: 'stripe',
      };
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to create checkout session',
    });
  }
});

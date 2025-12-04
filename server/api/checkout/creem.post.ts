/**
 * Create Creem checkout session
 * POST /api/checkout/creem
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const { productId, userId, itemId, pricePlan, customerEmail } = body;

  if (!productId || !userId || !itemId || !pricePlan) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: productId, userId, itemId, pricePlan',
    });
  }

  try {
    const checkout = await createCreemCheckout({
      productId,
      userId,
      itemId,
      pricePlan,
      successUrl: `${config.public.appUrl}/publish/${itemId}?pay=success&provider=creem`,
      customerEmail,
    });

    return {
      checkoutId: checkout.id,
      url: checkout.checkoutUrl,
    };
  } catch (error) {
    console.error('Error creating Creem checkout session:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to create checkout session',
    });
  }
});

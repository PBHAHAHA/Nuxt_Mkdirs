/**
 * Creem webhook handler
 * Handles payment events from Creem
 * POST /api/webhooks/creem
 * 
 * Webhook events:
 * - checkout.completed: Payment completed
 * - subscription.active: Subscription activated
 * - subscription.paid: Subscription payment received
 * - subscription.canceled: Subscription canceled
 * - subscription.expired: Subscription expired
 * - subscription.paused: Subscription paused
 * - refund.created: Refund created
 * - dispute.created: Dispute created
 */
export default defineEventHandler(async (event) => {
  const body = await readRawBody(event);
  const signature = getHeader(event, 'creem-signature');

  if (!body || !signature) {
    throw createError({
      statusCode: 400,
      message: 'Missing body or signature',
    });
  }

  try {
    await handleCreemWebhook(body, signature, {
      // Handle checkout completion
      onCheckoutCompleted: async (data) => {
        console.log('Creem checkout completed:', data.id);
        
        const userId = data.metadata?.userId;
        const itemId = data.metadata?.itemId;
        const pricePlan = data.metadata?.pricePlan || (data.product?.name?.toLowerCase().includes('sponsor') ? 'sponsor' : 'pro');
        const customerEmail = data.customer?.email;
        const customerName = data.customer?.name;
        const orderId = data.order?.id;
        
        if (userId && itemId) {
          console.log(`Processing Creem payment for user ${userId}, item ${itemId}, plan: ${pricePlan}`);
          
          try {
            // 1. Create order record in Sanity
            const orderResult = await sanityClient.create({
              _type: 'order',
              user: {
                _type: 'reference',
                _ref: userId,
              },
              item: {
                _type: 'reference',
                _ref: itemId,
              },
              status: 'success',
              provider: 'creem',
              externalOrderId: orderId,
              date: new Date().toISOString(),
            });
            console.log('Order created:', orderResult._id);

            // 2. Update item status
            const itemResult = await sanityClient
              .patch(itemId)
              .set({
                paid: true,
                featured: true,
                pricePlan: pricePlan,
                sponsor: pricePlan === 'sponsor',
                proPlanStatus: pricePlan === 'pro' ? 'success' : 'submitting',
                sponsorPlanStatus: pricePlan === 'sponsor' ? 'success' : 'submitting',
                order: {
                  _type: 'reference',
                  _ref: orderResult._id,
                },
              })
              .commit();
            console.log('Item updated:', itemResult._id);

            // 3. Send confirmation email (optional)
            if (customerEmail) {
              // TODO: Implement email sending
              console.log(`Should send confirmation email to ${customerEmail}`);
            }
          } catch (err) {
            console.error('Error processing checkout completion:', err);
          }
        }
      },

      // Grant access when subscription becomes active/trialing/paid
      onGrantAccess: async (context) => {
        const { reason, customer, product, metadata } = context;
        const userId = metadata?.userId;
        
        console.log(`Granting access (${reason}) to user ${userId}`);
        console.log(`Customer: ${customer?.email}, Product: ${product?.name}`);
        
        // TODO: Update user subscription status in database
        // Example: await updateUserSubscription(userId, { active: true });
      },

      // Revoke access when subscription is paused/expired
      onRevokeAccess: async (context) => {
        const { reason, customer, product, metadata } = context;
        const userId = metadata?.userId;
        
        console.log(`Revoking access (${reason}) from user ${userId}`);
        console.log(`Customer: ${customer?.email}, Product: ${product?.name}`);
        
        // TODO: Update user subscription status in database
        // Example: await updateUserSubscription(userId, { active: false });
      },

      // Individual subscription events
      onSubscriptionActive: async (data) => {
        console.log('Subscription active:', data.id);
      },

      onSubscriptionCanceled: async (data) => {
        console.log('Subscription canceled:', data.id);
      },

      onSubscriptionPaid: async (data) => {
        console.log('Subscription paid:', data.id);
      },

      onSubscriptionExpired: async (data) => {
        console.log('Subscription expired:', data.id);
      },

      // Refund and dispute events
      onRefundCreated: async (data) => {
        console.log('Refund created:', data.id);
        // TODO: Handle refund logic
      },

      onDisputeCreated: async (data) => {
        console.log('Dispute created:', data.id);
        // TODO: Handle dispute logic
      },
    });

    return { received: true };
  } catch (error) {
    console.error('Creem webhook error:', error);
    throw createError({
      statusCode: 400,
      message: 'Invalid signature or webhook processing failed',
    });
  }
});

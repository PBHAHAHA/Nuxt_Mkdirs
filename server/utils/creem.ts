import { createCreem } from 'creem_io';

const config = useRuntimeConfig();

/**
 * Creem client for payment processing
 * https://docs.creem.io/code/sdks/typescript
 */
export const creem = createCreem({
  apiKey: config.creemApiKey,
  webhookSecret: config.creemWebhookSecret,
  testMode: config.creemTestMode,
});

/**
 * Create a checkout session for product submission
 */
export async function createCreemCheckout(params: {
  productId: string;
  userId: string;
  itemId: string;
  pricePlan: string;
  successUrl: string;
  customerEmail?: string;
}) {
  const checkout = await creem.checkouts.create({
    productId: params.productId,
    successUrl: params.successUrl,
    customer: params.customerEmail ? { email: params.customerEmail } : undefined,
    metadata: {
      userId: params.userId,
      itemId: params.itemId,
      pricePlan: params.pricePlan,
    },
  });

  return checkout;
}

/**
 * Get checkout session details
 */
export async function getCreemCheckout(checkoutId: string) {
  return creem.checkouts.get({ checkoutId });
}

/**
 * Get product details
 */
export async function getCreemProduct(productId: string) {
  return creem.products.get({ productId });
}

/**
 * List products
 */
export async function listCreemProducts(page = 1, limit = 10) {
  return creem.products.list({ page, limit });
}

/**
 * Get customer details
 */
export async function getCreemCustomer(customerId: string) {
  return creem.customers.get({ customerId });
}

/**
 * Get customer by email
 */
export async function getCreemCustomerByEmail(email: string) {
  return creem.customers.get({ email });
}

/**
 * Create customer portal link
 */
export async function createCreemCustomerPortal(customerId: string) {
  return creem.customers.createPortal({ customerId });
}

/**
 * Get subscription details
 */
export async function getCreemSubscription(subscriptionId: string) {
  return creem.subscriptions.get({ subscriptionId });
}

/**
 * Cancel subscription
 */
export async function cancelCreemSubscription(subscriptionId: string) {
  return creem.subscriptions.cancel({ subscriptionId });
}

/**
 * Webhook event handler type definitions
 */
export interface CreemWebhookHandlers {
  onCheckoutCompleted?: (data: any) => Promise<void>;
  onGrantAccess?: (context: any) => Promise<void>;
  onRevokeAccess?: (context: any) => Promise<void>;
  onSubscriptionActive?: (data: any) => Promise<void>;
  onSubscriptionTrialing?: (data: any) => Promise<void>;
  onSubscriptionCanceled?: (data: any) => Promise<void>;
  onSubscriptionPaid?: (data: any) => Promise<void>;
  onSubscriptionExpired?: (data: any) => Promise<void>;
  onSubscriptionUnpaid?: (data: any) => Promise<void>;
  onSubscriptionPastDue?: (data: any) => Promise<void>;
  onSubscriptionPaused?: (data: any) => Promise<void>;
  onSubscriptionUpdate?: (data: any) => Promise<void>;
  onRefundCreated?: (data: any) => Promise<void>;
  onDisputeCreated?: (data: any) => Promise<void>;
}

/**
 * Handle webhook events from Creem
 */
export async function handleCreemWebhook(
  body: string,
  signature: string,
  handlers: CreemWebhookHandlers
) {
  return creem.webhooks.handleEvents(body, signature, handlers);
}

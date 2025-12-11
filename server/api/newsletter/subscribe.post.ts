import { z } from 'zod';
import { uuid } from '@sanity/uuid';

const SubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

/**
 * Newsletter subscription endpoint
 * 
 * Two modes:
 * 1. With Resend Audience (recommended): Uses Resend to manage subscribers
 * 2. Without Audience: Stores in Sanity and sends welcome email
 * 
 * Required env vars:
 * - NUXT_RESEND_API_KEY (for sending emails)
 * - NUXT_RESEND_AUDIENCE_ID (optional, for Resend Audience mode)
 * - NUXT_RESEND_EMAIL_FROM
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate input
  const validatedFields = SubscribeSchema.safeParse(body);
  if (!validatedFields.success) {
    throw createError({
      statusCode: 400,
      message: validatedFields.error.errors[0].message,
    });
  }

  const { email } = validatedFields.data;
  const config = useRuntimeConfig();

  // Mode 1: Use Resend Audience if configured
  if (config.resendApiKey && config.resendAudienceId) {
    return await subscribeWithResendAudience(email, config);
  }

  // Mode 2: Use Sanity storage + Resend email
  return await subscribeWithSanity(email, config);
});

/**
 * Subscribe using Resend Audience
 */
async function subscribeWithResendAudience(email: string, config: any) {
  try {
    // First, check if contact already exists
    const contactsResult = await resend.contacts.list({
      audienceId: config.resendAudienceId,
    });

    if (contactsResult.data?.data) {
      const existingContact = contactsResult.data.data.find(
        (c: any) => c.email.toLowerCase() === email.toLowerCase()
      );

      if (existingContact) {
        // Already subscribed and active
        if (!existingContact.unsubscribed) {
          return {
            success: true,
            message: 'You are already subscribed!',
          };
        }

        // Resubscribe - update contact
        await resend.contacts.update({
          id: existingContact.id,
          audienceId: config.resendAudienceId,
          unsubscribed: false,
        });

        await sendWelcomeEmail(email, config);

        return {
          success: true,
          message: 'Welcome back! You have been resubscribed.',
        };
      }
    }

    // New subscriber - create contact
    const subscribeResult = await resend.contacts.create({
      email,
      unsubscribed: false,
      audienceId: config.resendAudienceId,
    });

    console.log('Newsletter subscribe result:', subscribeResult);

    if (subscribeResult.error) {
      throw new Error(subscribeResult.error.message);
    }

    // Send welcome email
    await sendWelcomeEmail(email, config);

    return {
      success: true,
      message: 'Thanks for subscribing!',
    };
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to subscribe. Please try again.',
    });
  }
}

/**
 * Subscribe using Sanity storage
 */
async function subscribeWithSanity(email: string, config: any) {
  try {
    // Check if already subscribed in Sanity
    const existingSubscriber = await sanityFetch<{ _id: string; status: string } | null>(
      `*[_type == "subscriber" && email == $email][0]{ _id, status }`,
      { email }
    );

    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return {
          success: true,
          message: 'You are already subscribed!',
        };
      }

      // Reactivate unsubscribed user
      await sanityClient.patch(existingSubscriber._id)
        .set({ 
          status: 'active',
          subscribedAt: new Date().toISOString(),
        })
        .unset(['unsubscribedAt'])
        .commit();

      await sendWelcomeEmail(email, config);

      return {
        success: true,
        message: 'Welcome back! You have been resubscribed.',
      };
    }

    // Create new subscriber in Sanity
    await sanityClient.create({
      _type: 'subscriber',
      _id: `subscriber.${uuid()}`,
      email,
      status: 'active',
      source: 'website',
      subscribedAt: new Date().toISOString(),
    });

    // Send welcome email
    await sendWelcomeEmail(email, config);

    return {
      success: true,
      message: 'Thanks for subscribing!',
    };
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to subscribe. Please try again.',
    });
  }
}

/**
 * Send welcome email
 */
async function sendWelcomeEmail(email: string, config: any) {
  if (!config.resendApiKey) {
    console.warn('Newsletter: NUXT_RESEND_API_KEY not configured, skipping email');
    return;
  }

  try {
    const result = await resend.emails.send({
      from: config.resendEmailFrom,
      to: email,
      subject: 'Welcome to our newsletter!',
      html: getWelcomeEmailHtml(email, config.public.appUrl),
    });
    console.log('Newsletter welcome email result:', result);
  } catch (error) {
    console.warn('Failed to send welcome email:', error);
  }
}

/**
 * Generate welcome email HTML
 */
function getWelcomeEmailHtml(email: string, siteUrl: string): string {
  const unsubscribeUrl = `${siteUrl}/unsubscribe?email=${encodeURIComponent(email)}`;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${siteUrl}/logo.png" width="48" height="48" alt="Logo" style="margin-bottom: 16px;">
          <h1 style="color: #6366f1; margin-bottom: 10px;">Welcome to Our Newsletter!</h1>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          Welcome to our community! We're thrilled to have you join us on this journey of exploring cutting-edge websites and tools.
        </p>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          We value your participation and feedback. Please don't hesitate to reach out to us if you have any questions or suggestions.
        </p>
        
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
          <p style="color: white; font-size: 18px; margin: 0;">
            🎉 You're all set!
          </p>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          What to expect:
        </p>
        <ul style="font-size: 14px; color: #666;">
          <li>Latest product updates and features</li>
          <li>Curated resources and tools</li>
          <li>Tips and best practices</li>
          <li>Exclusive offers and announcements</li>
        </ul>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #999; text-align: center;">
          © ${new Date().getFullYear()} All rights reserved.
        </p>
        
        <p style="font-size: 12px; color: #999; text-align: center;">
          If you wish to unsubscribe, 
          <a href="${unsubscribeUrl}" style="color: #6366f1;">click here</a>.
        </p>
      </body>
    </html>
  `;
}

import { z } from 'zod';

const UnsubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

/**
 * Newsletter unsubscribe endpoint
 * 
 * Updates contact status in Resend Audience
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate input
  const validatedFields = UnsubscribeSchema.safeParse(body);
  if (!validatedFields.success) {
    throw createError({
      statusCode: 400,
      message: validatedFields.error.errors[0].message,
    });
  }

  const { email } = validatedFields.data;
  const config = useRuntimeConfig();

  // Check if Resend is configured
  if (!config.resendApiKey || !config.resendAudienceId) {
    return {
      success: true,
      message: 'You have been unsubscribed.',
    };
  }

  try {
    // Get contact ID first
    const contactsResult = await resend.contacts.list({
      audienceId: config.resendAudienceId,
    });

    if (contactsResult.error) {
      throw new Error(contactsResult.error.message);
    }

    // Find the contact by email
    const contact = contactsResult.data?.data?.find(
      (c: any) => c.email === email
    );

    if (!contact) {
      // Contact not found, but still return success
      return {
        success: true,
        message: 'You have been unsubscribed.',
      };
    }

    // Update contact to unsubscribed
    const updateResult = await resend.contacts.update({
      id: contact.id,
      audienceId: config.resendAudienceId,
      unsubscribed: true,
    });

    console.log('Newsletter unsubscribe result:', updateResult);

    if (updateResult.error) {
      throw new Error(updateResult.error.message);
    }

    return {
      success: true,
      message: 'You have been unsubscribed.',
    };
  } catch (error: any) {
    console.error('Newsletter unsubscribe error:', error);
    
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to unsubscribe. Please try again.',
    });
  }
});

import { z } from 'zod';
import { uuid } from '@sanity/uuid';

const SubmitSchema = z.object({
  link: z.string().url('Invalid URL'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  introduction: z.string().optional(),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  tags: z.array(z.string()).optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  pricePlan: z.enum(['free', 'pro', 'sponsor']).default('free'),
});

/**
 * Submit a new item
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  // Validate input
  const validatedFields = SubmitSchema.safeParse(body);
  if (!validatedFields.success) {
    throw createError({
      statusCode: 400,
      message: validatedFields.error.errors[0].message,
    });
  }

  const data = validatedFields.data;

  // Get user from session
  const sessionToken = getCookie(event, 'auth-token');
  if (!sessionToken) {
    throw createError({
      statusCode: 401,
      message: 'Please login to submit',
    });
  }

  let userId: string;
  try {
    const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString('utf-8'));
    userId = sessionData.id;
  } catch {
    throw createError({
      statusCode: 401,
      message: 'Invalid session',
    });
  }

  try {
    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Build item data
    const itemData: Record<string, any> = {
      _type: 'item',
      _id: `item.${uuid()}`,
      name: data.name,
      slug: { _type: 'slug', current: slug },
      link: data.link,
      description: data.description,
      introduction: data.introduction,
      pricePlan: data.pricePlan,
      categories: data.categories.map((id) => ({
        _type: 'reference',
        _ref: id,
        _key: uuid(),
      })),
      tags: data.tags?.map((id) => ({
        _type: 'reference',
        _ref: id,
        _key: uuid(),
      })),
      freePlanStatus: data.pricePlan === 'free' ? 'submitting' : undefined,
      proPlanStatus: data.pricePlan === 'pro' ? 'submitting' : undefined,
      sponsorPlanStatus: data.pricePlan === 'sponsor' ? 'submitting' : undefined,
    };

    // Add image if provided
    if (data.image) {
      itemData.image = {
        _type: 'image',
        alt: `image of ${data.name}`,
        asset: {
          _type: 'reference',
          _ref: data.image,
        },
      };
    }

    // Add icon if provided
    if (data.icon) {
      itemData.icon = {
        _type: 'image',
        alt: `icon of ${data.name}`,
        asset: {
          _type: 'reference',
          _ref: data.icon,
        },
      };
    }

    // Add submitter reference
    itemData.submitter = {
      _type: 'reference',
      _ref: userId,
    };

    // Create item in Sanity
    const item = await sanityClient.create(itemData as any);

    // If paid plan, create checkout session
    if (data.pricePlan !== 'free') {
      const priceId = data.pricePlan === 'pro'
        ? config.public.stripeProPriceId
        : config.public.stripeSponsorPriceId;

      if (priceId) {
        const session = await createCheckoutSession({
          priceId,
          userId,
          itemId: item._id,
          successUrl: `${config.public.appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${config.public.appUrl}/payment/cancel`,
        });

        return {
          success: true,
          item,
          checkoutUrl: session.url,
        };
      }
    }

    return {
      success: true,
      item,
      message: 'Submission received! We will review it shortly.',
    };
  } catch (error) {
    console.error('Submit error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to submit item',
    });
  }
});

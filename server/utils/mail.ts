import { Resend } from 'resend';

const config = useRuntimeConfig();

/**
 * Resend email client
 */
export const resend = new Resend(config.resendApiKey);

const SITE_URL = config.public.appUrl;
const EMAIL_FROM = config.resendEmailFrom;
const EMAIL_ADMIN = config.resendEmailAdmin;

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  userName: string,
  email: string,
  token: string
) {
  const resetLink = `${SITE_URL}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Reset your password',
    html: `
      <h1>Reset your password</h1>
      <p>Hi ${userName},</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
}

/**
 * Send email verification
 */
export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${SITE_URL}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Confirm your email',
    html: `
      <h1>Confirm your email</h1>
      <p>Click the link below to confirm your email:</p>
      <a href="${confirmLink}">${confirmLink}</a>
    `,
  });
}

/**
 * Send submission notification to user and admin
 */
export async function sendNotifySubmissionEmail(
  userName: string,
  userEmail: string,
  itemName: string,
  statusLink: string,
  reviewLink: string
) {
  // Notify user
  await resend.emails.send({
    from: EMAIL_FROM,
    to: userEmail,
    subject: 'Thank you for your submission',
    html: `
      <h1>Thank you for your submission!</h1>
      <p>Hi ${userName},</p>
      <p>Your submission "${itemName}" has been received.</p>
      <p>You can check the status here: <a href="${statusLink}">${statusLink}</a></p>
    `,
  });

  // Notify admin
  if (EMAIL_ADMIN) {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_ADMIN,
      subject: 'New submission',
      html: `
        <h1>New submission received</h1>
        <p>Item: ${itemName}</p>
        <p>Review: <a href="${reviewLink}">${reviewLink}</a></p>
      `,
    });
  }
}

/**
 * Send payment success email
 */
export async function sendPaymentSuccessEmail(
  userName: string,
  email: string,
  itemLink: string
) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Thank you for your submission',
    html: `
      <h1>Payment Successful!</h1>
      <p>Hi ${userName},</p>
      <p>Your payment has been processed successfully.</p>
      <p>View your submission: <a href="${itemLink}">${itemLink}</a></p>
    `,
  });
}

/**
 * Send approval email
 */
export async function sendApprovalEmail(
  userName: string,
  email: string,
  itemLink: string
) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Your submission has been approved',
    html: `
      <h1>Congratulations!</h1>
      <p>Hi ${userName},</p>
      <p>Your submission has been approved and is now live!</p>
      <p>View it here: <a href="${itemLink}">${itemLink}</a></p>
    `,
  });
}

/**
 * Send rejection email
 */
export async function sendRejectionEmail(
  userName: string,
  email: string,
  dashboardLink: string
) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Please check your submission',
    html: `
      <h1>Submission Update</h1>
      <p>Hi ${userName},</p>
      <p>Your submission needs some changes. Please check your dashboard for details.</p>
      <p><a href="${dashboardLink}">${dashboardLink}</a></p>
    `,
  });
}

/**
 * Send newsletter welcome email
 * 
 * @param email - Subscriber email
 * @param isResubscribe - Whether this is a resubscription
 */
export async function sendNewsletterWelcomeEmail(
  email: string,
  isResubscribe: boolean = false
) {
  const subject = isResubscribe 
    ? 'Welcome back to our newsletter!' 
    : 'Welcome to our newsletter!';
  
  const heading = isResubscribe
    ? 'Welcome Back!'
    : 'Thanks for Subscribing!';
  
  const message = isResubscribe
    ? "We're glad to have you back! You'll receive our latest updates and news."
    : "You're now part of our community! We'll keep you updated with the latest news, tips, and exclusive content.";

  // Unsubscribe link (you can implement this endpoint later)
  const unsubscribeLink = `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;

  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #6366f1; margin-bottom: 10px;">${heading}</h1>
          </div>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            ${message}
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
            If you didn't subscribe to this newsletter, you can 
            <a href="${unsubscribeLink}" style="color: #6366f1;">unsubscribe here</a>.
          </p>
          
          <p style="font-size: 12px; color: #999; text-align: center;">
            © ${new Date().getFullYear()} All rights reserved.
          </p>
        </body>
      </html>
    `,
  });
}

/**
 * Google OAuth Sign In - Redirect to Google
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const callbackUrl = (query.callbackUrl as string) || '/';

  if (!config.authGoogleClientId) {
    throw createError({
      statusCode: 500,
      message: 'Google OAuth is not configured',
    });
  }

  // Store callback URL in cookie for later use
  setCookie(event, 'auth-callback-url', callbackUrl, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
  });

  // Generate state for CSRF protection
  const state = crypto.randomUUID();
  setCookie(event, 'auth-state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10,
  });

  // Build Google OAuth URL
  const redirectUri = `${config.public.appUrl}/api/auth/callback/google`;
  
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', config.authGoogleClientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('state', state);
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'consent');

  return sendRedirect(event, googleAuthUrl.toString());
});

/**
 * GitHub OAuth Sign In - Redirect to GitHub
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const callbackUrl = (query.callbackUrl as string) || '/';

  if (!config.authGithubClientId) {
    throw createError({
      statusCode: 500,
      message: 'GitHub OAuth is not configured',
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

  // Build GitHub OAuth URL
  const redirectUri = `${config.public.appUrl}/api/auth/callback/github`;
  const scope = 'read:user user:email';
  
  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.set('client_id', config.authGithubClientId);
  githubAuthUrl.searchParams.set('redirect_uri', redirectUri);
  githubAuthUrl.searchParams.set('scope', scope);
  githubAuthUrl.searchParams.set('state', state);

  return sendRedirect(event, githubAuthUrl.toString());
});

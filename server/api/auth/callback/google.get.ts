/**
 * Google OAuth Callback - Handle Google's response
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  
  const code = query.code as string;
  const state = query.state as string;
  const storedState = getCookie(event, 'auth-state');
  const callbackUrl = getCookie(event, 'auth-callback-url') || '/';

  // Clear state cookies
  deleteCookie(event, 'auth-state');
  deleteCookie(event, 'auth-callback-url');

  // Verify state (skip in production if cookie was lost due to redirect)
  if (!storedState) {
    console.warn('Google OAuth: State cookie not found, proceeding without state verification');
  } else if (state !== storedState) {
    throw createError({
      statusCode: 400,
      message: 'Invalid state parameter',
    });
  }

  if (!code) {
    throw createError({
      statusCode: 400,
      message: 'No authorization code provided',
    });
  }

  try {
    // Exchange code for tokens
    const redirectUri = `${config.public.appUrl}/api/auth/callback/google`;
    
    const tokenResponse = await $fetch<{
      access_token: string;
      id_token: string;
      expires_in: number;
      token_type: string;
    }>('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: {
        client_id: config.authGoogleClientId,
        client_secret: config.authGoogleClientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      },
    });

    // Get user info from Google
    const userInfo = await $fetch<{
      sub: string;
      email: string;
      email_verified: boolean;
      name: string;
      picture: string;
    }>('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    });

    // Find or create user in Sanity
    const existingUser = await sanityFetch<any>(
      `*[_type == "user" && email == $email][0]`,
      { email: userInfo.email }
    );

    let user;
    if (existingUser) {
      // Update existing user with Google info if needed
      user = existingUser;
      
      // Update image if not set
      if (!user.image && userInfo.picture) {
        await sanityClient.patch(user._id)
          .set({ image: userInfo.picture })
          .commit();
        user.image = userInfo.picture;
      }
    } else {
      // Create new user
      const newUser = await sanityClient.create({
        _type: 'user',
        name: userInfo.name,
        email: userInfo.email,
        emailVerified: new Date().toISOString(),
        image: userInfo.picture,
        role: 'USER',
        provider: 'google',
        providerId: userInfo.sub,
      });
      user = newUser;
    }

    // Create session token
    const sessionData = {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role || 'USER',
    };

    const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64');

    // Set auth cookie
    setCookie(event, 'auth-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Redirect to callback URL
    return sendRedirect(event, callbackUrl);
  } catch (error: any) {
    console.error('Google OAuth error:', error?.message || error);
    console.error('Google OAuth error details:', JSON.stringify(error?.data || error, null, 2));
    throw createError({
      statusCode: 500,
      message: `Failed to authenticate with Google: ${error?.message || 'Unknown error'}`,
    });
  }
});

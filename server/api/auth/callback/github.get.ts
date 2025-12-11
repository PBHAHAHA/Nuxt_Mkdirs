/**
 * GitHub OAuth Callback - Handle GitHub's response
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
    console.warn('GitHub OAuth: State cookie not found, proceeding without state verification');
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
    // Exchange code for access token
    const tokenResponse = await $fetch<{
      access_token?: string;
      token_type?: string;
      scope?: string;
      error?: string;
      error_description?: string;
    }>('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        client_id: config.authGithubClientId,
        client_secret: config.authGithubClientSecret,
        code,
      },
    });

    // Check for GitHub error response
    if (tokenResponse.error) {
      console.error('GitHub token error:', tokenResponse.error, tokenResponse.error_description);
      throw new Error(`GitHub OAuth error: ${tokenResponse.error_description || tokenResponse.error}`);
    }

    if (!tokenResponse.access_token) {
      console.error('GitHub token response:', JSON.stringify(tokenResponse));
      throw new Error('No access token received from GitHub');
    }

    // Get user info from GitHub
    const userInfo = await $fetch<{
      id: number;
      login: string;
      name: string;
      email: string;
      avatar_url: string;
    }>('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Nuxt-Mkdirs-App',
      },
    });

    // If email is not public, fetch from emails endpoint
    let email = userInfo.email;
    if (!email) {
      const emails = await $fetch<Array<{
        email: string;
        primary: boolean;
        verified: boolean;
      }>>('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Nuxt-Mkdirs-App',
        },
      });
      
      const primaryEmail = emails.find(e => e.primary && e.verified);
      email = primaryEmail?.email || emails[0]?.email;
    }

    if (!email) {
      throw createError({
        statusCode: 400,
        message: 'Could not get email from GitHub',
      });
    }

    // Find or create user in Sanity
    const existingUser = await sanityFetch<any>(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );

    let user;
    if (existingUser) {
      // Update existing user with GitHub info if needed
      user = existingUser;
      
      // Update image if not set
      if (!user.image && userInfo.avatar_url) {
        await sanityClient.patch(user._id)
          .set({ image: userInfo.avatar_url })
          .commit();
        user.image = userInfo.avatar_url;
      }
    } else {
      // Create new user
      const newUser = await sanityClient.create({
        _type: 'user',
        name: userInfo.name || userInfo.login,
        email,
        emailVerified: new Date().toISOString(),
        image: userInfo.avatar_url,
        role: 'USER',
        provider: 'github',
        providerId: String(userInfo.id),
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
    console.error('GitHub OAuth error:', error?.message || error);
    console.error('GitHub OAuth error details:', JSON.stringify(error?.data || error, null, 2));
    throw createError({
      statusCode: 500,
      message: `Failed to authenticate with GitHub: ${error?.message || 'Unknown error'}`,
    });
  }
});

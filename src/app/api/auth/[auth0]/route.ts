import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  signin: handleLogin({
    returnTo: '/home',
    authorizationParams: {
      prompt: 'login',
    },
  }),
  signup: handleLogin({
    // put user in dynamodb in auth0 dashboard
    authorizationParams: {
      screen_hint: 'signup',
      prompt: 'login',
    },
    returnTo: '/profile',
  }),
  logout: handleLogout({
    returnTo: '/',
  }),
});

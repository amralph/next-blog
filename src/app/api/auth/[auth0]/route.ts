import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  signin: handleLogin({
    returnTo: '/home',
    authorizationParams: {
      prompt: 'login',
    },
  }),
  signup: handleLogin({
    authorizationParams: {
      screen_hint: 'signup',
      prompt: 'login',
    },
    returnTo: '/home',
  }),
  logout: handleLogout({
    returnTo: '/',
  }),
});

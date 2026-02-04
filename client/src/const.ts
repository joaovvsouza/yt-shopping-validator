export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  
  // Validação para valores de exemplo/desenvolvimento
  if (!oauthPortalUrl || 
      oauthPortalUrl.includes('your-oauth') || 
      oauthPortalUrl.includes('example.com') ||
      oauthPortalUrl === '') {
    console.error('⚠️ VITE_OAUTH_PORTAL_URL não está configurada corretamente no .env');
    return '#';
  }
  
  if (!appId || appId.includes('your-app') || appId === '') {
    console.error('⚠️ VITE_APP_ID não está configurada corretamente no .env');
    return '#';
  }
  
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

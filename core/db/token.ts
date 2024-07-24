import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { jwtDecode, JwtPayload } from 'jwt-decode';

// Retrieve Supabase URL and key from environment variables
const supabasePublicUrl: string = process.env.REACT_APP_SUPABASE_URL || '';
const supabasePublicKey: string = process.env.REACT_APP_SUPABASE_KEY || '';

// Create a Supabase client instance
const supabase: SupabaseClient = createClient(supabasePublicUrl, supabasePublicKey);

// Define an interface for the decoded token payload
interface DecodedToken extends JwtPayload {
  exp: number; // Expiration time of the token
}

// Function to check if a token is expired
function isTokenExpired(token: string): boolean {
  const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token); // Decode the token
  const currentTime: number = Date.now() / 1000; // Get the current time in seconds
  return decodedToken.exp < currentTime; // Compare token expiration time with current time
}

// Function to check and refresh tokens if necessary
export async function checkTokens(
  accessToken: string | undefined, 
  refreshToken: string | undefined
): Promise<{ accessToken: string, refreshToken: string }> {

  if (!accessToken) { return Promise.reject('Access token is not available'); } // Check if access token is available

  if (!refreshToken) { return Promise.reject('Refresh token is not available'); } // Check if refresh token is available

  // Check if the access token is expired
  if (isTokenExpired(accessToken)) {
    console.log('Access token is expired, attempting to refresh');
    // Attempt to refresh the access token using the refresh token
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

    // Handle error or missing session data
    if (error || !data || !data.session) {
      console.log('Error refreshing token, redirecting to login:', error);
      // Redirect to login page (consider using a routing library)
      window.location.href = '/login';
      return Promise.reject('Error refreshing token');
    }

    // Update access and refresh tokens with new values
    accessToken = data.session?.access_token ?? '';
    refreshToken = data.session?.refresh_token ?? '';

    console.log('New access token:', accessToken);
    console.log('New refresh token:', refreshToken);
  } else {
    console.log('Access token is still valid');
  }

  return { accessToken, refreshToken };
}
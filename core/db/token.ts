import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { jwtDecode, JwtPayload } from 'jwt-decode';

// Retrieve Supabase URL and key from environment variables
const supabasePublicUrl: string = 'https://wmqwxxjpjphbspkcxtjt.supabase.co';
const supabasePublicKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtcXd4eGpwanBoYnNwa2N4dGp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5NzM2MzUsImV4cCI6MjAzMzU0OTYzNX0.wasgwu6xzGioGJ1MGNjtGBc0SNWEZq9yII4bioSF_f4';

// Create a Supabase client instance
const supabase: SupabaseClient = createClient(supabasePublicUrl, supabasePublicKey);

// Define an interface for the decoded token payload
interface DecodedToken extends JwtPayload {
  exp: number; // Expiration time of the token
}

// Function to check if a token is expired
function isTokenExpired(token: string): boolean {
  try {
    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token); // Decode the token
    const currentTime: number = Date.now() / 1000; // Get the current time in seconds
    return decodedToken.exp < currentTime; // Compare token expiration time with current time
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
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
    if (error || !data) {
      console.error('Error refreshing token:', error);
      alert('Session expired. Redirecting to login page.');
  
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
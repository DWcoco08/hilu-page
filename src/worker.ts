export interface Env {
  hilu_db: D1Database;  // Tên PHẢI khớp với binding trong wrangler.toml (đã sửa thành hilu_db)
  ENVIRONMENT: string;
  TURNSTILE_SECRET_KEY: string;  // Secret key cho Turnstile
}

interface ContactRequest {
  name: string;
  email: string;
  message?: string;
  turnstileToken: string;
}

interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
}

// Danh sách domains được phép
const allowedOrigins = [
  'https://hilutech.com',
  'https://www.hilutech.com',
  'https://hilu-page.pages.dev',
  'http://localhost:5173',
  'http://localhost:3000'
];

function getCorsHeaders(request: Request) {
  const origin = request.headers.get('Origin') || '';

  // Kiểm tra origin có trong danh sách không
  if (allowedOrigins.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
  }

  // Default fallback
  return {
    'Access-Control-Allow-Origin': 'https://hilutech.com',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const corsHeaders = getCorsHeaders(request);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // POST /api/contact - Tạo contact mới
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      try {
        const body: ContactRequest = await request.json();

        // Validate required fields
        if (!body.name || !body.email) {
          return new Response(
            JSON.stringify({ error: 'Name and email are required' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Verify Turnstile token
        if (!body.turnstileToken) {
          return new Response(
            JSON.stringify({ error: 'Captcha verification required' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Verify token with Cloudflare
        const secretKey = env.TURNSTILE_SECRET_KEY || '0x4AAAAAAB2-jIIkTD7xWkHe3Hb3Cf4CQqE';
        console.log('Using secret key:', secretKey.substring(0, 10) + '...');
        console.log('Received token:', body.turnstileToken?.substring(0, 20) + '...');

        const verifyBody = {
          secret: secretKey,
          response: body.turnstileToken,
        };

        const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(verifyBody),
        });

        const turnstileData: TurnstileResponse = await turnstileResponse.json();
        console.log('Turnstile verification result:', turnstileData);

        if (!turnstileData.success) {
          console.error('Turnstile verification failed:', turnstileData['error-codes']);
          return new Response(
            JSON.stringify({
              error: 'Captcha verification failed',
              details: turnstileData['error-codes']
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Get additional info
        const ip_address = request.headers.get('CF-Connecting-IP') || 'Unknown';
        const user_agent = request.headers.get('User-Agent') || 'Unknown';

        // Insert to database
        const result = await env.hilu_db.prepare(
          `INSERT INTO contacts (name, email, message, ip_address, user_agent)
           VALUES (?, ?, ?, ?, ?)`
        )
        .bind(body.name, body.email, body.message || null, ip_address, user_agent)
        .run();

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Contact saved successfully',
            id: result.meta.last_row_id
          }),
          {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );

      } catch (error) {
        console.error('Error saving contact:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to save contact' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // GET /api/contacts - Lấy danh sách contacts
    if (url.pathname === '/api/contacts' && request.method === 'GET') {
      try {
        const { results } = await env.hilu_db.prepare(
          `SELECT * FROM contacts ORDER BY created_at DESC LIMIT 100`
        ).all();

        return new Response(
          JSON.stringify({
            success: true,
            contacts: results
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );

      } catch (error) {
        console.error('Error fetching contacts:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch contacts' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // GET /api/health - Health check
    if (url.pathname === '/api/health' && request.method === 'GET') {
      return new Response(
        JSON.stringify({
          status: 'healthy',
          environment: env.ENVIRONMENT,
          timestamp: new Date().toISOString()
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 404 for other routes
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  },
};
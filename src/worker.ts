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

// Interface cho scheduled response
interface ScheduledController {
  scheduledTime: number;
  cron: string;
  noRetry(): void;
}

export default {
  // Scheduled handler - chạy theo cron schedule
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log(`Cron job executed at ${new Date(controller.scheduledTime).toISOString()}`);
    console.log(`Cron expression: ${controller.cron}`);

    try {
      // Lấy tất cả contacts từ database
      const { results } = await env.hilu_db.prepare(
        `SELECT COUNT(*) as total FROM contacts`
      ).first();

      const totalContacts = results?.total || 0;
      console.log(`Total contacts in database: ${totalContacts}`);

      // Lấy contacts mới trong 24h qua
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { results: newContacts } = await env.hilu_db.prepare(
        `SELECT * FROM contacts WHERE created_at > ? ORDER BY created_at DESC`
      ).bind(oneDayAgo).all();

      console.log(`New contacts in last 24 hours: ${newContacts.length}`);

      // Log chi tiết contacts mới (nếu có)
      if (newContacts.length > 0) {
        console.log('Recent contacts:');
        newContacts.forEach((contact: any) => {
          console.log(`- ${contact.name} (${contact.email}) at ${contact.created_at}`);
        });
      }

      // Có thể thêm logic gửi email, webhook, hoặc sync sang Google Sheet tự động
      // Ví dụ: Gửi webhook sang Slack, Discord, hoặc Make/Zapier

      // Optional: Lưu log vào database
      await env.hilu_db.prepare(
        `INSERT INTO cron_logs (executed_at, total_contacts, new_contacts_24h, status)
         VALUES (?, ?, ?, ?)`
      ).bind(
        new Date(controller.scheduledTime).toISOString(),
        totalContacts,
        newContacts.length,
        'success'
      ).run().catch(() => {
        // Bỏ qua nếu table cron_logs chưa tồn tại
        console.log('Note: cron_logs table does not exist yet');
      });

    } catch (error) {
      console.error('Error in scheduled job:', error);
      // Không retry nếu có lỗi
      controller.noRetry();
    }
  },

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

    // GET /data/json - Lấy data từ contacts để export sang Google Sheet
    if (url.pathname === '/data/json' && request.method === 'GET') {
      try {
        const { results } = await env.hilu_db.prepare(
          `SELECT id, name, email, message, created_at, ip_address, user_agent
           FROM contacts
           ORDER BY created_at DESC`
        ).all();

        return new Response(
          JSON.stringify({
            success: true,
            data: results,
            count: results.length,
            timestamp: new Date().toISOString()
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        console.error('Error fetching contacts data:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch data' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // GET /data/html - Debug view dạng HTML table
    if (url.pathname === '/data/html' && request.method === 'GET') {
      try {
        const { results } = await env.hilu_db.prepare(
          `SELECT id, name, email, message, created_at, ip_address, user_agent
           FROM contacts
           ORDER BY created_at DESC`
        ).all();

        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Contacts Data</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        h1 { color: #333; }
        .stats { margin-bottom: 20px; padding: 10px; background: #e3f2fd; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Contacts Database</h1>
    <div class="stats">
        <strong>Total Records:</strong> ${results.length} |
        <strong>Last Updated:</strong> ${new Date().toISOString()}
    </div>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Created At</th>
                <th>IP Address</th>
                <th>User Agent</th>
            </tr>
        </thead>
        <tbody>
            ${results.map((row: any) => `
            <tr>
                <td>${row.id}</td>
                <td>${row.name}</td>
                <td>${row.email}</td>
                <td>${row.message || '-'}</td>
                <td>${row.created_at}</td>
                <td>${row.ip_address || '-'}</td>
                <td style="max-width:300px; overflow:hidden; text-overflow:ellipsis;">${row.user_agent || '-'}</td>
            </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>`;

        return new Response(html, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      } catch (error) {
        console.error('Error generating HTML view:', error);
        return new Response('Error loading data', { status: 500 });
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
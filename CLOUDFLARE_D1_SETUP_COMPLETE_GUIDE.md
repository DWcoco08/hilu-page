# 📚 Hướng Dẫn Setup Cloudflare D1 Database & Worker API Hoàn Chỉnh

## 📋 Mục Lục
1. [Tổng Quan](#tổng-quan)
2. [Setup Từ Đầu](#setup-từ-đầu)
3. [Troubleshooting - Các Lỗi Thường Gặp](#troubleshooting---các-lỗi-thường-gặp)
4. [Testing & Monitoring](#testing--monitoring)
5. [Best Practices](#best-practices)

---

## 🎯 Tổng Quan

### Tech Stack
- **Frontend:** React + Vite + TypeScript
- **Backend:** Cloudflare Workers
- **Database:** Cloudflare D1 (SQLite)
- **Hosting:** Cloudflare Pages
- **Form Management:** Contact form với validation

### Architecture Flow
```
User → Cloudflare Pages (Frontend) → Worker API → D1 Database
         (hilu-page.pages.dev)    (*.workers.dev)   (SQLite)
```

---

## 🚀 Setup Từ Đầu

### 1️⃣ Cài Đặt Dependencies
```bash
npm install --save-dev wrangler
```

### 2️⃣ Đăng Nhập Cloudflare
```bash
npx wrangler login
```
⚠️ **Quan trọng:** Chọn đúng account muốn deploy. Nếu có nhiều accounts, cẩn thận!

### 3️⃣ Tạo D1 Database
```bash
npx wrangler d1 create hilu-db
```

Output sẽ cho database ID:
```
database_id = "8a24b4a3-a703-43ef-a378-993019cfb93f"
```

### 4️⃣ Cấu Hình wrangler.toml
```toml
name = "hilu-website"
main = "src/worker.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "hilu_db"         # Tên binding PHẢI khớp với code
database_name = "hilu-db"
database_id = "YOUR-DATABASE-ID"  # Thay bằng ID từ bước 3
```

### 5️⃣ Tạo Database Schema
File `schema.sql`:
```sql
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
```

### 6️⃣ Run Migration
```bash
# Local development
npm run db:migrate

# Production
npm run db:migrate:remote
```

### 7️⃣ Tạo Worker API
File `src/worker.ts`:
```typescript
export interface Env {
  hilu_db: D1Database;  // PHẢI khớp với binding trong wrangler.toml
  ENVIRONMENT: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://hilu-page.pages.dev',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // API endpoints implementation...
  }
}
```

### 8️⃣ Update package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "db:create": "wrangler d1 create hilu-db",
    "db:migrate": "wrangler d1 execute hilu-db --local --file=./schema.sql",
    "db:migrate:remote": "wrangler d1 execute hilu-db --remote --file=./schema.sql",
    "worker:dev": "wrangler dev",
    "worker:deploy": "wrangler deploy"
  }
}
```

### 9️⃣ Deploy Worker
```bash
npm run worker:deploy
```

Lưu lại Worker URL từ output (ví dụ: `https://hilu-website.btt7m8gzm7.workers.dev`)

### 🔟 Update Frontend với Worker URL
Trong file React component:
```typescript
const workerUrl = 'https://hilu-website.btt7m8gzm7.workers.dev';

const response = await fetch(`${workerUrl}/api/contact`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
```

---

## 🔴 Troubleshooting - Các Lỗi Thường Gặp

### Lỗi 1: CORS Policy Block
**Triệu chứng:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Nguyên nhân:**
- CORS header không khớp với origin
- Worker URL bị cache với headers cũ
- Deploy tạo subdomain mới nhưng frontend vẫn dùng URL cũ

**Cách sửa:**
1. Kiểm tra origin thực tế:
```bash
curl -I -X OPTIONS YOUR-WORKER-URL/api/contact \
  -H "Origin: https://your-frontend-domain.pages.dev"
```

2. Update CORS headers trong worker.ts:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-actual-domain.pages.dev',
  // ...
};
```

3. Deploy lại và lấy URL mới:
```bash
npm run worker:deploy
```

4. Update frontend với Worker URL mới

---

### Lỗi 2: Authentication Error (Code 10000)
**Triệu chứng:**
```
Authentication error [code: 10000]
```

**Nguyên nhân:**
- Đăng nhập sai account
- Có nhiều Cloudflare accounts

**Cách sửa:**
```bash
npx wrangler logout
npx wrangler login
# Chọn đúng account
```

Hoặc thêm account_id vào wrangler.toml:
```toml
account_id = "YOUR-ACCOUNT-ID"
```

---

### Lỗi 3: Database Not Found
**Triệu chứng:**
```
Couldn't find DB with name 'database-name'
```

**Nguyên nhân:**
- Tên database không khớp
- Database ở account khác

**Cách sửa:**
1. Kiểm tra database list:
```bash
npx wrangler d1 list
```

2. Update tên đúng trong:
- wrangler.toml
- package.json scripts
- worker.ts binding

---

### Lỗi 4: Internal Server Error 500
**Nguyên nhân có thể:**
1. Database binding name không khớp
2. Database chưa migrate
3. Worker và Database ở khác account

**Cách sửa:**
1. Kiểm tra binding consistency:
- wrangler.toml: `binding = "hilu_db"`
- worker.ts: `env.hilu_db`

2. Run migration:
```bash
npm run db:migrate:remote
```

3. Verify cùng account cho Worker và D1

---

### Lỗi 5: Worker URL Không Update
**Triệu chứng:** Form vẫn gọi Worker URL cũ

**Nguyên nhân:**
- Cache browser
- Build chưa update
- Environment variable cũ

**Cách sửa:**
1. Clear browser cache (Ctrl+F5)
2. Rebuild frontend:
```bash
npm run build
```
3. Check và update Worker URL trong code
4. Push code để trigger auto-deploy

---

## 🧪 Testing & Monitoring

### Test Database Queries
```bash
# Xem tất cả contacts
npx wrangler d1 execute hilu-db --command "SELECT * FROM contacts" --remote

# Đếm số lượng
npx wrangler d1 execute hilu-db --command "SELECT COUNT(*) FROM contacts" --remote

# Xem 10 contacts mới nhất
npx wrangler d1 execute hilu-db --command "SELECT * FROM contacts ORDER BY created_at DESC LIMIT 10" --remote
```

### Test CORS Headers
```bash
# Test preflight request
curl -I -X OPTIONS https://your-worker.workers.dev/api/contact \
  -H "Origin: https://your-frontend.pages.dev"

# Test POST request
curl -X POST https://your-worker.workers.dev/api/contact \
  -H "Content-Type: application/json" \
  -H "Origin: https://your-frontend.pages.dev" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'
```

### Monitor Worker Logs
```bash
npx wrangler tail
```

### Check Database từ Cloudflare Dashboard
1. Dashboard → Workers & Pages → D1
2. Click vào database
3. Tab "Console" để run SQL queries

---

## ✅ Best Practices

### 1. Environment Management
- Sử dụng different databases cho dev/staging/prod
- Store sensitive data trong secrets:
```bash
npx wrangler secret put SECRET_NAME
```

### 2. Security
- Validate input data trước khi insert database
- Sanitize SQL queries (D1 tự động prevent SQL injection)
- Rate limiting để prevent spam:
```typescript
// Implement rate limiting in Worker
const rateLimit = await env.RATE_LIMITER.get(clientIP);
if (rateLimit > MAX_REQUESTS) {
  return new Response('Too many requests', { status: 429 });
}
```

### 3. Performance
- Use indexes cho fields thường query
- Limit số records returned
- Cache responses khi có thể:
```typescript
return new Response(JSON.stringify(data), {
  headers: {
    ...corsHeaders,
    'Cache-Control': 'public, max-age=300', // Cache 5 minutes
  },
});
```

### 4. Error Handling
```typescript
try {
  // Database operation
} catch (error) {
  console.error('Database error:', error);

  // Don't expose internal errors to client
  return new Response(
    JSON.stringify({ error: 'An error occurred' }),
    { status: 500, headers: corsHeaders }
  );
}
```

### 5. Backup Strategy
```bash
# Export database periodically
npx wrangler d1 execute hilu-db --command "SELECT * FROM contacts" --remote > backup.json
```

---

## 📊 Deployment Checklist

Trước khi deploy production:

- [ ] Database migrated với schema đúng
- [ ] CORS headers configured cho production domain
- [ ] Worker URL updated trong frontend code
- [ ] Environment variables set trong Cloudflare Pages
- [ ] Test form submission từ production domain
- [ ] Error handling implemented
- [ ] Rate limiting configured (optional)
- [ ] Backup plan ready
- [ ] Monitoring setup (Cloudflare Analytics)

---

## 🔗 Resources

### URLs Hiện Tại
- **Production Site:** https://hilu-page.pages.dev
- **Worker API:** https://hilu-website.btt7m8gzm7.workers.dev
- **GitHub Repo:** https://github.com/DWcoco08/hilu-page

### Documentation
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

### Support
- Cloudflare Discord
- Stack Overflow tag: `cloudflare-workers`
- GitHub Issues

---

## 📝 Version History

| Date | Version | Changes |
|------|---------|---------|
| 23/09/2025 | 1.0 | Initial setup with D1 database |
| 23/09/2025 | 1.1 | Fix CORS issues for hilu-page.pages.dev |
| 23/09/2025 | 1.2 | Complete documentation added |

---

*Last updated: 23/09/2025*
*Maintained by: Hilu Development Team*
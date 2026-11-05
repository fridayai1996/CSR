/**
 * Sri Sathya Sai District CSR Portal - Cloudflare Worker
 * Hardened Cloudflare security, rate limiting, and public civic endpoints.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\s-]{8,20}$/;

function securityHeaders() {
  return {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
    "X-Permitted-Cross-Domain-Policies": "none",
    "Content-Security-Policy":
      "default-src 'self'; base-uri 'self'; form-action 'self' https:; frame-ancestors 'none'; object-src 'none'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://unpkg.com; script-src 'self' 'unsafe-inline' https://code.jquery.com https://cdn.jsdelivr.net https://unpkg.com; connect-src 'self' https://srisathyasaicsr.com https://*.pages.dev;"
  };
}

function json(data, status = 200, extraHeaders) {
  const headers = new Headers(securityHeaders());
  headers.set("content-type", "application/json; charset=utf-8");
  if (extraHeaders) {
    for (const [key, value] of Object.entries(extraHeaders)) headers.set(key, value);
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function error(message, status = 400) {
  return json({ ok: false, error: message }, status);
}

function applySecurity(response) {
  const headers = new Headers(response.headers);
  const extra = securityHeaders();
  for (const [key, value] of Object.entries(extra)) {
    headers.set(key, value);
  }
  const contentType = (headers.get("content-type") || "").toLowerCase();
  if (contentType.includes("text/html")) {
    headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

// In-memory rate limiting bucket
const rateBuckets = new Map();

function clientIp(request) {
  return request.headers.get("CF-Connecting-IP") || request.headers.get("CF-Connecting-IPv6") || request.headers.get("x-forwarded-for") || "unknown";
}

function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  let rec = rateBuckets.get(key);
  if (!rec || now - rec.started > windowMs) {
    rec = { started: now, count: 0 };
  }
  rec.count += 1;
  rateBuckets.set(key, rec);
  if (rateBuckets.size > 4000) {
    for (const [k, v] of rateBuckets) {
      if (now - v.started > windowMs) rateBuckets.delete(k);
    }
  }
  return rec.count <= limit;
}

// Basic CSRF & origin verification for mutation requests
function checkOrigin(request) {
  const origin = request.headers.get("Origin");
  if (!origin) return true; // Direct/same-site browser navigation
  try {
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();
    return (
      host === "srisathyasaicsr.com" ||
      host === "www.srisathyasaicsr.com" ||
      host.endsWith(".pages.dev") ||
      host.endsWith(".workers.dev") ||
      host === "localhost" ||
      host === "127.0.0.1"
    );
  } catch (_e) {
    return false;
  }
}

async function readJson(request) {
  const text = await request.text();
  if (!text) return {};
  if (text.length > 25000) throw new Error("Payload too large");
  try {
    return JSON.parse(text);
  } catch (_err) {
    throw new Error("Invalid JSON");
  }
}

function sanitizeText(str, maxLen = 500) {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, maxLen);
}

// Fallback project list aligned with Official Concept Note (PDF) - Zero private company names
const STATIC_PROJECTS = [
  {
    id: 1,
    title: "Digital Learning Infrastructure for Government High Schools",
    mandal: "District-wide",
    sector: "Education & Digital Learning",
    budget: "₹25.00 Lakhs",
    sponsor: "Open for Corporate Adoption",
    status: "Proposed",
    progress_pct: 0,
    milestones: "Site survey & school list finalised; ready for procurement",
    beneficiaries: "1,000 students across 10 high schools",
    priority: "High Priority",
    components: "Computer lab setup, interactive digital smartboards, teacher ICT orientation, 3-year warranty and maintenance",
    outcomes: "Measurable improvement in STEM learning outcomes and 100% digital literacy for secondary grades",
    dpr_code: "DPR-EDU-2026-01"
  },
  {
    id: 2,
    title: "Primary Health Centre (PHC) Diagnostic & Mobile Screening Equipment",
    mandal: "Puttaparthi & Penukonda",
    sector: "Healthcare & Diagnostics",
    budget: "₹45.00 Lakhs",
    sponsor: "Open for Corporate Adoption",
    status: "Proposed",
    progress_pct: 0,
    milestones: "Clinical equipment specifications locked by District Medical Officer",
    beneficiaries: "12,000 rural residents & expectant mothers",
    priority: "High Priority",
    components: "Fully equipped Mobile Health Screening Unit, digital X-ray, automated hematology analyzers, ultrasound diagnostic kit",
    outcomes: "Early detection of non-communicable diseases, routine maternal screenings, reduced referral transit times",
    dpr_code: "DPR-HLT-2026-02"
  },
  {
    id: 3,
    title: "SC & BC Welfare Hostels Modernization & Sanitation Overhaul",
    mandal: "District-wide (42 Hostels)",
    sector: "Social Welfare & Hostels",
    budget: "₹65.00 Lakhs",
    sponsor: "District CSR Facilitation Stream",
    status: "In Progress",
    progress_pct: 40,
    milestones: "Phase-1 civil works underway across 18 hostels in Kadiri & Dharmavaram",
    beneficiaries: "3,200 residential students",
    priority: "High Priority",
    components: "High-capacity RO drinking water plants, solar hot water geysers, hygienic modern dining halls, tiled sanitation blocks",
    outcomes: "Safe residential living conditions, zero water-borne infections, dignified stay for marginalized students",
    dpr_code: "DPR-WLF-2026-03"
  },
  {
    id: 4,
    title: "Model Anganwadi Child-Friendly Centers & Toddler Nutrition Upgrades",
    mandal: "Dharmavaram & Madakasira",
    sector: "Anganwadi & Child Development",
    budget: "₹30.00 Lakhs",
    sponsor: "Open for Corporate Adoption",
    status: "Proposed",
    progress_pct: 0,
    milestones: "Site inspection complete across 25 rural Anganwadi buildings",
    beneficiaries: "850 infants, toddlers & nursing mothers",
    priority: "High Priority",
    components: "Child-safe learning spaces, educational toys & play equipment, clean drinking water systems, fortified food prep counters",
    outcomes: "Drastic reduction in severe acute malnutrition (SAM) and improved pre-school cognitive readiness",
    dpr_code: "DPR-ICDS-2026-04"
  },
  {
    id: 5,
    title: "Rural Women Self-Help Group (SHG) Sericulture & Weaving Enterprises",
    mandal: "Dharmavaram & Lepakshi",
    sector: "Livelihoods & Women's Empowerment",
    budget: "₹50.00 Lakhs",
    sponsor: "Open for Corporate Adoption",
    status: "Proposed",
    progress_pct: 0,
    milestones: "SHG federation mobilization and market-linkage study complete",
    beneficiaries: "450 women artisans & silk weavers",
    priority: "Medium Priority",
    components: "Modern motorized silk reeling machines, computerized jacquard design workstations, common processing center, market linkages",
    outcomes: "Direct monthly income increase of ₹6,500+ per artisan household and revival of traditional Lepakshi craft motifs",
    dpr_code: "DPR-LIV-2026-05"
  },
  {
    id: 6,
    title: "Youth Vocational Technical Skill Development & EV Training Hub",
    mandal: "Penukonda Industrial Corridor",
    sector: "Skill Development & Employment",
    budget: "₹80.00 Lakhs",
    sponsor: "District CSR Facilitation Stream",
    status: "In Progress",
    progress_pct: 55,
    milestones: "Facility lease secured; lab equipment procurement initiated",
    beneficiaries: "600 rural youths per annum",
    priority: "High Priority",
    components: "Electric Vehicle (EV) assembly & battery diagnostics lab, CNC mechatronics tools, industry certification curriculum",
    outcomes: "Guaranteed 85%+ formal sector placements in Penukonda automobile manufacturing hub",
    dpr_code: "DPR-SKL-2026-06"
  },
  {
    id: 7,
    title: "Rural Habitations Solar-Powered Safe Drinking Water RO Network",
    mandal: "Kadiri & NP Kunta",
    sector: "Drinking Water & Sanitation",
    budget: "₹40.00 Lakhs",
    sponsor: "Open for Corporate Adoption",
    status: "Proposed",
    progress_pct: 0,
    milestones: "Water quality fluorosis mapping verified by rural water supply engineers",
    beneficiaries: "8,500 villagers across 8 fluorosis-affected habitations",
    priority: "High Priority",
    components: "2,000 LPH RO water treatment plants powered by dedicated solar PV rooftop arrays and automated smart water-card dispensing",
    outcomes: "Complete elimination of fluoride-induced ailments and assured potable water security",
    dpr_code: "DPR-WTR-2026-07"
  },
  {
    id: 8,
    title: "Solar Micro-Grid & Energy Self-Sufficiency for Government High Schools",
    mandal: "NP Kunta & Puttaparthi",
    sector: "Environmental Sustainability",
    budget: "₹35.00 Lakhs",
    sponsor: "Open for Corporate Adoption",
    status: "Proposed",
    progress_pct: 0,
    milestones: "Roof structural audit completed across 15 identified secondary schools",
    beneficiaries: "4,500 students & administrative facilities",
    priority: "Medium Priority",
    components: "5 kW to 10 kW hybrid solar rooftop installations with lithium-ion battery banks, net-metering synchronization, energy monitors",
    outcomes: "Zero power disruption for digital smart classes and offset of 65 metric tons of CO2 annually",
    dpr_code: "DPR-ENV-2026-08"
  }
];

async function handleApi(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const method = request.method.toUpperCase();

  // 1. Health check
  if (path === "/api/health" && method === "GET") {
    return json({ ok: true, platform: "cloudflare-workers", portal: "srisathyasai-csr", status: "operational" });
  }

  // 2. Proposal Submission (EoI Form)
  if (path === "/api/proposals" && method === "POST") {
    if (!checkOrigin(request)) {
      return error("Cross-origin submission rejected.", 403);
    }
    const ip = clientIp(request);
    if (!rateLimit("eoi:" + ip, 8, 60 * 60 * 1000)) {
      return error("Too many proposals submitted from this network. Please try again later.", 429);
    }

    try {
      const body = await readJson(request);

      // Honeypot check
      if (body.fax_number_leave_blank || body.website_url_hp) {
        return json({ ok: true, id: "SSS-CSR-" + Math.floor(100000 + Math.random() * 900000), note: "Filtered" }, 201);
      }

      const company_name = sanitizeText(body.company_name, 200);
      const contact_person = sanitizeText(body.contact_person, 120);
      const email = sanitizeText(body.email, 120).toLowerCase();
      const phone = sanitizeText(body.phone, 40);
      const sector = sanitizeText(body.sector, 80);
      const outlay_amount = sanitizeText(body.outlay_amount, 80);
      const location = sanitizeText(body.location || "Sri Sathya Sai District", 120);
      const details = sanitizeText(body.details, 1000) || null;
      const consent_given = body.consent_given === true || body.consent_given === 1 || body.consent_given === "1";

      if (!consent_given) {
        return error("Affirmative consent under the Digital Personal Data Protection Act, 2023 is required.");
      }
      if (company_name.length < 2 || contact_person.length < 2 || !EMAIL_RE.test(email) || !phone || !sector || !outlay_amount) {
        return error("Please complete all required proposal fields.");
      }
      if (!PHONE_RE.test(phone) || phone.replace(/\D/g, "").length < 10) {
        return error("Enter a valid phone number with at least 10 digits.");
      }

      let referenceId = "SSS-CSR-" + Math.floor(100000 + Math.random() * 900000);

      // Persist to D1 database if bound
      if (env && env.DB) {
        try {
          const insert = await env.DB.prepare(
            `INSERT INTO proposals (company_name, contact_person, email, phone, sector, outlay_amount, location, details, consent_given, nodal_status, sponsor_status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 'Submitted', 'Received')
             RETURNING id`
          )
            .bind(company_name, contact_person, email, phone, sector, outlay_amount, location, details)
            .first();

          if (insert && insert.id) {
            referenceId = "SSS-CSR-" + insert.id;
          }
        } catch (dbErr) {
          console.log(JSON.stringify({ level: "warn", msg: "D1 write fallback", err: String(dbErr && dbErr.message) }));
        }
      }

      return json({
        ok: true,
        id: referenceId,
        message: "Your Expression of Interest has been registered with Sri Sathya Sai District CSR Cell."
      }, 201);
    } catch (err) {
      console.log(JSON.stringify({ level: "error", msg: String(err && err.message) }));
      return error("Unable to process proposal. Please verify fields and try again.", 400);
    }
  }

  // 3. Contact Us / Helpdesk Form Submission
  if (path === "/api/contact" && method === "POST") {
    if (!checkOrigin(request)) {
      return error("Cross-origin submission rejected.", 403);
    }
    const ip = clientIp(request);
    if (!rateLimit("contact:" + ip, 6, 60 * 60 * 1000)) {
      return error("Too many contact submissions from this network. Please try again later.", 429);
    }

    try {
      const body = await readJson(request);

      // Honeypot check
      if (body.company_website || body.fax_field) {
        return json({ ok: true, id: "SSS-HLP-" + Math.floor(10000 + Math.random() * 90000) }, 201);
      }

      const name = sanitizeText(body.name, 120);
      const email = sanitizeText(body.email, 120).toLowerCase();
      const phone = sanitizeText(body.phone, 40) || null;
      const subject = sanitizeText(body.subject || "General Inquiry", 150);
      const message = sanitizeText(body.message, 2000);
      const consent_given = body.consent_given === true || body.consent_given === 1 || body.consent_given === "1";

      if (!consent_given) {
        return error("Consent under DPDP Act, 2023 is required.");
      }
      if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 10) {
        return error("Please provide your name, a valid email, and a message of at least 10 characters.");
      }

      let referenceId = "SSS-HLP-" + Math.floor(100000 + Math.random() * 900000);

      // Persist to D1 if available
      if (env && env.DB) {
        try {
          const insert = await env.DB.prepare(
            `INSERT INTO contact_messages (name, email, phone, subject, message, consent_given, status)
             VALUES (?, ?, ?, ?, ?, 1, 'Received')
             RETURNING id`
          )
            .bind(name, email, phone, subject, message)
            .first();

          if (insert && insert.id) {
            referenceId = "SSS-HLP-" + insert.id;
          }
        } catch (dbErr) {
          console.log(JSON.stringify({ level: "warn", msg: "D1 contact write fallback", err: String(dbErr && dbErr.message) }));
        }
      }

      return json({
        ok: true,
        id: referenceId,
        message: "Thank you for reaching out. The District CSR Facilitation Cell will review your query shortly."
      }, 201);
    } catch (err) {
      console.log(JSON.stringify({ level: "error", msg: String(err && err.message) }));
      return error("Unable to send inquiry. Please try again.", 400);
    }
  }

  // 4. Public Projects Directory (CSR Project Bank)
  if (path === "/api/projects" && method === "GET") {
    const sectorFilter = url.searchParams.get("sector");
    const priorityFilter = url.searchParams.get("priority");
    const mandalFilter = url.searchParams.get("mandal");

    if (env && env.DB) {
      try {
        let query = "SELECT id, title, mandal, sector, budget, sponsor, status, progress_pct, milestones, beneficiaries, priority, components, outcomes, dpr_code FROM projects WHERE 1=1";
        const params = [];

        if (sectorFilter && sectorFilter !== "all") {
          query += " AND (sector LIKE ? OR sector = ?)";
          params.push(`%${sectorFilter}%`, sectorFilter);
        }
        if (priorityFilter && priorityFilter !== "all") {
          query += " AND priority = ?";
          params.push(priorityFilter);
        }
        if (mandalFilter && mandalFilter !== "all") {
          query += " AND (mandal LIKE ? OR mandal = ?)";
          params.push(`%${mandalFilter}%`, mandalFilter);
        }
        query += " ORDER BY id ASC";

        const stmt = params.length > 0 ? env.DB.prepare(query).bind(...params) : env.DB.prepare(query);
        const rows = await stmt.all();
        if (rows && rows.results) {
          return json({ ok: true, data: rows.results, count: rows.results.length });
        }
      } catch (_e) {
        // Fall back to static
      }
    }

    let staticFiltered = STATIC_PROJECTS;
    if (sectorFilter && sectorFilter !== "all") {
      staticFiltered = staticFiltered.filter(p => p.sector.toLowerCase().includes(sectorFilter.toLowerCase()));
    }
    if (priorityFilter && priorityFilter !== "all") {
      staticFiltered = staticFiltered.filter(p => p.priority === priorityFilter);
    }
    return json({ ok: true, data: staticFiltered, count: staticFiltered.length });
  }

  // 5. Deprecated Auth Endpoints
  if (path.startsWith("/api/auth/") || path === "/api/me") {
    return json({
      ok: false,
      message: "User login is no longer required. The Sri Sathya Sai District CSR portal is open and publicly accessible.",
      user: null
    }, 200);
  }

  return error("Endpoint not found.", 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API Handling
    if (url.pathname.startsWith("/api/")) {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: Object.assign(securityHeaders(), { Allow: "GET,POST,OPTIONS" })
        });
      }
      return handleApi(request, env);
    }

    // Static Asset Handling with Cloudflare Security Headers
    // Guard against hidden or sensitive config/source access
    const lowerPath = url.pathname.toLowerCase();
    if (lowerPath.startsWith("/.") || lowerPath.startsWith("/src/") || lowerPath.startsWith("/migrations/") || lowerPath.endsWith(".env") || lowerPath.endsWith(".jsonc") || lowerPath.endsWith(".sql")) {
      return error("Forbidden", 403);
    }

    if (url.pathname === "/" || url.pathname === "") {
      const indexRes = await env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request));
      return applySecurity(indexRes);
    }

    return applySecurity(await env.ASSETS.fetch(request));
  }
};

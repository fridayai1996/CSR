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

// Fallback project list aligned with Official Concept Note (PDF) - 12 Statutory CSR Projects (Schedule VII Items i to xii)
const STATIC_PROJECTS = [
  {
    id: 1,
    title: "Safe RO Drinking Water Hubs & Community Nutrition Centers",
    mandal: "Kadiri & NP Kunta",
    sector: "Healthcare & Sanitation",
    budget: "₹1.50 Crores",
    sponsor: "Open for Adoption",
    status: "Proposed",
    progress_pct: 0,
    milestones: "Water quality fluorosis survey completed across 15 identified habitations",
    beneficiaries: "15,000 rural residents across fluorosis habitations",
    priority: "High Priority",
    components: "15 community solar-powered RO water filtration hubs, 2,000 LPH treatment plants, automated smart-card dispensing, nutrition counseling suites",
    outcomes: "100% elimination of water-borne and fluorosis-induced ailments, assured potable water security",
    dpr_code: "DPR-WTR-01"
  },
  {
    id: 2,
    title: "Smart Digital High Schools, STEM Labs & EV Skill Hub",
    mandal: "Penukonda & Puttaparthi",
    sector: "Smart Education & Skills",
    budget: "₹2.00 Crores",
    sponsor: "In Progress",
    status: "In Progress",
    progress_pct: 45,
    milestones: "Classroom structural audit done; lab equipment procurement initiated",
    beneficiaries: "2,500 students & 400 youth trainees",
    priority: "High Priority",
    components: "Interactive smart digital panels across 25 ZP schools, STEM robotics kits, high-speed computer labs, EV technician diagnostics workstations",
    outcomes: "Measurable jump in secondary board STEM results, 100% digital literacy, certified EV technician employability",
    dpr_code: "DPR-EDU-02"
  },
  {
    id: 3,
    title: "Working Women Hostels & Senior Citizen Daycare Homes",
    mandal: "Dharmavaram",
    sector: "Gender Equality & Women Care",
    budget: "₹1.20 Crores",
    sponsor: "Open for Adoption",
    status: "Proposed",
    progress_pct: 0,
    milestones: "Site identification finalized by Municipal Administration and Revenue Division",
    beneficiaries: "450 women weavers & 120 senior citizens",
    priority: "High Priority",
    components: "Safe residential hostel accommodation, hygienic dining halls, solar hot water geysers, medical emergency room, daycare recreational wing",
    outcomes: "Safe working environment for silk artisan women, dignified elderly care, reduced socioeconomic inequality",
    dpr_code: "DPR-WLF-03"
  },
  {
    id: 4,
    title: "Soil-Water Conservation & Solar Micro-Grid Network",
    mandal: "NP Kunta & Mudigubba",
    sector: "Environmental Sustainability",
    budget: "₹1.80 Crores",
    sponsor: "Open for Adoption",
    status: "Proposed",
    progress_pct: 0,
    milestones: "Catchment area hydrological survey and load analysis completed",
    beneficiaries: "8,000 farming households & 20 public facilities",
    priority: "Medium Priority",
    components: "Check-dam watershed catchment treatment, rooftop solar micro-grids with lithium-ion storage, automated soil monitors",
    outcomes: "1.8m groundwater table recharge, 120 metric tons CO2 offset annually, uninterrupted green power for rural institutions",
    dpr_code: "DPR-ENV-04"
  },
  {
    id: 5,
    title: "Lepakshi Heritage Restoration & E-Library Network",
    mandal: "Lepakshi",
    sector: "Heritage & Culture",
    budget: "₹85.00 Lakhs",
    sponsor: "Open for Adoption",
    status: "Proposed",
    progress_pct: 0,
    milestones: "Corridor architectural layout and catalog approved by Tourism Cell",
    beneficiaries: "35,000 annual visitors & 1,200 local students",
    priority: "Medium Priority",
    components: "Heritage corridor illumination, artisan craft facilitation kiosk, digital archive library, tourist eco-amenities",
    outcomes: "Preservation of historical Vijayanagara monuments, cultural education, livelihood boost for local craft clusters",
    dpr_code: "DPR-HRT-05"
  },
  {
    id: 6,
    title: "Armed Forces Veterans & Veer Nari Welfare Facilities",
    mandal: "Puttaparthi",
    sector: "Armed Forces & Veteran Welfare",
    budget: "₹50.00 Lakhs",
    sponsor: "Open for Adoption",
    status: "Proposed",
    progress_pct: 0,
    milestones: "Sainik Welfare Department beneficiary verification complete",
    beneficiaries: "850 ex-servicemen & widows",
    priority: "Medium Priority",
    components: "Nodal health and rehabilitation clinic, legal aid desk, counseling suites, skill retraining lab for dependents",
    outcomes: "Assured medical rehabilitation, dignified pension assistance, employment transition for military families",
    dpr_code: "DPR-VET-06"
  },
  {
    id: 7,
    title: "Rural Sports Training Complex & Paralympic Coaching",
    mandal: "Dharmavaram & Penukonda",
    sector: "Rural & Olympic Sports",
    budget: "₹75.00 Lakhs",
    sponsor: "Open for Adoption",
    status: "Proposed",
    progress_pct: 0,
    milestones: "Land allocation orders issued; boundary fencing underway",
    beneficiaries: "1,500 rural youth athletes",
    priority: "High Priority",
    components: "400m synthetic running track, multi-sport indoor hall, para-athlete coaching equipment, athletic nutrition clinic",
    outcomes: "Grassroots athletic talent development, district-level sports tournaments, inclusive para-sport participation",
    dpr_code: "DPR-SPT-07"
  },
  {
    id: 8,
    title: "SC & ST Welfare Hostels Sanitation & Living Infrastructure",
    mandal: "District-wide (42 Hostels)",
    sector: "Socio-Economic Welfare Funds",
    budget: "₹1.10 Crores",
    sponsor: "In Progress",
    status: "In Progress",
    progress_pct: 35,
    milestones: "Phase-1 civil works underway across 18 hostels in Kadiri & Dharmavaram",
    beneficiaries: "3,200 residential students",
    priority: "High Priority",
    components: "Commercial RO drinking water plants, solar hot water systems, modern student dormitories, hygienic tiled sanitation blocks",
    outcomes: "Dignified living conditions, 100% elimination of skin and water-borne infections, improved academic retention",
    dpr_code: "DPR-SCST-08"
  },
  {
    id: 9,
    title: "Rural AgTech Incubator & Sustainable Farming Research",
    mandal: "Puttaparthi & Gorantla",
    sector: "Incubators, R&D & SDGs",
    budget: "₹2.50 Crores",
    sponsor: "Open for Adoption",
    status: "Proposed",
    progress_pct: 0,
    milestones: "Institutional tie-up drafted with dryland agriculture research specialists",
    beneficiaries: "12,000 small and marginal dryland farmers",
    priority: "Medium Priority",
    components: "Soil IoT testing labs, climate-resilient seed trial beds, drone spraying demonstration, farmer producer center",
    outcomes: "22% reduction in farm input costs, adoption of drought-hardy millets, scientific farming advice dissemination",
    dpr_code: "DPR-RND-09"
  },
  {
    id: 10,
    title: "All-Weather Rural Connectivity, Solar Lighting & Water",
    mandal: "Hindupur & Somandepalli",
    sector: "Rural Development Projects",
    budget: "₹3.00 Crores",
    sponsor: "Open for Adoption",
    status: "Proposed",
    progress_pct: 0,
    milestones: "Mandal road alignment and solar lighting survey ready for administrative clearance",
    beneficiaries: "18,000 rural residents",
    priority: "High Priority",
    components: "Village approach roads, solar smart streetlights, underground drainage bio-filters, community waste disposal",
    outcomes: "Year-round transport connectivity, public safety, reduction in stagnant vector breeding sites",
    dpr_code: "DPR-RUR-10"
  },
  {
    id: 11,
    title: "Municipal Slum Habitations Drainage & Housing Upgrades",
    mandal: "Kadiri & Hindupur",
    sector: "Slum Area Development",
    budget: "₹1.40 Crores",
    sponsor: "Open for Adoption",
    status: "Proposed",
    progress_pct: 0,
    milestones: "Drainage slope leveling and slum boundary mapping completed",
    beneficiaries: "6,500 urban poor residents",
    priority: "High Priority",
    components: "Closed masonry storm drains, paved internal lanes, shared community water points, solid waste segregation units",
    outcomes: "Eradication of monsoon waterlogging, improved sanitation indices, dignified urban living",
    dpr_code: "DPR-SLM-11"
  },
  {
    id: 12,
    title: "Drought Mitigation Check-Dams & Multi-Purpose Shelters",
    mandal: "Bukkapatnam & Amadagur",
    sector: "Disaster Management",
    budget: "₹1.60 Crores",
    sponsor: "Open for Adoption",
    status: "Proposed",
    progress_pct: 0,
    milestones: "Stream hydrological modeling and contour survey validated",
    beneficiaries: "9,200 residents in drought-vulnerable blocks",
    priority: "High Priority",
    components: "8 cascading stone check-dams, cyclone & disaster response shelters, emergency solar power backup, medical stores",
    outcomes: "Sub-surface water conservation, safe emergency sheltering during flash floods, assured community resilience",
    dpr_code: "DPR-DIS-12"
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

      const company_name = sanitizeText(body.company_name || body.org_name, 200);
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
      if (body.company_website || body.partner_website || body.fax_field || body.fax_number_leave_blank) {
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

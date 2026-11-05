-- Migration 0004: Align CSR Project Bank with Official Concept Note (PDF)
-- Removes all private company names and populates verified departmental proposals.

ALTER TABLE projects ADD COLUMN beneficiaries TEXT;
ALTER TABLE projects ADD COLUMN priority TEXT DEFAULT 'High Priority';
ALTER TABLE projects ADD COLUMN components TEXT;
ALTER TABLE projects ADD COLUMN outcomes TEXT;
ALTER TABLE projects ADD COLUMN dpr_code TEXT;

DELETE FROM projects;

INSERT INTO projects (
    id, title, mandal, sector, budget, sponsor, status, progress_pct, milestones,
    beneficiaries, priority, components, outcomes, dpr_code
) VALUES
(
    1,
    'Digital Learning Infrastructure for Government High Schools',
    'District-wide',
    'Education & Digital Learning',
    '₹25.00 Lakhs',
    'Open for Corporate Adoption',
    'Proposed',
    0,
    'Site survey & school list finalised; ready for procurement',
    '1,000 students across 10 high schools',
    'High Priority',
    'Computer lab setup, interactive digital smartboards, teacher ICT orientation, 3-year warranty and maintenance',
    'Measurable improvement in STEM learning outcomes and 100% digital literacy for secondary grades',
    'DPR-EDU-2026-01'
),
(
    2,
    'Primary Health Centre (PHC) Diagnostic & Mobile Screening Equipment',
    'Puttaparthi & Penukonda',
    'Healthcare & Diagnostics',
    '₹45.00 Lakhs',
    'Open for Corporate Adoption',
    'Proposed',
    0,
    'Clinical equipment specifications locked by District Medical Officer',
    '12,000 rural residents & expectant mothers',
    'High Priority',
    'Fully equipped Mobile Health Screening Unit, digital X-ray, automated hematology analyzers, ultrasound diagnostic kit',
    'Early detection of non-communicable diseases, routine maternal screenings, reduced referral transit times',
    'DPR-HLT-2026-02'
),
(
    3,
    'SC & BC Welfare Hostels Modernization & Sanitation Overhaul',
    'District-wide (42 Hostels)',
    'Social Welfare & Hostels',
    '₹65.00 Lakhs',
    'District CSR Facilitation Stream',
    'In Progress',
    40,
    'Phase-1 civil works underway across 18 hostels in Kadiri & Dharmavaram',
    '3,200 residential students',
    'High Priority',
    'High-capacity RO drinking water plants, solar hot water geysers, hygienic modern dining halls, tiled sanitation blocks',
    'Safe residential living conditions, zero water-borne infections, dignified stay for marginalized students',
    'DPR-WLF-2026-03'
),
(
    4,
    'Model Anganwadi Child-Friendly Centers & Toddler Nutrition Upgrades',
    'Dharmavaram & Madakasira',
    'Anganwadi & Child Development',
    '₹30.00 Lakhs',
    'Open for Corporate Adoption',
    'Proposed',
    0,
    'Site inspection complete across 25 rural Anganwadi buildings',
    '850 infants, toddlers & nursing mothers',
    'High Priority',
    'Child-safe learning spaces, educational toys & play equipment, clean drinking water systems, fortified food prep counters',
    'Drastic reduction in severe acute malnutrition (SAM) and improved pre-school cognitive readiness',
    'DPR-ICDS-2026-04'
),
(
    5,
    'Rural Women Self-Help Group (SHG) Sericulture & Weaving Enterprises',
    'Dharmavaram & Lepakshi',
    'Livelihoods & Women''s Empowerment',
    '₹50.00 Lakhs',
    'Open for Corporate Adoption',
    'Proposed',
    0,
    'SHG federation mobilization and market-linkage study complete',
    '450 women artisans & silk weavers',
    'Medium Priority',
    'Modern motorized silk reeling machines, computerized jacquard design workstations, common processing center, market linkages',
    'Direct monthly income increase of ₹6,500+ per artisan household and revival of traditional Lepakshi craft motifs',
    'DPR-LIV-2026-05'
),
(
    6,
    'Youth Vocational Technical Skill Development & EV Training Hub',
    'Penukonda Industrial Corridor',
    'Skill Development & Employment',
    '₹80.00 Lakhs',
    'District CSR Facilitation Stream',
    'In Progress',
    55,
    'Facility lease secured; lab equipment procurement initiated',
    '600 rural youths per annum',
    'High Priority',
    'Electric Vehicle (EV) assembly & battery diagnostics lab, CNC mechatronics tools, industry certification curriculum',
    'Guaranteed 85%+ formal sector placements in Penukonda automobile manufacturing hub',
    'DPR-SKL-2026-06'
),
(
    7,
    'Rural Habitations Solar-Powered Safe Drinking Water RO Network',
    'Kadiri & NP Kunta',
    'Drinking Water & Sanitation',
    '₹40.00 Lakhs',
    'Open for Corporate Adoption',
    'Proposed',
    0,
    'Water quality fluorosis mapping verified by rural water supply engineers',
    '8,500 villagers across 8 fluorosis-affected habitations',
    'High Priority',
    '2,000 LPH RO water treatment plants powered by dedicated solar PV rooftop arrays and automated smart water-card dispensing',
    'Complete elimination of fluoride-induced ailments and assured potable water security',
    'DPR-WTR-2026-07'
),
(
    8,
    'Solar Micro-Grid & Energy Self-Sufficiency for Government High Schools',
    'NP Kunta & Puttaparthi',
    'Environmental Sustainability',
    '₹35.00 Lakhs',
    'Open for Corporate Adoption',
    'Proposed',
    0,
    'Roof structural audit completed across 15 identified secondary schools',
    '4,500 students & administrative facilities',
    'Medium Priority',
    '5 kW to 10 kW hybrid solar rooftop installations with lithium-ion battery banks, net-metering synchronization, energy monitors',
    'Zero power disruption for digital smart classes and offset of 65 metric tons of CO2 annually',
    'DPR-ENV-2026-08'
);

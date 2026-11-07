/**
 * i18n.js - Internationalization Engine (English / Telugu)
 * Sri Sathya Sai District CSR Portal
 */

(function () {
    "use strict";

    const translations = {
        en: {
            // Header & Navigation
            "portal_title": "Sri Sathya Sai CSR Connect",
            "nav_home": "Home",
            "nav_about": "About District",
            "nav_projects": "Priority Projects",
            "nav_sectors": "Focus Sectors",
            "nav_collaborators": "Collaborators",
            "nav_login": "Login",
            "nav_dashboard": "Dashboard",
            "nav_logout": "Logout",
            "govt_ap": "Govt of Andhra Pradesh",

            // Hero Section
            "hero_badge": "Official District CSR Cell",
            "hero_title": "Connecting CSR & Philanthropy with District Development",
            "hero_subtitle": "Facilitating single-window CSR approvals, transparent milestone tracking, and high-impact rural development across Sri Sathya Sai District.",
            "btn_explore_projects": "Explore Priority Projects",
            "btn_submit_eoi": "Partner With Us",

            // Stats
            "stat_projects": "Priority Projects",
            "stat_mandals": "District Mandals",
            "stat_sectors": "Key Focus Sectors",
            "stat_outlay": "Target Outlay",

            // Schedule VII Statutory CSR Focus Sectors
            "sector_title": "Schedule VII CSR Focus Sectors",
            "sector_subtitle": "Aligned with Section 135 Companies Act 2013 & Sustainable Development Goals",
            "sec_health_sanitation": "Healthcare, Sanitation & Water",
            "sec_education_skills": "Smart Education & Vocational Skills",
            "sec_gender_women": "Gender Equality & Women Welfare",
            "sec_environment": "Environmental Sustainability",
            "sec_heritage_culture": "Heritage, Art & Culture",
            "sec_veterans_welfare": "Armed Forces & Veteran Welfare",
            "sec_sports": "Rural & Olympic Sports",
            "sec_socio_welfare": "Socio-Economic Welfare Funds",
            "sec_incubators_sdg": "Incubators, R&D & SDGs",
            "sec_rural_dev": "Rural Development Projects",
            "sec_slum_dev": "Slum Area Development",
            "sec_disaster_mgmt": "Disaster Management & Relief",

            // Collector's Message
            "collector_name": "Sri A. Shyam Prasad, I.A.S",
            "collector_designation": "Collector & District Magistrate, AP",
            "collector_quote": "\"Partnerships are a transformative force capable of driving positive change across education, healthcare, environmental sustainability, skill development, and infrastructure. I extend an invitation to development leaders, trusts, and foundations to join hands with the Sri Sathya Sai District Administration in building model, resilient communities.\"",

            // Partners & Scroller
            "partner_title": "CSR & Development Partners",
            "partner_subtitle": "Featuring Major Industrial Contributors in Sri Sathya Sai District",
            "partner_stream_dmf": "District Mineral Foundation (DMF)",
            "partner_stream_csr": "District CSR Facilitation Stream",
            "partner_onboarding": "Onboarding Open",
            "partner_join_title": "Your Organisation",
            "partner_join_sub": "Join as Founding CSR Partner",

            // Form
            "form_title": "Submit CSR Partnership Proposal",
            "form_company": "Organisation / Foundation Name",
            "form_person": "Contact Person Name",
            "form_email": "Official Email",
            "form_phone": "Phone Number",
            "form_sector": "Priority Sector",
            "form_outlay": "Proposed Outlay (INR)",
            "form_location": "Project Details / Location Preference",
            "btn_submit": "Submit Proposal to Collectorate",

            // Auth & Dashboard
            "login_title": "District CSR Portal Login",
            "login_subtitle": "Select your authorization role to access the workspace",
            "role_collector": "District Collector",
            "role_nodal": "CSR Nodal Officer",
            "role_sponsor": "Development Partner",

            // Dashboard Headers
            "dash_collector_title": "District Collectorate Executive Dashboard",
            "dash_nodal_title": "CSR Nodal Officer Workspace & User Management",
            "dash_sponsor_title": "Partner CSR Impact Dashboard",

            // Footer & DPDP Compliance
            "privacy_policy": "Privacy Policy & DPDP Compliance",
            "dpdp_consent_title": "Digital Personal Data Protection Act, 2023 Notice",
            "dpdp_consent_label": "I hereby give free, specific, informed, and explicit consent to Sri Sathya Sai District Administration to collect and process my contact details for CSR proposal facilitation and verification under the Digital Personal Data Protection Act, 2023."
        },
        te: {
            // Header & Navigation
            "portal_title": "శ్రీ సత్యసాయి సి.ఎస్.ఆర్ కనెక్ట్",
            "nav_home": "ముఖ్యాంశాలు",
            "nav_about": "జిల్లా సమాచారం",
            "nav_projects": "ప్రాధాన్యతా ప్రాజెక్టులు",
            "nav_sectors": "దృష్టి రంగాలు",
            "nav_collaborators": "సహకార సంస్థలు",
            "nav_login": "పోర్టల్ లాగిన్",
            "nav_dashboard": "డ్యాష్‌బోర్డ్",
            "nav_logout": "లాగ్‌అవుట్",
            "govt_ap": "ఆంధ్రప్రదేశ్ ప్రభుత్వం",

            // Hero Section
            "hero_badge": "అధికారిక జిల్లా సి.ఎస్.ఆర్ విభాగం",
            "hero_title": "కార్పొరేట్ సామాజిక బాధ్యతను జిల్లా అభివృద్ధితో అనుసంధానించడం",
            "hero_subtitle": "శ్రీ సత్యసాయి జిల్లా వ్యాప్తంగా సి.ఎస్.ఆర్ అనుమతులు, పారదర్శక పురోగతి పరిశీలన మరియు గ్రామీణాభివృద్ధి ప్రాజెక్టుల నిర్వహణ.",
            "btn_explore_projects": "ప్రాజెక్టులను చూడండి",
            "btn_submit_eoi": "సి.ఎస్.ఆర్ ప్రతిపాదన సమర్పించండి",

            // Stats
            "stat_projects": "ప్రాధాన్యతా ప్రాజెక్టులు",
            "stat_mandals": "జిల్లా మండలాలు",
            "stat_sectors": "ముఖ్య రంగములు",
            "stat_outlay": "లక్ష్య నిధులు",

            // Schedule VII Statutory CSR Focus Sectors
            "sector_title": "షెడ్యూల్ VII సి.ఎస్.ఆర్ ప్రాధాన్యతా రంగాలు",
            "sector_subtitle": "కంపెనీల చట్టం 2013 సెక్షన్ 135 మరియు సుస్థిరాభివృద్ధి లక్ష్యాలకు అనుగుణంగా",
            "sec_health_sanitation": "వైద్యం, పారిశుధ్యం & సురక్షిత మంచి నీరు",
            "sec_education_skills": "స్మార్ట్ విద్య & వృత్తి నైపుణ్యాలు",
            "sec_gender_women": "లింగ సమానత్వం & మహిళా సంక్షేమం",
            "sec_environment": "పర్యావరణ పరిరక్షణ & హరిత శక్తి",
            "sec_heritage_culture": "జాతీయ వారసత్వం, కళలు & సంస్కృతి",
            "sec_veterans_welfare": "సైనిక దళాల రక్షణ & వీరనారుల సంక్షేమం",
            "sec_sports": "గ్రామీణ & ఒలింపిక్ క్రీడల ప్రోత్సాహం",
            "sec_socio_welfare": "ఎస్సీ/ఎస్టీ & బలహీన వర్గాల సంక్షేమ నిధులు",
            "sec_incubators_sdg": "ఇంక్యుబేటర్లు, పరిశోధన & SDGs",
            "sec_rural_dev": "గ్రామీణాభివృద్ధి ప్రాజెక్టులు",
            "sec_slum_dev": "స్లమ్ ప్రాంతాల అభివృద్ధి",
            "sec_disaster_mgmt": "విపత్తు నిర్వహణ & పునరావాసం",

            // Collector's Message
            "collector_name": "శ్రీ ఎ. శ్యామ్ ప్రసాద్, ఐ.ఎ.ఎస్",
            "collector_designation": "జిల్లా కలెక్టర్ & జిల్లా మేజిస్ట్రేట్, శ్రీ సత్యసాయి జిల్లా",
            "collector_quote": "\"మన జిల్లా సమగ్రాభివృద్ధికి కార్పొరేట్ సామాజిక బాధ్యత (CSR) అత్యంత కీలకమైనది. విద్య, వైద్యం, పర్యావరణ పరిరక్షణ, నైపుణ్యాభివృద్ధి మరియు మౌలిక వసతుల కల్పనలో కార్పొరేట్ సంస్థల భాగస్వామ్యం గొప్ప మార్పును తేగలదు. ఆదర్శవంతమైన సముదాయాల నిర్మాణంలో జిల్లా యాజమాన్యంతో చేతులు కలపాలని కార్పొరేట్ నాయకులకు ఆహ్వానం పలుకుతున్నాను.\"",

            // Partners & Scroller
            "partner_title": "కార్పొరేట్ భాగస్వామ్య సంస్థలు",
            "partner_subtitle": "శ్రీ సత్యసాయి జిల్లాలోని ప్రధాన పారిశ్రామిక భాగస్వాములు",
            "partner_stream_dmf": "డిస్ట్రిక్ట్ మినరల్ ఫౌండేషన్ (DMF)",
            "partner_stream_csr": "జిల్లా సి.ఎస్.ఆర్ ఫెసిలిటేషన్ విభాగం",
            "partner_onboarding": "భాగస్వామ్య అవకాశం ఉంది",
            "partner_join_title": "మీ సంస్థ",
            "partner_join_sub": "సి.ఎస్.ఆర్ భాగస్వామిగా చేరండి",

            // Form
            "form_title": "సి.ఎస్.ఆర్ ప్రతిపాదన సమర్పణ పత్రం",
            "form_company": "సంస్థ / ఫౌండేషన్ పేరు",
            "form_person": "సంప్రదించాల్సిన వ్యక్తి పేరు",
            "form_email": "అధికారిక ఈమెయిల్",
            "form_phone": "ఫోన్ నంబరు",
            "form_sector": "ప్రాధాన్యతా రంగం",
            "form_outlay": "ప్రతిపాదిత నిధులు (రూపాయలలో)",
            "form_location": "ప్రాజెక్టు వివరాలు / ప్రాంత ప్రాధాన్యత",
            "btn_submit": "కలెక్టరేట్‌కు ప్రతిపాదన సమర్పించండి",

            // Auth & Dashboard
            "login_title": "జిల్లా సి.ఎస్.ఆర్ పోర్టల్ లాగిన్",
            "login_subtitle": "మీ హోదాకు తగిన లాగిన్‌ను ఎంచుకోండి",
            "role_collector": "జిల్లా కలెక్టర్ గారు",
            "role_nodal": "సి.ఎస్.ఆర్ నోడల్ అధికారి",
            "role_sponsor": "అభివృద్ధి భాగస్వామి",

            // Dashboard Headers
            "dash_collector_title": "జిల్లా కలెక్టరేట్ ఎగ్జిక్యూటివ్ డ్యాష్‌బోర్డ్",
            "dash_nodal_title": "నోడల్ ఆఫీసర్ నిర్వహణ వర్క్‌స్పేస్",
            "dash_sponsor_title": "భాగస్వామి సి.ఎస్.ఆర్ డ్యాష్‌బోర్డ్",

            // Footer & DPDP Compliance
            "privacy_policy": "డిజిటల్ వ్యక్తిగత డేటా రక్షణ విధానం (DPDP)",
            "dpdp_consent_title": "డిజిటల్ వ్యక్తిగత డేటా రక్షణ చట్టం 2023 నోటీసు",
            "dpdp_consent_label": "డిజిటల్ వ్యక్తిగత డేటా రక్షణ చట్టం 2023 కింద నా సంప్రదింపు వివరాలను సేకరించి ప్రాసెస్ చేయడానికి నేను శ్రీ సత్యసాయి జిల్లా పరిపాలనకు స్పష్టమైన సమ్మతిని ఇస్తున్నాను."
        }
    };

    let currentLang = localStorage.getItem("csr_lang") || "en";

    function setLanguage(lang) {
        if (!translations[lang]) return;
        currentLang = lang;
        localStorage.setItem("csr_lang", lang);

        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (translations[lang][key]) {
                if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
                    el.placeholder = translations[lang][key];
                } else {
                    el.innerText = translations[lang][key];
                }
            }
        });

        // Update active class on switcher buttons if present
        const btnEn = document.getElementById("lang-btn-en");
        const btnTe = document.getElementById("lang-btn-te");
        if (btnEn && btnTe) {
            if (lang === "te") {
                btnTe.classList.add("active", "btn-primary");
                btnTe.classList.remove("btn-outline-primary");
                btnEn.classList.remove("active", "btn-primary");
                btnEn.classList.add("btn-outline-primary");
            } else {
                btnEn.classList.add("active", "btn-primary");
                btnEn.classList.remove("btn-outline-primary");
                btnTe.classList.remove("active", "btn-primary");
                btnTe.classList.add("btn-outline-primary");
            }
        }
    }

    window.i18nEngine = {
        setLanguage: setLanguage,
        getCurrentLang: () => currentLang,
        t: (key) => translations[currentLang][key] || key
    };

    document.addEventListener("DOMContentLoaded", function () {
        setLanguage(currentLang);
    });
})();

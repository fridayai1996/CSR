/**
 * district-map.js - Leaflet Interactive Map Component
 * Sri Sathya Sai District CSR Portal
 */

(function () {
    "use strict";

    // Sri Sathya Sai District Mandals & Sample Priority CSR Projects Data
    const projectLocations = [
        {
            id: "proj-1",
            title: "Penukonda Skill Development & EV Training Center",
            mandal: "Penukonda",
            lat: 14.0827,
            lng: 77.5898,
            sector: "Education",
            budget: "₹1.20 Crores",
            sponsor: "Open for Corporate Adoption",
            status: "In Progress",
            description: "Advanced EV automotive skills lab and youth training facility adjacent to Penukonda Industrial Hub."
        },
        {
            id: "proj-2",
            title: "Puttaparthi Super-Specialty Tele-Medicine Clinic",
            mandal: "Puttaparthi",
            lat: 14.1666,
            lng: 77.8114,
            sector: "Health",
            budget: "₹85 Lakhs",
            sponsor: "Available for Sponsorship",
            status: "Proposed",
            description: "Solar-powered tele-consultation kiosks connecting rural mandal health centers to Puttaparthi specialists."
        },
        {
            id: "proj-3",
            title: "Hindupur Industrial Park Underground Drainage & Sewage",
            mandal: "Hindupur",
            lat: 13.8299,
            lng: 77.4932,
            sector: "Drains",
            budget: "₹2.50 Crores",
            sponsor: "Available for Sponsorship",
            status: "Proposed",
            description: "High-capacity closed storm drainage and bio-filter water treatment plant for Hindupur sub-division."
        },
        {
            id: "proj-4",
            title: "Dharmavaram Weaver Colony Smart Digital Schools",
            mandal: "Dharmavaram",
            lat: 14.4137,
            lng: 77.7180,
            sector: "Education",
            budget: "₹45 Lakhs",
            sponsor: "District CSR Facilitation Stream",
            status: "Under Review",
            description: "Digital classrooms, computer labs, and solar roof systems across 8 government schools in Dharmavaram."
        },
        {
            id: "proj-5",
            title: "Kadiri Rural Drinking Water & RO Purification Units",
            mandal: "Kadiri",
            lat: 14.1147,
            lng: 78.1585,
            sector: "Drains",
            budget: "₹60 Lakhs",
            sponsor: "Available for Sponsorship",
            status: "Proposed",
            description: "High-yield community RO water plants serving 15 fluoride-affected habitations in Kadiri division."
        },
        {
            id: "proj-6",
            title: "Lepakshi Heritage Corridor Green Plantation & Solar Streetlights",
            mandal: "Lepakshi",
            lat: 13.8041,
            lng: 77.6083,
            sector: "Solar",
            budget: "₹35 Lakhs",
            sponsor: "Available for Sponsorship",
            status: "Proposed",
            description: "Smart solar street illumination and avenue tree plantation along the historical Lepakshi tourist corridor."
        },
        {
            id: "proj-7",
            title: "Madakasira Border Health Center & Ambulance Support",
            mandal: "Madakasira",
            lat: 13.9372,
            lng: 77.2694,
            sector: "Health",
            budget: "₹50 Lakhs",
            sponsor: "Available for Sponsorship",
            status: "Proposed",
            description: "Mobile medical unit equipped with diagnostic kits servicing remote border mandals."
        },
        {
            id: "proj-8",
            title: "N.P. Kunta Ultra-Mega Solar Rooftop Micro-Grid",
            mandal: "N.P. Kunta",
            lat: 14.1833,
            lng: 78.2667,
            sector: "Solar",
            budget: "₹1.80 Crores",
            sponsor: "Available for Sponsorship",
            status: "Proposed",
            description: "Rooftop solar installations for government hospitals and gram panchayat buildings."
        }
    ];

    window.initDistrictMap = function (containerId) {
        const mapContainer = document.getElementById(containerId);
        if (!mapContainer || typeof L === "undefined") return;

        // Center on Sri Sathya Sai District (approx 14.15° N, 77.75° E)
        const map = L.map(containerId, {
            center: [14.15, 77.75],
            zoom: 9.5,
            scrollWheelZoom: false
        });

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© OpenStreetMap contributors | Sri Sathya Sai District CSR Cell'
        }).addTo(map);

        // Custom Icon Colors by Sector
        const getSectorBadgeClass = (sector) => {
            switch (sector) {
                case "Education": return "bg-primary";
                case "Health": return "bg-danger";
                case "Solar": return "bg-warning text-dark";
                case "Drains": return "bg-info text-white";
                default: return "bg-secondary";
            }
        };

        // Render project markers
        projectLocations.forEach(proj => {
            const marker = L.marker([proj.lat, proj.lng]).addTo(map);
            
            const popupContent = `
                <div class="p-2" style="max-width: 260px;">
                    <span class="badge ${getSectorBadgeClass(proj.sector)} mb-1">${proj.sector}</span>
                    <h6 class="fw-bold mb-1 text-dark">${proj.title}</h6>
                    <p class="small text-muted mb-2">${proj.description}</p>
                    <div class="d-flex justify-content-between align-items-center border-top pt-2 mt-2">
                        <small class="fw-bold text-success">${proj.budget}</small>
                        <small class="badge bg-light text-dark border">${proj.status}</small>
                    </div>
                </div>
            `;
            marker.bindPopup(popupContent);
        });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            window.initDistrictMap("district-leaflet-map");
        });
    } else {
        window.initDistrictMap("district-leaflet-map");
    }
})();

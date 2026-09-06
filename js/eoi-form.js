(function () {
    "use strict";

    function setStatus(statusEl, message, type) {
        if (!statusEl) return;
        statusEl.textContent = message;
        statusEl.className = "small mt-3 mb-0 eoi-form-status eoi-form-status--" + type;
    }

    function readField(id) {
        const el = document.getElementById(id);
        return el ? String(el.value || "").trim() : "";
    }

    async function handlePublicEoISubmit(event) {
        if (event && typeof event.preventDefault === "function") {
            event.preventDefault();
        }

        const form = document.getElementById("public-eoi-form");
        const statusEl = document.getElementById("eoi-form-status");
        const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
        const honeypot = document.getElementById("eoi-website");
        const consent = document.getElementById("dpdp-consent-check");

        if (honeypot && honeypot.value) {
            setStatus(statusEl, "Proposal received.", "success");
            return false;
        }

        if (!consent || !consent.checked) {
            setStatus(statusEl, "Please provide affirmative consent under the DPDP Act, 2023 (check the Privacy Policy box) before submitting.", "error");
            if (consent) consent.focus();
            return false;
        }

        if (!window.csrApi || typeof window.csrApi.submitProposal !== "function") {
            setStatus(statusEl, "Form scripts failed to load. Please refresh the page and try again.", "error");
            return false;
        }

        const company_name = readField("eoi-company");
        const contact_person = readField("eoi-person");
        const email = readField("eoi-email");
        const phone = readField("eoi-phone");
        const sector = readField("eoi-sector");
        const outlay_amount = readField("eoi-outlay");
        const details = readField("eoi-details");

        if (company_name.length < 2 || contact_person.length < 2 || !email || !phone || !sector || !outlay_amount) {
            setStatus(statusEl, "Please complete all required proposal fields.", "error");
            return false;
        }

        if (!/^[0-9+\s-]{8,20}$/.test(phone) || phone.replace(/\D/g, "").length < 10) {
            setStatus(statusEl, "Enter a valid phone number with at least 10 digits.", "error");
            return false;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.setAttribute("aria-busy", "true");
        }
        setStatus(statusEl, "Sending your proposal to the District CSR Cell…", "info");

        try {
            const result = await window.csrApi.submitProposal({
                company_name: company_name,
                contact_person: contact_person,
                email: email,
                phone: phone,
                sector: sector,
                outlay_amount: outlay_amount,
                location: "Sri Sathya Sai District",
                details: details,
                consent_given: true
            });
            form.reset();
            if (consent) consent.checked = false;
            if (honeypot) honeypot.value = "";
            const ref = result && result.id ? " Reference ID: #" + result.id + "." : "";
            setStatus(
                statusEl,
                "Thank you. Your Expression of Interest has been recorded with the District CSR Facilitation Cell." + ref,
                "success"
            );
        } catch (err) {
            const msg = err && err.message ? err.message : "Request failed.";
            setStatus(
                statusEl,
                "The proposal could not be sent (" + msg + "). Please try again or email collector-sssai@ap.gov.in.",
                "error"
            );
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.removeAttribute("aria-busy");
            }
        }
        return false;
    }

    window.handlePublicEoISubmit = handlePublicEoISubmit;

    function prefillSector(sectorValue) {
        const select = document.getElementById("eoi-sector");
        if (!select) return;
        // Try exact match first
        let matched = false;
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].text.includes(sectorValue) || select.options[i].value.includes(sectorValue)) {
                select.selectedIndex = i;
                matched = true;
                break;
            }
        }
        if (!matched && select.options.length > 1) {
            // fallback to first sensible
            select.selectedIndex = 1;
        }
        // scroll to form
        const formEl = document.getElementById("partner-form");
        if (formEl) {
            formEl.scrollIntoView({ behavior: "smooth", block: "start" });
            setTimeout(() => select.focus(), 650);
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("public-eoi-form");
        if (!form) return;
        form.removeAttribute("onsubmit");
        form.addEventListener("submit", handlePublicEoISubmit);

        const honeypot = document.getElementById("eoi-website");
        if (honeypot) {
            honeypot.value = "";
            honeypot.setAttribute("autocomplete", "off");
            honeypot.setAttribute("tabindex", "-1");
        }

        // Wire project "Propose to Sponsor" buttons for prefill
        document.querySelectorAll(".propose-btn").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                const sector = btn.getAttribute("data-sector") || "";
                if (sector) {
                    // allow default hash scroll but prefill after
                    setTimeout(function () {
                        prefillSector(sector);
                    }, 120);
                }
            });
        });
    });
})();

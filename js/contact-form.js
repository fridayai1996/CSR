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

    async function handleContactSubmit(event) {
        if (event && typeof event.preventDefault === "function") {
            event.preventDefault();
        }

        const form = document.getElementById("public-contact-form");
        const statusEl = document.getElementById("contact-form-status");
        const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
        const honeypot = document.getElementById("contact-website-hp");
        const consent = document.getElementById("contact-dpdp-check");

        if (honeypot && honeypot.value) {
            setStatus(statusEl, "Inquiry received.", "success");
            return false;
        }

        if (!consent || !consent.checked) {
            setStatus(statusEl, "Please agree to the DPDP Act consent before sending your inquiry.", "error");
            if (consent) consent.focus();
            return false;
        }

        const name = readField("contact-name");
        const email = readField("contact-email");
        const phone = readField("contact-phone");
        const subject = readField("contact-subject");
        const message = readField("contact-message");

        if (name.length < 2 || !email || message.length < 10) {
            setStatus(statusEl, "Please fill in your name, valid email, and a message of at least 10 characters.", "error");
            return false;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.setAttribute("aria-busy", "true");
        }
        setStatus(statusEl, "Submitting your message to the District CSR Cell…", "info");

        try {
            let result;
            if (window.csrApi && typeof window.csrApi.submitContact === "function") {
                result = await window.csrApi.submitContact({
                    name: name,
                    email: email,
                    phone: phone,
                    subject: subject,
                    message: message,
                    consent_given: true
                });
            } else {
                // Direct fetch fallback
                const res = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        phone: phone,
                        subject: subject,
                        message: message,
                        consent_given: true
                    })
                });
                result = await res.json();
            }

            form.reset();
            if (consent) consent.checked = false;
            if (honeypot) honeypot.value = "";
            const ref = result && result.id ? " (Reference Ticket: #" + result.id + ")" : "";
            setStatus(
                statusEl,
                "Thank you, " + name + "! Your inquiry has been delivered to the Sri Sathya Sai District CSR Helpdesk" + ref + ". Our officers will respond shortly.",
                "success"
            );
        } catch (err) {
            const msg = err && err.message ? err.message : "Submission failed.";
            setStatus(statusEl, "Could not submit inquiry: " + msg + ". You can also email collector-sssai@ap.gov.in directly.", "error");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.removeAttribute("aria-busy");
            }
        }
        return false;
    }

    document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("public-contact-form");
        if (!form) return;
        form.addEventListener("submit", handleContactSubmit);
    });
})();

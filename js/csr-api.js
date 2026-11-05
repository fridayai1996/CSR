(function () {
    "use strict";

    function apiUrl(path) {
        if (/^https?:\/\//i.test(path)) return path;
        const origin = window.location && window.location.origin ? window.location.origin : "";
        if (!origin || origin === "null" || origin.indexOf("file:") === 0) {
            // For local file testing, attempt relative path
            return path;
        }
        return origin.replace(/\/$/, "") + (path.charAt(0) === "/" ? path : "/" + path);
    }

    async function api(path, options) {
        const opts = options || {};
        let res;
        try {
            res = await fetch(apiUrl(path), {
                method: opts.method || "GET",
                credentials: "same-origin",
                headers: opts.body ? { "content-type": "application/json" } : undefined,
                body: opts.body ? JSON.stringify(opts.body) : undefined
            });
        } catch (networkErr) {
            throw new Error("Network error — could not reach the CSR portal API.");
        }
        let payload = null;
        try {
            payload = await res.json();
        } catch (_err) {
            payload = null;
        }
        if (!res.ok) {
            throw new Error((payload && payload.error) || ("Request failed (" + res.status + ")."));
        }
        return payload;
    }

    async function submitProposal(payload) {
        return api("/api/proposals", { method: "POST", body: payload });
    }

    async function submitContact(payload) {
        return api("/api/contact", { method: "POST", body: payload });
    }

    async function listProjects() {
        const payload = await api("/api/projects");
        return payload.data || [];
    }

    window.csrApi = {
        submitProposal: submitProposal,
        submitContact: submitContact,
        listProjects: listProjects
    };
})();

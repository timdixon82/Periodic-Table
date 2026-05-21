# Security Governance Review: Periodic-Table

Reviewed by: Gerrie (security governance analyst)
Review date: 2026-05-21
Scope: `index.html` (466 lines), GitHub Pages hosting, branch `chore/project-setup`
Companion review: Jed is conducting a separate hands-on code review and penetration test.

---

## Overview

The Periodic-Table project is a static, serverless, single-file web application. It holds no database, no server-side runtime, and no user accounts. This architecture eliminates or greatly reduces most of the OWASP Top 10 risks. The sections below address each item in turn, then cover UK General Data Protection Regulation (UK GDPR) compliance and the GitHub Pages security posture.

---

## OWASP Top 10 Assessment

The Open Worldwide Application Security Project (OWASP) publishes the Top 10 most critical web application security risks. The current list is the OWASP Top 10 2021 edition.

### A01: Broken Access Control

Not applicable. There are no user roles, authentication states, or restricted resources. Every visitor sees the same public content. The periodic table data is entirely hardcoded in the JavaScript array; nothing is gated.

### A02: Cryptographic Failures

Partially applicable. The project has no server-side data store and no secrets to protect. The single relevant concern is transport security: all data in transit between the visitor's browser and GitHub Pages must be encrypted. HTTPS enforcement has been enabled on the GitHub Pages site. This satisfies the transport-layer requirement.

There are no passwords, tokens, or sensitive values anywhere in the codebase.

### A03: Injection

Low risk, with one point to confirm. The project accepts a search query from the user via the text input at line 84. That query is used only in JavaScript string comparisons (`.includes()`, `.startsWith()`, `.toString()`). It is never passed to a dynamic code execution function, a database, or a server.

The `renderInfo()` function at line 386 sets `infoPanel.innerHTML` using values from the hardcoded `ELEMENTS` array. Because none of those values come from user input, there is no cross-site scripting (XSS) vector through that path. The live-region update at line 408 uses `srLive.textContent`, which is text-only and cannot render HTML.

One point for Jed to verify in the hands-on review: confirm that no future code path allows user-supplied text to reach `innerHTML` without sanitisation.

### A04: Insecure Design

Low risk. The application's design is intentionally minimal: read-only data, no accounts, no payments, no privileged actions. There is no threat model gap at the design level for the current feature set.

### A05: Security Misconfiguration

Partially applicable. The GitHub Pages hosting environment does not allow custom HTTP response headers. As a result, the following security response headers cannot be set:

- Content-Security-Policy (CSP): controls which origins may load scripts, styles, fonts, and other resources.
- X-Frame-Options: prevents the page being embedded in a frame on another origin.
- X-Content-Type-Options: prevents MIME-type sniffing.
- Referrer-Policy: limits how much referrer information is sent to third-party origins.
- Permissions-Policy: restricts access to browser features such as camera and microphone.

The GitHub Pages constraint and its recommended mitigations are set out in the GitHub Pages Security Posture section below.

HTTPS enforcement is now active, which removes the insecure-default risk of serving over plain HTTP.

### A06: Vulnerable and Outdated Components

Low risk currently. The project has no npm dependencies and no bundled third-party JavaScript libraries. The only external resource is the Google Fonts stylesheet, loaded at runtime by the browser. Google manages and patches that infrastructure.

If third-party JavaScript libraries are introduced in future, they must be tracked and kept up to date.

### A07: Identification and Authentication Failures

Not applicable. There are no user accounts, sessions, or authentication mechanisms of any kind.

### A08: Software and Data Integrity Failures

Partially applicable. The project loads fonts from `fonts.googleapis.com`. That request is not protected by Subresource Integrity (SRI), meaning that if Google's infrastructure were compromised, a malicious stylesheet could be served. SRI is a browser mechanism that checks a cryptographic hash of a fetched resource before applying it.

However, the resource is a CSS stylesheet, not JavaScript. A rogue stylesheet could alter the visual appearance of the page but cannot execute arbitrary code in the visitor's browser on its own. The risk is therefore low.

Action: if any externally hosted JavaScript is added in future, it must be accompanied by an SRI hash attribute.

### A09: Security Logging and Monitoring Failures

Not applicable at the application level. There is no server-side runtime and no application-level logging. GitHub provides audit logs for repository actions at the platform level, which covers the project's operational surface.

### A10: Server-Side Request Forgery (SSRF)

Not applicable. There is no server. The application runs entirely in the visitor's browser and makes no server-side outbound requests.

---

## UK GDPR Assessment

UK GDPR stands for the United Kingdom General Data Protection Regulation. It governs the processing of personal data relating to individuals in the United Kingdom.

### Inspection scope

The following were inspected in `index.html`:

- Forms and inputs
- Cookies
- Web Storage (localStorage and sessionStorage)
- Fetch, XHR (XMLHttpRequest), and WebSocket calls
- Third-party script or stylesheet inclusions
- Any other mechanism that could transmit or store personal data

### Findings

No forms collect user data. No cookies are set. No localStorage or sessionStorage calls exist anywhere in the file. No fetch(), XMLHttpRequest, or WebSocket calls are made. No analytics, tracking pixels, or advertising tags are present.

The one external network request is the Google Fonts stylesheet linked at line 8 of `index.html`:

```
https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700
  &family=Share+Tech+Mono&family=Nunito+Sans:wght@300;400;600&display=swap
```

When a visitor's browser loads this stylesheet, it sends a request to Google's servers. That request includes the visitor's IP address and HTTP headers (including the Referer header, which tells Google the URL of the page). IP addresses are personal data under UK GDPR.

### Conclusion

The application itself does not process personal data. It collects no information, stores nothing, and sends nothing to any server it controls.

However, the Google Fonts request causes the visitor's browser to disclose the visitor's IP address to Google (Alphabet Inc., a US-based company). This constitutes a transfer of personal data to a third-party data processor located outside the United Kingdom.

The legal basis that would most naturally apply is Legitimate Interests under Article 6(1)(f) of UK GDPR. The legitimate interest would be the rendering of custom fonts to improve the user experience. A Legitimate Interests Assessment (LIA) should be conducted and documented to confirm that this interest is not overridden by the visitor's privacy rights.

An alternative that eliminates the third-party transfer entirely is to self-host the Google Fonts files by downloading them and serving them from the same GitHub Pages origin. This would mean no visitor data leaves the site's own origin at all.

A privacy notice or tracking notice is not currently needed, because no personal data is being processed by the site itself, and the Fonts transfer is limited to IP address disclosure during the resource load. If analytics, cookies, or any form of visitor tracking are added in future, a full privacy notice and consent mechanism will be required before those additions go live.

---

## GitHub Pages Security Posture

### What is in place

HTTPS enforcement is now active on the GitHub Pages site. All traffic is served over TLS (Transport Layer Security), and plain HTTP requests are redirected to HTTPS automatically. This protects data in transit and prevents downgrade attacks.

There is no server-side runtime, which means there are no server-side secrets, no database credentials, no session stores, and no server processes that can be exploited remotely.

### Constraint: no custom HTTP response headers

GitHub Pages is a static hosting service. It does not allow site owners to set custom HTTP response headers. This means the following headers cannot be deployed through the standard GitHub Pages pipeline:

- Content-Security-Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

### Recommended mitigations

The following mitigations partially compensate for the missing headers.

**Meta-tag Content-Security-Policy.** A `<meta http-equiv="Content-Security-Policy" ...>` element placed in the `<head>` of `index.html` can restrict which origins may load scripts, styles, and fonts. A meta-tag CSP does not cover all directives (for example, `frame-ancestors` requires a response header), but it meaningfully reduces the risk of injected content. A suggested starting policy is given below as a starting point for discussion; the exact values should be confirmed during Jed's code review.

Suggested policy (for discussion, not yet implemented):

```
default-src 'none';
style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
font-src 'self' https://fonts.gstatic.com;
script-src 'unsafe-inline';
img-src 'self';
base-uri 'self';
form-action 'none';
```

Note: the inline `<style>` block and inline `<script>` block in `index.html` currently require `'unsafe-inline'` for both styles and scripts in any CSP. Moving CSS and JavaScript to separate files would allow a stricter policy that avoids `'unsafe-inline'`. This is a desirable improvement for a future iteration; see Open Question Q2.

**Framing.** Without an `X-Frame-Options` header or a CSP `frame-ancestors` directive (which requires a header, not just a meta tag), the page can be embedded in a frame on any other origin. For a read-only informational page with no user accounts, the practical risk of clickjacking is low. It remains a best-practice gap that cannot be fully closed on GitHub Pages without a proxy.

**Self-hosting fonts.** Downloading the three Google Fonts families and serving them from the same GitHub Pages origin would allow the CSP `font-src` directive to be tightened to `'self'` only, removing the external font origin. It would also eliminate the UK GDPR concern about IP-address disclosure to Google.

**Cloudflare proxy (optional).** If the project is ever served through a Cloudflare-proxied custom domain rather than the default `github.io` subdomain, Cloudflare's Transform Rules allow custom response headers to be injected. This would restore full header control, including `frame-ancestors` and `X-Content-Type-Options`. This is noted for future consideration only; no action is required now.

---

## Findings Requiring Action

The following items need a decision or implementation step before this review can be closed.

1. Google Fonts and UK GDPR transfer. A decision is needed on whether to self-host fonts or proceed with a Legitimate Interests Assessment. See Open Question Q1.

2. Meta-tag Content-Security-Policy. A CSP meta element should be added to `index.html` to restrict resource origins. The exact policy values should be agreed with Jed during the code review, because the inline script and style blocks affect what is permitted. See Open Question Q2.

3. SRI for future external resources. A team coding standard should be recorded: any future externally hosted JavaScript file must carry an SRI `integrity` attribute. This is a preventive standard for new work, not a current gap.

---

## Exceptions

No security exceptions are recorded for this project at the time of this review. The missing response headers are a platform constraint of GitHub Pages, not a deliberate exception. They are partially mitigated by the meta-tag CSP recommendation above.

If a formal exception is needed after Tim's decisions on the open questions, it will be filed in `docs/exceptions/` with the reason, mitigation, and Tim's approval date recorded.

---

## Open Questions for Tim (via Sonja)

**Q1. Google Fonts hosting preference.** Would Tim prefer to self-host the three font families (Rajdhani, Share Tech Mono, and Nunito Sans) to eliminate the IP-address disclosure to Google entirely, or is the current external Google Fonts approach acceptable with a Legitimate Interests Assessment written to document the basis?

**Q2. Content-Security-Policy direction.** The inline style and script blocks in `index.html` currently require `'unsafe-inline'` in any CSP meta element. Should Sean refactor these to separate external files (enabling a stricter CSP), or is a meta-tag CSP with `'unsafe-inline'` acceptable as a near-term measure while a stricter policy is pursued later?

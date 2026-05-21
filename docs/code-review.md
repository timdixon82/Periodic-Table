# Code Review and Penetration-Test Findings: Periodic-Table

Reviewer: Jed (penetration testing and code review agent)
Date: 2026-05-21
Scope: `index.html`, all 466 lines, against the OWASP (Open Worldwide Application Security Project) Top 10 and sound front-end practice.
Branch reviewed: `chore/project-setup`

---

## Overview

The project is a self-contained static page. All data is hard-coded in a JavaScript array. There are no server calls, no URL parameters, no cookies, no local storage, and no user-supplied data that reaches a network. That small attack surface limits what an attacker can do. Nevertheless, several concrete issues require attention before the code is considered production-ready.

---

## Finding 1: innerHTML used with hard-coded but unsanitised data

**Severity:** Medium

**OWASP category:** A03:2021 Injection (Cross-Site Scripting, or XSS)

**Location:** Lines 286 and 386 to 407

**How to reproduce:** Open the file in a browser and select any element. The `renderInfo` function at line 386 sets `infoPanel.innerHTML` to a template literal that interpolates element properties directly. No encoding or escaping is applied.

**Risk:** The `buildGrid` function at line 286 assigns to `btn.innerHTML` using template literals that interpolate `el.n`, `el.sym`, and `el.name`. The `renderInfo` function at lines 386 to 407 does the same for `el.n`, `el.sym`, `el.name`, `el.mass`, `el.state`, `el.cat`, `el.col`, `el.row`, and `el.desc`. These values come from the `ELEMENTS` array in the same file, so today they are under the developer's control and contain no malicious content.

The risk is latent, not immediate. If in a future sprint a developer fetches element data from an external API or from URL parameters and adds those values directly to the `ELEMENTS` array without sanitising them, every `innerHTML` assignment becomes an XSS sink. The pattern encourages unsafe habits in maintainers who follow it.

**Recommended fix:** Replace `innerHTML` assignments with DOM construction using `document.createElement`, `textContent`, and `setAttribute`. This approach is impossible to exploit even when data sources change. Where template literals are genuinely convenient, wrap each interpolated value through a helper that assigns to `element.textContent` rather than building an HTML string.

---

## Finding 2: Google Fonts loaded without Subresource Integrity

**Severity:** Medium

**OWASP category:** A08:2021 Software and Data Integrity Failures

**Location:** Lines 7 and 8

Line 7: `<link rel="preconnect" href="https://fonts.googleapis.com">`
Line 8: `<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&family=Nunito+Sans:wght@300;400;600&display=swap" rel="stylesheet">`

**How to reproduce:** View the page network requests. The CSS stylesheet is fetched from `fonts.googleapis.com` with no `integrity` attribute and no fallback.

**Risk:** The stylesheet is fetched from Google's Content Delivery Network (CDN) at load time. If that CDN were compromised, or if a network attacker performed a man-in-the-middle attack against a user who lacks HTTPS (for example, a captive portal stripping TLS), a tampered stylesheet could be delivered. A malicious stylesheet cannot execute JavaScript on its own, but it can exfiltrate text content via CSS attribute-selector techniques, break layout in ways that deceive users, and violate user privacy expectations.

Note: Google Fonts dynamically generates its CSS responses, meaning the hash changes with each request. Subresource Integrity (SRI) cannot realistically be applied to the Google Fonts CSS loader URL. The recommended fix is to self-host the fonts or accept the dependency with documented justification.

**Recommended fix (preferred):** Download the three font families and self-host them alongside `index.html`. This removes the third-party dependency entirely. If self-hosting is not acceptable, document the decision in `docs/exceptions/` and add a Content Security Policy (CSP) header that restricts `font-src` to `fonts.gstatic.com` and `style-src` to `fonts.googleapis.com`. GitHub Pages supports custom headers via a `_headers` file or a GitHub Actions step.

---

## Finding 3: No Content Security Policy header

**Severity:** Medium

**OWASP category:** A05:2021 Security Misconfiguration

**Location:** Lines 1 to 8 (the entire `<head>` section)

**How to reproduce:** Open browser developer tools, go to the Network tab, select the main document, and check the Response Headers panel. No `Content-Security-Policy` header is present, and the page `<head>` contains no CSP `<meta>` tag.

**Risk:** There is no Content Security Policy. Without a CSP, browsers allow any inline script, any external script source, and any external style source. If an attacker found a way to inject content into the page (for example, by compromising the GitHub repository or the CDN), there is no browser-level barrier preventing that content from running arbitrary JavaScript.

**Recommended fix:** Add a CSP `<meta>` tag that matches what the page actually needs. Because the JavaScript is inline (no external script files) and styles are inline plus Google Fonts, a suitable starting point is shown below. The `unsafe-inline` directive is required because the CSS and JavaScript are embedded in the file.

```
<meta http-equiv="Content-Security-Policy"
      content="default-src 'none';
               style-src 'unsafe-inline' https://fonts.googleapis.com;
               font-src https://fonts.gstatic.com;
               script-src 'unsafe-inline';
               img-src 'none';
               connect-src 'none';">
```

If the CSS and JavaScript are moved to external files in a later refactor, they can be locked down further with hashes or nonce values, removing the need for `unsafe-inline`.

---

## Finding 4: querySelector template literal uses a data attribute without strict type validation

**Severity:** Low

**OWASP category:** A03:2021 Injection

**Location:** Lines 372 to 377

```javascript
function selectElement(n){
  const el=elMap[n];if(!el)return;
  ...
  const btn=document.querySelector(`#pt-grid .el-btn[data-n="${n}"]`);
```

**How to reproduce:** In browser developer tools, change the `data-n` attribute on any `.el-btn` element to a non-integer string containing a double-quote character. Clicking that element passes the malformed value to `querySelector`, which throws a `SyntaxError`.

**Risk:** The variable `n` is an atomic number derived from `btn.dataset.n`, a `data-n` attribute set during grid construction. Today these values are integers from the hard-coded `ELEMENTS` array, so they are safe. However, `dataset` values are strings set as HTML attributes and can in principle be manipulated by a browser extension or a future code path. If a non-integer value were placed in `data-n`, the `querySelector` call would throw a `SyntaxError`, crashing the selection logic silently. This is not an XSS vector because `querySelector` does not execute code, but it is a defensive-programming gap that could cause confusing failures.

**Recommended fix:** Parse `n` through `parseInt` with a radix of 10 and validate that it is a finite number before it reaches the template string. The `selectElement` function already does `const el=elMap[n]; if(!el)return;`, so adding `n=parseInt(n,10); if(!Number.isFinite(n))return;` before that line is sufficient.

---

## Finding 5: announce() reflects raw search input into a screen-reader live region

**Severity:** Low

**OWASP category:** A03:2021 Injection

**Location:** Line 460

```javascript
if(q)announce(`${count} element${count!==1?'s':''} match "${searchInput.value}".`);
```

**How to reproduce:** Type any string including special characters into the search field. The raw input is echoed into the `srLive` element and announced to screen readers.

**Risk:** `searchInput.value` is the user's typed search term. It is interpolated into a string that is then assigned to `srLive.textContent` at line 413. Because this uses `textContent` and not `innerHTML`, it cannot cause XSS. The concern is that if a future maintainer changes the assignment to `innerHTML` (perhaps when adding richer announcement formatting), the reflection of user input would become an XSS sink. The current code is safe; this is a maintenance note.

**Recommended fix:** No code change is strictly needed at present. Add a code comment immediately before the `srLive.textContent` assignment at line 413 stating that this element must always use `textContent` and never `innerHTML`, to prevent a future refactor from introducing an XSS vulnerability.

---

## Finding 6: No referrer policy meta tag

**Severity:** Informational

**OWASP category:** A05:2021 Security Misconfiguration

**Location:** Lines 1 to 8 (the `<head>` section)

**Risk:** The page has no referrer policy. By default, browsers send the full URL as a `Referer` header when a user navigates away from the page. The current page has no outbound links, so the immediate risk is zero. However, if links to external reference sites are added in future, the default policy would send the full page URL to those third-party sites.

**Recommended fix:** Add `<meta name="referrer" content="no-referrer">` to the `<head>` section, or use `strict-origin-when-cross-origin` if the project later needs referrer data for its own analytics.

---

## Finding 7: No external links that open a new tab (confirmed safe)

**Severity:** Informational

**OWASP category:** A05:2021 Security Misconfiguration

**Location:** Not applicable

The code was checked for links that open a new tab without `rel="noopener noreferrer"`. No such links exist in the current file. This check passes.

---

## Finding 8: No hard-coded secrets, API keys, or tokens (confirmed safe)

**Severity:** Informational

**OWASP category:** A02:2021 Cryptographic Failures

**Location:** Not applicable

The entire JavaScript payload was inspected for API keys, tokens, passwords, and credentials. None are present. This check passes.

---

## Finding 9: No mixed content (confirmed safe)

**Severity:** Informational

**OWASP category:** A05:2021 Security Misconfiguration

**Location:** Not applicable

Both external resources at lines 7 and 8 use `https://`. No plain HTTP URLs are present anywhere in the file. This check passes.

---

## Finding 10: No URL parameters, localStorage, or sessionStorage used (confirmed safe)

**Severity:** Informational

**OWASP category:** A03:2021 Injection

**Location:** Not applicable

The code was checked for reads from `location.search`, `location.hash`, `localStorage`, and `sessionStorage`. None are present. This check passes.

---

## Finding 11: No inline event handler attributes (confirmed safe)

**Severity:** Informational

**OWASP category:** A03:2021 Injection

**Location:** Not applicable

The HTML was checked for `onclick`, `onmouseover`, `onfocus`, and similar inline event handler attributes. None are present. All event listeners are attached programmatically via `addEventListener`. This check passes.

---

## Finding 12: No dangerous code-execution sinks (confirmed safe)

**Severity:** Informational

**OWASP category:** A03:2021 Injection

**Location:** Not applicable

The script was checked for the following high-risk XSS sinks that execute or write arbitrary code: the global `eval` function; constructing callable code dynamically from a string at runtime; the legacy `document` methods that write HTML directly to the parser stream; `insertAdjacentHTML`; and `outerHTML`. None of these patterns appear anywhere in the script. This check passes.

---

## Summary of findings

| Severity | Count |
| --- | --- |
| Critical | 0 |
| High | 0 |
| Medium | 3 |
| Low | 2 |
| Informational | 7 |

**Most important items for the next sprint**

1. Finding 1 (Medium): Replace `innerHTML` with DOM construction methods. The current data is safe; the pattern is not. An XSS vulnerability will appear the moment an external data source is added without this fix in place.
2. Finding 2 (Medium): Self-host the Google Fonts files to remove the third-party CDN dependency, which currently cannot be protected by Subresource Integrity.
3. Finding 3 (Medium): Add a Content Security Policy, even a permissive one, to give browsers a baseline restriction and make any future injection attempts harder.

**Open questions for Tim (to be relayed via Sonja)**

1. Self-hosting fonts adds a one-time download step and a small number of additional files to the repository. Should the team self-host the Rajdhani, Share Tech Mono, and Nunito Sans fonts, or is the Google Fonts CDN dependency acceptable as a documented exception?
2. GitHub Pages does not support custom HTTP response headers natively. If a Content Security Policy must be delivered as an HTTP header rather than a `<meta>` tag, a GitHub Actions deploy step or a proxy such as Cloudflare would be needed. Which approach does Tim prefer, or is the `<meta>` tag route acceptable?
3. A future version of the page may link element names or symbols to external reference sources such as Wikipedia or the IUPAC (International Union of Pure and Applied Chemistry) website. Should outbound links be part of a planned enhancement, or should they be excluded from scope?

# Security exceptions: Periodic-Table

These are documented exceptions to security controls that the team's standards require but GitHub Pages cannot deliver. Each exception was reviewed by Gerrie (security governance) and approved by Tim Dixon on 2026-05-21.

## Exception 1: X-Frame-Options header unavailable on GitHub Pages

- **Control:** X-Frame-Options (clickjacking protection), and the equivalent Content-Security-Policy (CSP) `frame-ancestors` directive.
- **OWASP category:** A05:2021 Security Misconfiguration.
- **Scope:** The entire Periodic-Table site at `https://projects.timdixon.net/Periodic-Table/`, served from GitHub Pages.
- **Reason:** GitHub Pages is a static hosting platform. It does not allow site owners to set custom HTTP response headers. X-Frame-Options requires an HTTP response header; there is no meta-tag equivalent. The CSP `frame-ancestors` directive can substitute for X-Frame-Options, but it also requires delivery as a response header; a meta-tag CSP ignores `frame-ancestors`. Neither control can therefore be delivered on this platform without a proxy or a different host.
- **Mitigation:** The page has no login form, no session, and no interactive action with a side effect (no data is submitted, stored, or changed by any user interaction). There is therefore very little for a clickjacking attack to capture. If the page later gains a form or a privileged action, the team should add a framing-buster script as a partial defence, or move to a host that can send the header (such as Netlify or Cloudflare Pages). The absence of the header is recorded here rather than hidden, so the gap is visible at every review.
- **Approved by Tim:** Yes, approved on 2026-05-21.
- **Review date:** 2027-05-21, or earlier if the page gains any interactive action with a side effect.

## Exception 2: Permissions-Policy header unavailable on GitHub Pages

- **Control:** Permissions-Policy (restricts access to browser features such as geolocation, camera, and microphone).
- **OWASP category:** A05:2021 Security Misconfiguration.
- **Scope:** The entire Periodic-Table site at `https://projects.timdixon.net/Periodic-Table/`, served from GitHub Pages.
- **Reason:** GitHub Pages cannot send custom HTTP response headers. Permissions-Policy requires a response header. The `<meta>` tag form of Permissions-Policy (`<meta http-equiv="Permissions-Policy">`) is not reliably supported across browsers, and for the directives that matter here (geolocation, camera, microphone) the meta tag provides no meaningful protection. The control cannot be applied on this platform.
- **Mitigation:** The page never uses geolocation, the camera, or the microphone. It contains no JavaScript that requests these browser features. A static periodic table has no legitimate reason to access them, so the risk that an attacker could exploit their absence from the policy is extremely low. The gap is recorded so that it is visible at review, and so the team knows to add the header if the project moves to a host that supports it.
- **Approved by Tim:** Yes, approved on 2026-05-21.
- **Review date:** 2027-05-21, or earlier if the project moves to a different host.

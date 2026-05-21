# Decision Record 003: GitHub Pages hosting and security headers

## Status

Accepted. Decided by Jacob (architect) on 2026-05-21, during work 001-periodic-table-setup. Reviewed by Sonja.

## Context

Periodic-Table is hosted on GitHub Pages, served from the `main` branch, as recorded in `coding-standards.md`. GitHub Pages is the team's standard host for static projects, set in the global wiki's Decision Record 001.

The team's coding standards require every site to send a set of security response headers: Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy, X-Frame-Options, and Permissions-Policy. The stack standard says to set these headers through the hosting configuration.

GitHub Pages has a hard limit here: it does not let the project set arbitrary HyperText Transfer Protocol (HTTP) response headers. The project controls the files it serves, but not the headers GitHub Pages attaches to them. This record decides how the team meets the security-header standard within that limit.

## Decision

The team accepts GitHub Pages as the host and works within its header limit, rather than moving the project to a host that allows custom headers. The cost of moving (a new host, a deployment pipeline, and a maintained server) is not justified for a static page with no personal data and no server-side logic. The headers are delivered as far as the platform allows, and the gap is recorded honestly.

Each required header is handled as follows.

### Content-Security-Policy: meta tag

The Content-Security-Policy is delivered through an HTML `<meta http-equiv="Content-Security-Policy">` tag in the `<head>` of `index.html`. A meta-tag policy is enforced by the browser almost as fully as a header-delivered one. Its known limits are that it cannot use the `frame-ancestors` directive, the `report-uri` or `report-to` directives, or the sandbox directive, and it takes effect slightly later than a header. None of these limits matter for this project: clickjacking is addressed separately below, and the project does not collect violation reports.

The starting policy, to be confirmed by Gerrie's security review, is:

`default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`

Notes on this policy:

- `script-src 'self'` is reachable only after Decision Record 001 moves the inline script into its own file. Until then the policy needs `'unsafe-inline'` for scripts, which weakens it. The split must therefore land before or with the policy, so the policy never has to allow inline script.
- `style-src` and `font-src` allow the Google Fonts origins because the page loads fonts from them. Decision Record 004 covers the dependency posture of those fonts and notes that self-hosting them would let `style-src` and `font-src` reduce to `'self'`.
- `frame-ancestors 'none'` is included for completeness. A meta-tag policy ignores it, so it does not protect against framing on its own; the `X-Frame-Options` note below explains the residual gap.

### Strict-Transport-Security

This header cannot be set by the project. GitHub Pages sends its own Strict-Transport-Security header for the default `github.io` domain once "Enforce HTTPS" is enabled. The work brief records that "Enforce HTTPS" was enabled for this repository on 2026-05-21, so HTTPS is enforced and the platform supplies this header. No project action is needed.

### X-Content-Type-Options

This header cannot be set by the project, and has no meta-tag equivalent. GitHub Pages sends `X-Content-Type-Options: nosniff` on its responses by default, so the protection is in place through the platform.

### Referrer-Policy

Delivered through a `<meta name="referrer">` tag in the `<head>`, set to `strict-origin-when-cross-origin`. The meta `referrer` tag is well supported by browsers and is the standard way to set a referrer policy from a page.

### X-Frame-Options and clickjacking

This header cannot be set by the project, and it has no meta-tag equivalent. The Content-Security-Policy `frame-ancestors` directive, which would replace it, is ignored when the policy is delivered by meta tag. This leaves a genuine residual gap: the page cannot fully forbid being framed by another site using only files it controls.

The risk this leaves is low. The page has no login, no form that submits data, and no action with a side effect, so there is little for a clickjacking attack to capture. The gap is recorded as a security exception for Gerrie to assess and for the project's `exceptions/` folder, rather than hidden. If the page ever gains an interactive action worth protecting, the project should add a small framing-buster script as a partial mitigation, or move to a host that can send the header.

### Permissions-Policy

This header cannot be set by the project, and its meta-tag form is not reliably supported across browsers. The risk it addresses is low for this project, because the page never uses geolocation, the camera, or the microphone, and a static page cannot quietly start using them. The absence of this header is recorded as a low-risk security exception alongside the X-Frame-Options gap.

## Alternatives considered

### Move to a host that allows custom headers

Considered and rejected for now. A host such as Netlify or Cloudflare Pages can set every required header from a configuration file. But moving means leaving the team's standard static host, taking on a new platform, and maintaining a deployment path. For a static page with no personal data, the headers GitHub Pages cannot deliver are the lower-risk ones, and the gap is small. The move is not justified today. It remains the right answer if the project later needs the full header set, for example if it gains interactive actions worth protecting from clickjacking.

### Put GitHub Pages behind a proxy that adds headers

Considered and rejected. A proxy or content delivery network in front of GitHub Pages, such as Cloudflare, can add the missing headers. It also adds a second platform to configure and maintain, and a custom domain to manage. That overhead is not repaid for a project of this size and risk.

### Accept the meta-tag Content-Security-Policy and do nothing about the rest

Rejected as incomplete. Delivering the Content-Security-Policy and Referrer-Policy by meta tag is correct, but silently dropping X-Frame-Options and Permissions-Policy would hide a real gap. Recording them as security exceptions keeps the team honest and gives Gerrie a clear item to assess.

## Consequences

- `index.html` carries a Content-Security-Policy meta tag and a Referrer-Policy meta tag. Gerrie confirms the exact Content-Security-Policy value during the security review, and Carol tests that the page still works under it.
- The Content-Security-Policy depends on Decision Record 001. The inline script must move to its own file so the policy can use `script-src 'self'` and never `'unsafe-inline'` for scripts.
- Strict-Transport-Security and X-Content-Type-Options are supplied by GitHub Pages and need no project action. "Enforce HTTPS" is enabled.
- Two security exceptions are recorded in the project wiki's `exceptions/` folder: the X-Frame-Options and `frame-ancestors` gap, and the missing Permissions-Policy. Both are low risk for a static page with no interactive actions and no personal data. Gerrie assesses and signs them off.
- If the project later needs the full header set, the recorded answer is to move to a host that can send custom headers, such as Netlify or Cloudflare Pages.

# Privacy: Periodic Table

This document records the privacy posture for the Periodic Table project. It is produced during the project setup pass and updated whenever the analytics or data collection approach changes.

## Analytics

This project uses GoatCounter for analytics. GoatCounter is self-hosted at the same origin as the project site and does not send data to any third party. It records page views, referrer, browser, operating system, screen size, and country derived from IP address. IP addresses are not stored; country-level geolocation is derived at the moment of the request and discarded. GoatCounter does not use cookies or local storage and does not track users across sessions or sites.

## Data collection statement

The project collects anonymised aggregate usage data (page views and session metadata as described under Analytics). No personally identifiable information is collected, stored, or processed. No user accounts exist. No forms collect personal data.

## Third-party services

| Service | What it receives | Why |
|---|---|---|
| GoatCounter (self-hosted) | Page URL, referrer, browser, OS, screen size, country (derived from IP, not stored) | Privacy-respecting analytics to understand how the periodic table is used |

All assets (HTML, CSS, JavaScript, and web fonts) are self-hosted and served from the same origin as the page. No external font service, CDN, or analytics provider is contacted at load time.

## UK GDPR obligations

This project does not collect, store, or process personal data as defined by the UK General Data Protection Regulation (UK GDPR). Anonymised aggregate statistics from which no individual can be identified do not constitute personal data under UK GDPR. No further obligations arise.

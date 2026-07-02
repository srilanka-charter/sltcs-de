# SEO Audit Findings for de.srilanka-charter.com (2026-07-02)

Source: /home/ubuntu/upload/SEO_Audit_Report_de_srilanka_charter_ja.pdf

## Critical findings
- `/robots.txt` is returning an HTML SPA shell instead of a valid `text/plain` robots file.
- Major subroutes such as `/price`, `/faq`, `/contact`, `/vehicles`, `/about`, and `/destinations` are reported as sharing the homepage canonical and same HTML shell, preventing independent indexing.
- The sitemap reportedly references hash-fragment URLs like `/#plans` and `/#courses`, which are not independently indexable pages.
- All routes reportedly share the same title and meta description.
- Rendered DOM reportedly lacks meaningful per-page H1/H2 structure on key routes.
- Structured data is missing for key page types.

## Priority section from the audit
1. Fix `robots.txt` so the route serves a valid `text/plain` file.
2. Implement SSR or equivalent server-rendered/prerendered unique HTML for each major route.
3. Update sitemap to point to real renderable URLs instead of hash fragments.
4. Compress images and convert to WebP where possible.
5. Add page-specific H1/H2 and per-route metadata.
6. Add schema markup such as `LocalBusiness`, `FAQPage`, and `Offer`.

## User emphasis
The user explicitly asked to fix the issues highlighted in the attached screenshots, especially items 2 and 3 in the priority list, because otherwise the site may remain unindexed.

## Notes
- Project-level SEO checklist requires `useSEO` for all new pages, H1 exactly once per page, sitemap updates, and robots.txt consistency for noindex pages.
- Need to verify the current live implementation before changing architecture, because the audit may reflect an older deployment or incomplete crawl assumptions.

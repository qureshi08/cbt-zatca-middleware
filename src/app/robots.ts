import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Wide open by default (this also permits AI/answer-engine crawlers — GPTBot,
 * ClaudeBot, PerplexityBot, Google-Extended, etc. — for AEO, since none are
 * singled out for blocking). Only the authenticated app surface is disallowed:
 * a crawler hitting those just gets redirected to /login, which is wasted
 * crawl budget and would look like a soft-404/cloak if indexed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/profile",
        "/onboarding",
        "/invoices",
        "/activity",
        "/api-docs",
        "/team",
        "/support",
        "/settings",
        "/admin",
        "/auth",
        "/api/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

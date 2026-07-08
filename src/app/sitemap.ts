import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Only the genuinely public, indexable routes — authenticated app pages
 * (dashboard, settings, invoices, etc.) are excluded on purpose: a crawler
 * hitting them would just get redirected to /login, which is useless to index
 * and wastes crawl budget. See also robots.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}

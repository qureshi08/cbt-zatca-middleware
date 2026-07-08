import type { MetadataRoute } from "next";
import { SITE_NAME, ORG_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — ${ORG_NAME}`,
    short_name: SITE_NAME,
    description: "ZATCA Phase 2 e-invoicing middleware for Odoo, Zoho Books, and custom software.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#00994D",
    icons: [{ src: "/cbt-favicon-mark.png", sizes: "875x875", type: "image/png" }],
  };
}

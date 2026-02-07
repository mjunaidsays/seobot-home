"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/posthog";

export default function SmoothScrollAnchors() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href")!.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });

      const ctaName = anchor.getAttribute("data-cta-name");
      if (ctaName) {
        trackEvent("cta_clicked", {
          cta_text: ctaName,
          cta_location: anchor.getAttribute("data-cta-location") ?? undefined,
          cta_target: anchor.getAttribute("href") ?? undefined,
        });
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}

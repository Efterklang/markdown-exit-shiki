// Utility helpers for Shiki rendering and code blocks

import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { ParsedConfig } from "./types";

// Escape HTML special characters in raw code
export function escapeHtml(code: string): string {
  return code
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// Toolbar HTML for Shiki figure
export function createShikiTools(
  lang: string,
  title: string,
  displayItems: {
    lang?: boolean;
    title?: boolean;
    wrapToggle?: boolean;
    copyButton?: boolean;
  },
): string {
  const leftParts = [
    '<div class="left">',
    '<div class="traffic-lights"> <span class="traffic-light red"></span> <span class="traffic-light yellow"></span> <span class="traffic-light green"></span> </div>',
  ];
  if (displayItems.lang) {
    leftParts.push(`<div class="code-lang">${lang.toUpperCase()}</div>`);
  }
  leftParts.push("</div>");
  const leftSection = leftParts.join("");

  const centerParts = ['<div class="center">'];
  if (displayItems.title && title) {
    centerParts.push(`<div class="code-title">${title}</div>`);
  }
  centerParts.push("</div>");
  const centerSection = centerParts.join("\n");

  const rightParts = ['<div class="right">'];
  if (displayItems.wrapToggle) {
    rightParts.push(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toggle-wrap" title="Toggle Wrap"><path d="m16 16-3 3 3 3"/><path d="M3 12h14.5a1 1 0 0 1 0 7H13"/><path d="M3 19h6"/><path d="M3 5h18"/></svg>',
    );
  }
  if (displayItems.copyButton) {
    rightParts.push(
      '<div class="copy-notice"></div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-button"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="M16 4h2a2 2 0 0 1 2 2v4"/><path d="M21 14H11"/><path d="m15 10-4 4 4 4"/></svg>',
    );
  }
  rightParts.push("</div>");
  const rightSection = rightParts.join("\n");
  return `<div class="shiki-tools">${leftSection}${centerSection}${rightSection}</div>`;
}

// Write CSS captured from transformer to local file
export async function writeCssAsync(
  cssGetter: (() => string) | undefined,
  cssOutputPath: string | undefined,
): Promise<void> {
  if (cssGetter && cssOutputPath) {
    const css = cssGetter();
    await mkdir(dirname(cssOutputPath), { recursive: true });
    await writeFile(cssOutputPath, css, "utf8");
  }
}

// Compute collapse-related attributes and expand button
export function computeCollapseAttributes(
  cfg: ParsedConfig,
  codeHtml: string,
): {
  expandButton: string;
  collapseAttrs: string;
} {
  const codeLines = (codeHtml.match(/<span class="line/g) || []).length;
  const shouldCollapse =
    cfg.collapseConfig.enable && codeLines > cfg.collapseConfig.maxLines;
  const expandButton = shouldCollapse
    ? '<div class="code-expand-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="expand-icon"><path d="M12 22v-6"/><path d="M12 8V2"/><path d="M4 12H2"/><path d="M10 12H8"/><path d="M16 12h-2"/><path d="M22 12h-2"/><path d="m15 19-3 3-3-3"/><path d="m15 5-3-3-3 3"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="collapse-icon"><path d="M12 22v-6"/><path d="M12 8V2"/><path d="M4 12H2"/><path d="M10 12H8"/><path d="M16 12h-2"/><path d="M22 12h-2"/><path d="m15 19-3-3-3 3"/><path d="m15 5-3 3-3-3"/></svg></div>'
    : "";
  const collapseAttrs = shouldCollapse
    ? ` data-collapsible="true" data-max-lines="${cfg.collapseConfig.maxLines}" data-total-lines="${codeLines}"`
    : "";

  return {
    expandButton,
    collapseAttrs,
  };
}

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
      '<iconify-icon icon="fa6-solid:arrow-down-wide-short" class="toggle-wrap" title="Toggle Wrap"></iconify-icon>',
    );
  }
  if (displayItems.copyButton) {
    rightParts.push(
      '<div class="copy-notice"></div><iconify-icon icon="fa6-solid:paste" class="copy-button"></iconify-icon>',
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
    ? '<div class="code-expand-btn"><iconify-icon icon="garden:chevron-double-down-fill-16"></iconify-icon></div>'
    : "";
  const collapseAttrs = shouldCollapse
    ? ` data-collapsible="true" data-max-lines="${cfg.collapseConfig.maxLines}" data-show-lines="${cfg.collapseConfig.showLines}" data-total-lines="${codeLines}"`
    : "";

  return {
    expandButton,
    collapseAttrs,
  };
}

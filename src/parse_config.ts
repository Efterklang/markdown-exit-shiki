import { transformerColorizedBrackets } from "@shikijs/colorized-brackets";

import * as t from "@shikijs/transformers";
import type { ShikiTransformer } from "shiki/types";
import type { ShikiOptions } from "./types";

const TRANSFORMERS = [
  t.transformerCompactLineOptions(),
  t.transformerMetaHighlight(),
  t.transformerMetaWordHighlight(),
  t.transformerNotationDiff(),
  t.transformerNotationErrorLevel(),
  t.transformerNotationFocus(),
  t.transformerNotationHighlight(),
  t.transformerNotationWordHighlight(),
  t.transformerRemoveLineBreak(),
  t.transformerRemoveNotationEscape(),
  t.transformerRenderWhitespace(),
  transformerColorizedBrackets(),
];

export function parseConfig(renderOptions: ShikiOptions) {
  // Default options
  const options = renderOptions || {};

  let enabled_transformers: ShikiTransformer[] = [];
  for (const name of options.transformers || ["all"]) {
    if (name === "all") {
      enabled_transformers = TRANSFORMERS;
    }
    const transformer = TRANSFORMERS.find((t) => t.name === name);
    if (transformer) {
      enabled_transformers.push(transformer);
    }
  }

  let toClass: t.ShikiTransformerStyleToClass | null = null;
  if (options.style_to_class?.enable) {
    toClass = t.transformerStyleToClass({
      classPrefix: options.style_to_class.class_prefix || "_sk_",
    });
    enabled_transformers.push(toClass);
  }

  return {
    themes: options.themes || {
      light: "catppuccin-latte",
      dark: "catppuccin-mocha",
    },
    excludes: options.exclude_languages || ["mermaid"],
    aliases: options.language_aliases || {},
    collapseConfig: {
      enable: options.code_collapse?.enable !== false,
      maxLines: options.code_collapse?.max_lines || 20,
      showLines: options.code_collapse?.show_lines || 20,
    },
    styleToClass: {
      enable: options.style_to_class?.enable || false,
      cssGetter: toClass?.getCSS,
      css_output_path: options.style_to_class?.css_output_path,
    },
    transformers: enabled_transformers,
    toolbarItems: {
      lang: options.toolbar_items?.lang ?? true,
      title: options.toolbar_items?.title ?? true,
      wrapToggle: options.toolbar_items?.wrapToggle ?? true,
      copyButton: options.toolbar_items?.copyButton ?? true,
    },
  };
}

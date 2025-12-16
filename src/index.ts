import type { MarkdownExit } from "markdown-exit";
import { codeToHtml } from "shiki";
import { parseConfig } from "./parse_config";
import {
  createShikiTools,
  escapeHtml,
  computeCollapseAttributes as getCollapseAttrs,
  writeCssAsync,
} from "./shiki_utils";
import type { ShikiOptions } from "./types";

function renderCode(md: MarkdownExit, renderOptions: ShikiOptions) {
  const cfg = parseConfig(renderOptions);

  md.renderer.rules.fence = async (tokens, idx) => {
    const token = tokens[idx];
    if (!token) return "";

    const code = token.content;
    const lang = token.info.split(/\s+/)[0] || "";
    const attrs = token.info.split(/\s+/).slice(1).join(" ");

    if (cfg.excludes.includes(lang)) {
      const escaped = escapeHtml(code);
      return `<pre><code class="${lang}">${escaped}</code></pre>`;
    }
    const normalizedCode = code.replace(/\r?\n$/, "");
    const mappedLang = cfg.aliases[lang] || lang;
    let code_html = await codeToHtml(normalizedCode, {
      lang: mappedLang,
      themes: cfg.themes,
      transformers: cfg.transformers,
    });
    await writeCssAsync(
      cfg.styleToClass.cssGetter,
      cfg.styleToClass.css_output_path,
    );
    code_html = code_html.replace(/<pre[^>]*>/, (match: string) =>
      match.replace(/\s*style\s*=\s*"[^"]*"\s*tabindex="0"/, ""),
    );

    const title = attrs || "";

    const shikiToolsHtml = createShikiTools(
      lang || "",
      title,
      cfg.toolbarItems,
    );

    const { expandButton, collapseAttrs } = getCollapseAttrs(cfg, code_html);
    return `<figure class="shiki" ${collapseAttrs}> ${shikiToolsHtml} ${code_html}${expandButton} </figure>`;
  };

  md.renderer.rules.code_inline = async (tokens, idx, _options, _env, self) => {
    const token = tokens[idx];
    if (!token) return "";

    const content = token.content.trim();
    const match = content.match(/^\{(\w+)\}\s+(.+)$/);
    // Case 1: No language specified, e.g. `console.log('Hello')`
    if (match === null) {
      return `<code${self.renderAttrs(token)}>${escapeHtml(content)}</code>`;
    }
    // Case 2: Language specified, e.g. `{js} console.log('Hello')`
    const [, lang, code] = match;
    if (!lang || !code) return `<code>${content}</code>`;
    const highlighted = await codeToHtml(code, {
      lang: lang,
      themes: cfg.themes,
      structure: "inline",
    });
    return `<code${self.renderAttrs(token)}>${highlighted}</code>`;
  };
}

export default renderCode;

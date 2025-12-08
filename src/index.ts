import { codeToHtml } from "shiki";
import type { MarkdownExit } from "markdown-exit";

type InlineCodeOptions = {
  themes: Record<string, string>;
};

function renderInlineCode(md: MarkdownExit, renderOptions: InlineCodeOptions) {
  md.renderer.rules.code_inline = async function (
    tokens,
    idx,
    options,
    env,
    self,
  ) {
    const token = tokens[idx];
    if (!token) return "";

    const content = token.content.trim();
    const match = content.match(/^\{(\w+)\}\s+(.+)$/);
    // Case 1: No language specified, e.g. `console.log('Hello')`
    if (match === null) {
      return "<code" + self.renderAttrs(token) + ">" + content + "</code>";
    }
    // Case 2: Language specified, e.g. `{js} console.log('Hello')`
    const [lang, code] = match.slice(1);
    const highlighted = await codeToHtml(code!, {
      lang: lang!,
      themes: renderOptions.themes,
      structure: "inline",
    });
    return "<code" + self.renderAttrs(token) + ">" + highlighted + "</code>";
  };
}

export default renderInlineCode;
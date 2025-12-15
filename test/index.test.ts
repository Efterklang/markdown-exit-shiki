import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { MarkdownExit } from "markdown-exit";
import renderCode from "../src/index";

describe("Markdown Rendering", () => {
  it("should render markdown to html with shiki highlighting", async () => {
    const md = new MarkdownExit();

    // Configure shiki options
    const shikiOptions = {
      exclude_languages: ["mermaid"],
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-mocha",
      },
      code_collapse: {
        enable: true,
        max_lines: 10, // Set low to test collapse
        show_lines: 5,
      },
    };

    // Apply the plugin
    renderCode(md, shikiOptions);

    // Read template
    const templatePath = join(__dirname, "/assets/template.md");
    const template = readFileSync(templatePath, "utf-8");

    // Render
    // Assuming render is async because highlight is async
    const htmlContent = await md.renderAsync(template);

    // Create full HTML document
    const fullHtml = `
<!DOCTYPE html>
<html lang="en" data-theme="mocha">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shiki Test Output</title>
  <link rel="stylesheet" href="./assets/shiki.css">
  <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
</head>
<body>
  ${htmlContent}
  <script src="./assets/shiki.js"></script>
</body>
</html>
    `;

    // Write output
    const outputPath = join(__dirname, "output.html");
    writeFileSync(outputPath, fullHtml);

    expect(existsSync(outputPath)).toBe(true);
    console.log(`Output written to ${outputPath}`);
  });
});

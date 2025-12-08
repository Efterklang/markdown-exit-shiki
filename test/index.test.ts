import { createMarkdownExit} from "markdown-exit";
import { renderInlineCode } from "../src/index.ts";

const renderOptions = {
  themes: {
    light: "github-light",
    dark: "github-dark",
  },
};

const md = createMarkdownExit()

md.use(renderInlineCode, renderOptions)

const code_examples = [
  "`print('Hello, World!')`",
  "`{py} print('Hello, World!')`",
  "`{md} #Heading1`"
]

for (const example of code_examples) {
  const output = await md.renderInlineAsync(example);
  console.log(output);
}

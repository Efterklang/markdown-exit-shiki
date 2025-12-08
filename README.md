# markdown-exit-inline-code

A markdown-exit plugin that provides syntax-highlighted inline code using Shiki.

<img width="952" height="504" alt="image" src="https://github.com/user-attachments/assets/1b34f316-01ea-4718-9133-2d2c23dad944" />

## Install

```shell
bun i shiki
bun i markdown-exit-inline-code
```

## Syntax

Use the following syntax to highlight inline code:

```markdown
`{language} code here`
```

**Example:**

```markdown
- JavaScript: `{js} console.log("hello")`
- Python: `{python} print("hello")`
- TypeScript: `{ts} const x: number = 42`
```

## Options

| Option   | Type                     | Description                                                                                                                       |
| -------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `themes` | `Record<string, string>` | A map of theme names to Shiki theme IDs. Default: `{ light: 'catppuccin-latte', dark: 'catppuccin-mocha', tokyo: 'tokyo-night' }` |

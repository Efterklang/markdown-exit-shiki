## Inline

- Code:
  - `console.log("Hello, World!");`
- Code With Syntax Highlighting:
  - javascript: `{js} console.log("Hello, World!");`
  - shell: `{shell} npm install hexo --save`
  - python: `{python} print("Hello, World!")`
  - css: `{css} body { background-color: #f0f0f0; }`

## Transformers

### Diff

```ts
console.log("hewwo"); // [!code --]
console.log("hello"); // [!code ++]
console.log("goodbye"); // [!code --]
```

### Highlight

```ts
console.log("Not highlighted");
console.log("Highlighted"); // [!code highlight]
console.log("Not highlighted");
```

### WordHighlight

```ts
// [!code word:Hello]
const message = "Hello World";
console.log(message); // prints Hello World
```

### Focus

```ts
console.log("Not focused");
console.log("Focused"); // [!code focus]
console.log("Not focused");
```

### ErrorLevel

```ts
console.log("No errors or warnings");
console.error("Error"); // [!code error]
console.warn("Warning"); // [!code warning]
```

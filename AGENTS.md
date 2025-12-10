---
applyTo: "**/*.{js,ts,jsx,tsx}"
---

# Deno 2 Instructions for Copilot

These are the main points and differences to keep in mind when working with Deno
2, especially compared to Node.js and Deno 1. For more, see the
[Deno Fundamentals](https://docs.deno.com/runtime/fundamentals/).

## Key Differences from Node.js (Deno 2)

- **Native npm and Node.js Support:**
  - Deno 2 can import and use npm packages directly, and has improved Node.js
    compatibility. You can use `import ... from "npm:package"` or
    `import ... from "node:fs"`.
  - Example: `import express from "npm:express";`
  - See:
    [Node.js compatibility](https://docs.deno.com/runtime/fundamentals/node/)

- **Direct URL Imports Still Supported:**
  - You can still import modules via URL as in Deno 1.
  - Example: `import { serve } from "https://deno.land/std/http/server.ts";`

- **No `node_modules` by Default:**
  - Deno caches npm and URL dependencies internally, not in a `node_modules`
    folder.

- **TypeScript and JavaScript Out of the Box:**
  - Deno 2 runs both natively, no config needed.

- **Secure by Default:**
  - Permissions are still required for file, network, and environment access
    (e.g., `deno run --allow-net main.ts`).

- **Standard Library:**
  - Now distributed via [JSR](https://jsr.io/@std) and still available at
    `https://deno.land/std/`.

- **Single Executable:**
  - Deno is a single binary, no global installs or separate runtime.

- **ES Modules Only:**
  - Deno uses ES Modules (`import/export`). No `require()` or `module.exports`.

- **Scripts:**
  - Use `deno run` instead of `node`.
  - Example: `deno run main.ts`

- **Configuration:**
  - Uses `deno.json` or `deno.jsonc` for config, not `package.json`.

## Useful Commands

- List of defined tasks: `deno task`
- Run a task: `deno task start`
- Format code: `deno fmt`
- Lint code: `deno lint`
- Test: `deno test`
- Add jsr dependency: `deno add jsr:hono`

---

For more, see the [Deno Docs](https://docs.deno.com/runtime/fundamentals/).

const { spawnSync } = require("node:child_process");
const path = require("node:path");

const pkgPath = require.resolve("@cloudflare/next-on-pages/package.json");
const cliPath = path.join(path.dirname(pkgPath), "bin", "index.js");

const env = { ...process.env };

for (const key of Object.keys(env)) {
  if (key.startsWith("VERCEL") || key.startsWith("NEXT_PUBLIC_VERCEL")) {
    delete env[key];
  }
}

const result = spawnSync(process.execPath, [cliPath, ...process.argv.slice(2)], {
  stdio: "inherit",
  env,
});

process.exit(result.status ?? 1);
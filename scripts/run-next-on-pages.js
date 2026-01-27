const { spawnSync } = require("node:child_process");
const isWindows = process.platform === "win32";
const npxCmd = isWindows ? "npx.cmd" : "npx";

const env = { ...process.env };

for (const key of Object.keys(env)) {
  if (key.startsWith("VERCEL") || key.startsWith("NEXT_PUBLIC_VERCEL")) {
    delete env[key];
  }
}

const result = spawnSync(npxCmd, ["@cloudflare/next-on-pages", ...process.argv.slice(2)], {
  stdio: "inherit",
  env,
});

process.exit(result.status ?? 1);
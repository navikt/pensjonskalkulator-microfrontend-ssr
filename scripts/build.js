import { execFileSync } from "node:child_process";
import { copyFile, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const output = new URL("dist/templates/", root);

await rm(new URL("dist/", root), { recursive: true, force: true });
execFileSync(process.execPath, [fileURLToPath(new URL("node_modules/typescript/bin/tsc", root))], {
  cwd: root,
  stdio: "inherit",
});

await mkdir(output, { recursive: true });
await Promise.all([
  copyFile(new URL("templates/style.css", root), new URL("style.css", output)),
  copyFile(new URL("templates/template.html", root), new URL("template.html", output)),
]);

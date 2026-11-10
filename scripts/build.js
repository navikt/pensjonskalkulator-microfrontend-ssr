import { execFileSync } from "node:child_process";
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import prefixer from "postcss-prefix-selector";

const root = new URL("../", import.meta.url);
const output = new URL("dist/templates/", root);

await rm(new URL("dist/", root), { recursive: true, force: true });
execFileSync(process.execPath, [fileURLToPath(new URL("node_modules/typescript/bin/tsc", root))], {
  cwd: root,
  stdio: "inherit",
});

const stylesheets = [
  "global/fonts.css",
  "global/tokens.css",
  "global/reset.css",
  "global/baseline.css",
  "global/print.css",
  "component/typography.css",
];
const aksel = await Promise.all(
  stylesheets.map((path) => readFile(new URL(`node_modules/@navikt/ds-css/dist/${path}`, root), "utf8")),
);
const styles = await readFile(new URL("templates/style.css", root), "utf8");
const result = await postcss([prefixer({ prefix: ".pensjonskalkulator-microfrontend-ssr" })]).process(
  `@layer aksel {\n${aksel.join("\n")}\n}\n${styles}`,
  { from: undefined },
);

await mkdir(output, { recursive: true });
await Promise.all([
  writeFile(new URL("style.css", output), result.css),
  copyFile(new URL("templates/template.html", root), new URL("template.html", output)),
]);

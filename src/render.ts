import { readFileSync } from "node:fs";
import { text } from "./language/text.js";
import type { Language } from "./types.js";

const template = readFileSync(new URL("./templates/template.html", import.meta.url), "utf8");
const css = readFileSync(new URL("./templates/style.css", import.meta.url), "utf8");
const url = "https://www.nav.no/pensjon/kalkulator/login";

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function render(language: Language): Buffer {
  const data = {
    heading: text.title[language],
    description: text.ingress[language],
    language,
    url,
  };
  const html = template.replace(/\{\{(heading|description|language|url)\}\}/g, (_, key: keyof typeof data) =>
    escapeHtml(data[key]),
  );
  return Buffer.from(`<style>${css}</style>\n${html}`, "utf8");
}

export const pages: Record<Language, Buffer> = {
  nb: render("nb"),
  nn: render("nn"),
  en: render("en"),
};

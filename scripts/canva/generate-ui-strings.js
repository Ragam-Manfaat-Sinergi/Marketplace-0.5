/**
 * ✅ Script otomatis untuk generate file Canva ui_strings.json
 * dari teks UI di project Next.js
 *
 * Jalankan dengan:
 *    node scripts/canva/generate-ui-strings.js
 */

import fs from "fs";
import path from "path";

const ROOT_DIR = process.cwd();
const SRC_DIR = path.join(ROOT_DIR, "app");
const OUTPUT_FILE = path.join(ROOT_DIR, "canva", "ui_strings.json");

// Pola regex sederhana untuk menangkap teks di JSX (bisa dikembangkan)
const TEXT_REGEX = />\s*([^<>{}=]+)\s*</g;

// Template awal
const base = {
  app_name: {
    defaultMessage: "Marketplace Design Studio",
    description: "Name of the Canva integration app."
  },
  app_description: {
    defaultMessage:
      "Design, customize, and upload your product artwork directly using Canva.",
    description: "App description in Canva."
  }
};

const messages = { ...base };

// Fungsi untuk cari teks di file .tsx
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  let match;

  while ((match = TEXT_REGEX.exec(content)) !== null) {
    const text = match[1].trim();

    // Filter teks yang bukan UI penting
    if (
      !text ||
      text.length < 2 ||
      /^[A-Z0-9_.-]+$/.test(text) ||
      text.includes("{") ||
      text.includes("}") ||
      text.startsWith("Rp") ||
      text.startsWith("http") ||
      text.includes("©")
    ) {
      continue;
    }

    // Generate key dari teks (snake_case)
    const key = text
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")
      .substring(0, 50);

    if (!messages[key]) {
      messages[key] = {
        defaultMessage: text,
        description: "Auto-detected UI text from Next.js components."
      };
    }
  }
}

// Rekursif scan folder
function scanDir(dir) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.endsWith(".tsx") || entry.endsWith(".jsx")) {
      scanFile(fullPath);
    }
  }
}

// Jalankan
console.log("🔍 Scanning project for UI text...");
scanDir(SRC_DIR);

// Pastikan folder output ada
const outDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Simpan hasil
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(messages, null, 2));
console.log(`✅ Canva UI strings generated at: ${OUTPUT_FILE}`);

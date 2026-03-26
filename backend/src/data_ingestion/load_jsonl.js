import fs from "fs";
import path from "path";
import readline from "readline";

/**
 * Load standard JSON file
 */
export function loadJSON(filePath) {
  try {
    const absolutePath = path.resolve(filePath);
    const rawData = fs.readFileSync(absolutePath, "utf-8");

    const parsed = JSON.parse(rawData);

    console.log(`✅ Loaded JSON file: ${filePath}`);
    return parsed;
  } catch (err) {
    console.error(`❌ Error loading JSON file: ${filePath}`);
    console.error(err.message);
    throw err;
  }
}

/**
 * Load JSONL file (one JSON per line)
 */
export async function loadJSONL(filePath) {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const stream = fs.createReadStream(absolutePath);

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  const results = [];

  try {
    for await (const line of rl) {
      if (!line.trim()) continue;

      try {
        const obj = JSON.parse(line);
        results.push(obj);
      } catch {
        console.warn("⚠️ Skipping invalid JSONL line");
      }
    }

    console.log(`✅ Loaded JSONL file: ${filePath} (${results.length} records)`);
    return results;
  } catch (err) {
    console.error(`❌ Error reading JSONL file: ${filePath}`);
    throw err;
  }
}

/**
 * 🔥 Load ALL JSONL files inside a folder
 * (THIS IS WHAT YOU NEED FOR SAP DATASET)
 */
export async function loadJSONLFolder(folderPath) {
  const absoluteDir = path.resolve(folderPath);

  if (!fs.existsSync(absoluteDir)) {
    throw new Error(`❌ Folder not found: ${folderPath}`);
  }

  const files = fs.readdirSync(absoluteDir);

  let allData = [];

  for (const file of files) {
    const fullPath = path.join(absoluteDir, file);

    if (fs.statSync(fullPath).isDirectory()) continue;

    if (file.endsWith(".jsonl")) {
      const data = await loadJSONL(fullPath);
      allData = allData.concat(data);
    }
  }

  console.log(`📂 Loaded folder: ${folderPath} → ${allData.length} records`);
  return allData;
}

/**
 * Load ALL folders inside base dataset directory
 */
export async function loadFullDataset(basePath) {
  const absoluteBase = path.resolve(basePath);

  if (!fs.existsSync(absoluteBase)) {
    throw new Error(`❌ Dataset path not found: ${basePath}`);
  }

  const folders = fs.readdirSync(absoluteBase);

  const dataset = {};

  for (const folder of folders) {
    const folderPath = path.join(absoluteBase, folder);

    if (fs.statSync(folderPath).isDirectory()) {
      try {
        dataset[folder] = await loadJSONLFolder(folderPath);
      } catch (err) {
        console.warn(`⚠️ Skipping folder: ${folder}`);
      }
    }
  }

  console.log(`📦 Loaded full dataset (${Object.keys(dataset).length} folders)`);
  return dataset;
}

/**
 * Flatten nested arrays (utility)
 */
export function flattenData(data) {
  if (!Array.isArray(data)) return data;

  return data.flatMap((item) =>
    Array.isArray(item) ? item : [item]
  );
}
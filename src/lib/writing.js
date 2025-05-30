import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'src', 'data', 'writing');
const trDataDirectory = path.join(dataDirectory, 'tr');
const contentMapPath = path.join(process.cwd(), 'src', 'data', 'content-map.json');

// Helper function to read and parse JSON file
function readJsonFile(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

// Read content mapping
const contentMap = fs.existsSync(contentMapPath) ? readJsonFile(contentMapPath) : { enToTr: {}, trToEn: {} };

export function getAllWritingEntriesMetadata() {
  const fileNames = fs.readdirSync(dataDirectory).filter(file => file.endsWith('.json'));
  const trFileNames = fs.existsSync(trDataDirectory) ? fs.readdirSync(trDataDirectory).filter(file => file.endsWith('.json')) : [];

  // English entries
  const enEntries = fileNames.map(fileName => {
    const slug = fileName.replace(/\.json$/, '');
    const fullPath = path.join(dataDirectory, fileName);
    const jsonData = readJsonFile(fullPath);
    if (!jsonData) return null;
    const hasTranslation = contentMap.enToTr[slug] !== undefined;
    const trSlug = hasTranslation ? contentMap.enToTr[slug] : null;
    return {
      slug,
      title: jsonData.title,
      date: jsonData.date,
      dateISO: jsonData.dateISO,
      hasTranslation,
      trSlug,
      language: 'en',
    };
  }).filter(Boolean);

  // Turkish entries
  const trEntries = trFileNames.map(fileName => {
    const slug = fileName.replace(/\.json$/, '');
    const fullPath = path.join(trDataDirectory, fileName);
    const jsonData = readJsonFile(fullPath);
    if (!jsonData) return null;
    return {
      slug,
      title: jsonData.title,
      date: jsonData.date,
      dateISO: jsonData.dateISO,
      hasTranslation: false, // Optionally update if you want to check for EN translation
      trSlug: null,
      language: 'tr',
    };
  }).filter(Boolean);

  return [...enEntries, ...trEntries];
}

export function getWritingEntryBySlug(slug, lang = 'en') {
  // Handle Turkish translations
  if (lang === 'tr') {
    // Try to read the Turkish file directly
    const fullPath = path.join(trDataDirectory, `${slug}.json`);
    const jsonData = readJsonFile(fullPath);
    if (!jsonData) {
      console.error(`Turkish content not found for slug ${slug}`);
      return null;
    }
    return jsonData;
  }

  // Handle English content
  const fullPath = path.join(dataDirectory, `${slug}.json`);
  const jsonData = readJsonFile(fullPath);
  if (!jsonData) {
    console.error(`English content not found for slug ${slug}`);
    return null;
  }
  return jsonData;
} 
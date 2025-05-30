import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'src', 'data', 'writing');
const trDataDirectory = path.join(dataDirectory, 'tr');

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

// Helper function to get contentId from JSON file
function getContentId(filePath) {
  const data = readJsonFile(filePath);
  return data?.contentId;
}

export function getAllWritingEntriesMetadata() {
  const fileNames = fs.readdirSync(dataDirectory).filter(file => file.endsWith('.json'));
  const trFileNames = fs.existsSync(trDataDirectory) ? fs.readdirSync(trDataDirectory) : [];

  // First, create a map of contentId to Turkish slug
  const trContentMap = {};
  trFileNames.forEach(fileName => {
    const fullPath = path.join(trDataDirectory, fileName);
    const contentId = getContentId(fullPath);
    if (contentId) {
      trContentMap[contentId] = fileName.replace('.json', '');
    }
  });

  const allEntriesMetadata = fileNames.map(fileName => {
    // Remove ".json" from file name to get slug
    const slug = fileName.replace(/\.json$/, '');

    // Read full json file
    const fullPath = path.join(dataDirectory, fileName);
    const jsonData = readJsonFile(fullPath);
    if (!jsonData) return null;

    // Check if there's a Turkish translation by matching contentId
    const hasTranslation = jsonData.contentId && trContentMap[jsonData.contentId];
    const trSlug = hasTranslation ? trContentMap[jsonData.contentId] : null;

    // Return metadata needed for the list
    return {
      slug,
      title: jsonData.title,
      date: jsonData.date,
      hasTranslation,
      trSlug,
    };
  }).filter(Boolean); // Remove any null entries

  return allEntriesMetadata;
}

export function getWritingEntryBySlug(slug, lang = 'en') {
  // Handle Turkish translations
  if (lang === 'tr') {
    const fullPath = path.join(trDataDirectory, `${slug}.json`);
    const jsonData = readJsonFile(fullPath);
    if (!jsonData) return null;
    return jsonData;
  }

  // Handle English content
  const fullPath = path.join(dataDirectory, `${slug}.json`);
  const jsonData = readJsonFile(fullPath);
  if (!jsonData) return null;
  return jsonData;
} 
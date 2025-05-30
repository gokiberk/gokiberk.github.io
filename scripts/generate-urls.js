const fs = require('fs');
const path = require('path');

const dataDirectory = path.join(process.cwd(), 'src', 'data', 'writing');
const trDataDirectory = path.join(dataDirectory, 'tr');
const outputPath = path.join(process.cwd(), 'src', 'data', 'allUrls.json');

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

function generateUrls() {
  const enFiles = fs.readdirSync(dataDirectory).filter(file => file.endsWith('.json'));
  const trFiles = fs.existsSync(trDataDirectory) ? fs.readdirSync(trDataDirectory).filter(file => file.endsWith('.json')) : [];

  const urlMap = {};

  // First, process all files and create a map of contentId to slugs
  const contentIdMap = {};

  // Process English files
  enFiles.forEach(fileName => {
    const fullPath = path.join(dataDirectory, fileName);
    const data = readJsonFile(fullPath);
    if (data?.contentId) {
      const slug = fileName.replace('.json', '');
      contentIdMap[data.contentId] = {
        ...contentIdMap[data.contentId],
        en: slug
      };
    }
  });

  // Process Turkish files
  trFiles.forEach(fileName => {
    const fullPath = path.join(trDataDirectory, fileName);
    const data = readJsonFile(fullPath);
    if (data?.contentId) {
      const slug = fileName.replace('.json', '');
      contentIdMap[data.contentId] = {
        ...contentIdMap[data.contentId],
        tr: slug
      };
    }
  });

  // Include all entries, even if they only have an English version
  Object.entries(contentIdMap).forEach(([contentId, urls]) => {
    urlMap[contentId] = urls.tr ? { tr: urls.tr } : {};
  });

  // Write the mapping to a file
  fs.writeFileSync(outputPath, JSON.stringify(urlMap, null, 2));
  console.log('URL mapping generated successfully!');
  console.log('Mapping saved to:', outputPath);
}

generateUrls(); 
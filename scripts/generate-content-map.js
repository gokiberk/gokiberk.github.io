const fs = require('fs');
const path = require('path');

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

// Generate content mapping
function generateContentMap() {
  const enFiles = fs.readdirSync(dataDirectory).filter(file => file.endsWith('.json'));
  const trFiles = fs.existsSync(trDataDirectory) ? fs.readdirSync(trDataDirectory) : [];

  const contentMap = {
    enToTr: {},
    trToEn: {}
  };

  // First, create a map of contentId to Turkish files
  const trContentMap = {};
  trFiles.forEach(fileName => {
    const fullPath = path.join(trDataDirectory, fileName);
    const data = readJsonFile(fullPath);
    if (data?.contentId) {
      trContentMap[data.contentId] = fileName.replace('.json', '');
    }
  });

  // Then map English files to Turkish files
  enFiles.forEach(fileName => {
    const fullPath = path.join(dataDirectory, fileName);
    const data = readJsonFile(fullPath);
    if (data?.contentId && trContentMap[data.contentId]) {
      const enSlug = fileName.replace('.json', '');
      const trSlug = trContentMap[data.contentId];
      contentMap.enToTr[enSlug] = trSlug;
      contentMap.trToEn[trSlug] = enSlug;
    }
  });

  // Write the mapping to a file
  const outputPath = path.join(process.cwd(), 'src', 'data', 'content-map.json');
  fs.writeFileSync(outputPath, JSON.stringify(contentMap, null, 2));
  console.log('Content mapping generated successfully!');
  console.log('Mapping saved to:', outputPath);
}

generateContentMap(); 
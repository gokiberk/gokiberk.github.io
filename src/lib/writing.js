import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'src', 'data', 'writing');

export function getAllWritingEntriesMetadata() {
  const fileNames = fs.readdirSync(dataDirectory);

  const allEntriesMetadata = fileNames.map(fileName => {
    // Remove ".json" from file name to get slug
    const slug = fileName.replace(/\.json$/, '');

    // Read full json file
    const fullPath = path.join(dataDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const jsonData = JSON.parse(fileContents);

    // Return metadata needed for the list
    return {
      slug,
      title: jsonData.title,
      date: jsonData.date,
    };
  });

  // Sort entries by date if needed (optional)
  // allEntriesMetadata.sort((a, b) => new Date(b.date) - new Date(a.date));

  return allEntriesMetadata;
}

export function getWritingEntryBySlug(slug) {
  const fullPath = path.join(dataDirectory, `${slug}.json`);
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const jsonData = JSON.parse(fileContents);
    return jsonData;
  } catch (error) {
    console.error(`Error reading file for slug ${slug}:`, error);
    return null;
  }
} 
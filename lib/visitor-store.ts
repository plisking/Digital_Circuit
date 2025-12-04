import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'visitor-data.json');

export async function getVisitorCount(): Promise<number> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const json = JSON.parse(data);
    return typeof json.count === 'number' ? json.count : 0;
  } catch (error) {
    // If file doesn't exist or error, return 0
    return 0;
  }
}

export async function incrementVisitorCount(): Promise<number> {
  let count = await getVisitorCount();
  count++;
  await fs.writeFile(DATA_FILE, JSON.stringify({ count }), 'utf-8');
  return count;
}

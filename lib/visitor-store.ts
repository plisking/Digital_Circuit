// NOTE: Cloudflare Pages (Edge Runtime) does not support the 'fs' module.
// We are switching to an in-memory store for demonstration purposes.
// For persistent storage on Cloudflare, you would use Cloudflare KV or D1.

let memoryCount = 1024; // Initial mock value

export async function getVisitorCount(): Promise<number> {
  // In a real Edge app, fetch from KV here
  return memoryCount;
}

export async function incrementVisitorCount(): Promise<number> {
  memoryCount++;
  return memoryCount;
}

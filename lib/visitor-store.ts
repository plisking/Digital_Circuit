// Cloudflare D1 Type Definitions (Minimal)
export interface D1Database {
  prepare: (query: string) => D1PreparedStatement;
  dump: () => Promise<ArrayBuffer>;
  batch: <T = unknown>(statements: D1PreparedStatement[]) => Promise<D1Result<T>[]>;
  exec: (query: string) => Promise<D1Result<unknown>>;
}

export interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta: any;
  error?: string;
}

export interface D1PreparedStatement {
  bind: (...values: any[]) => D1PreparedStatement;
  first: <T = unknown>(colName?: string) => Promise<T | null>;
  run: <T = unknown>() => Promise<D1Result<T>>;
  all: <T = unknown>() => Promise<D1Result<T>>;
  raw: <T = unknown>() => Promise<T[]>;
}

export async function getVisitorCount(db: D1Database): Promise<number> {
  try {
    // Attempt to read the count for ID 1
    const result = await db.prepare("SELECT count FROM visitor_counts WHERE id = 1").first<number>("count");
    
    // If result is null, it means the row doesn't exist or table is empty
    return result ?? 0;
  } catch (error) {
    console.error("Failed to get visitor count from D1:", error);
    // In case of table not existing or other DB error, return 0 strictly
    return 0;
  }
}

export async function incrementVisitorCount(db: D1Database): Promise<number> {
  try {
    // Atomic increment using RETURNING clause (Supported in SQLite 3.35+ which D1 is based on)
    const result = await db.prepare(
      "UPDATE visitor_counts SET count = count + 1 WHERE id = 1 RETURNING count"
    ).first<number>("count");

    if (result !== null) {
      return result;
    }

    // If result is null, the row probably doesn't exist. Insert it starting at 1.
    // This handles the "first ever visit" scenario if migration inserted 0 but somehow it was deleted,
    // or if we just want to lazy-init.
    await db.prepare("INSERT INTO visitor_counts (id, count) VALUES (1, 1)").run();
    return 1;

  } catch (error) {
    console.error("Failed to increment visitor count in D1:", error);
    throw error;
  }
}

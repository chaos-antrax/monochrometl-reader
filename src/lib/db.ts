import { Db, MongoClient } from "mongodb";
const databaseName = process.env.MONGODB_DB ?? "monochrome_translations";
declare global {
  var monochromeMongoClientPromise: Promise<MongoClient> | undefined;
  var monochromeIndexesPromise: Promise<void> | undefined;
}
function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured.");
  return new MongoClient(uri).connect();
}
export function getMongoClient() {
  if (process.env.NODE_ENV === "development") {
    global.monochromeMongoClientPromise ??= connect();
    return global.monochromeMongoClientPromise;
  }
  return connect();
}
export async function getDatabase(): Promise<Db> {
  const database = (await getMongoClient()).db(databaseName);
  global.monochromeIndexesPromise ??= ensureIndexes(database);
  await global.monochromeIndexesPromise;
  return database;
}
async function ensureIndexes(database: Db) {
  await Promise.all([
    database.collection('readerLibrary').createIndex({ userId: 1, novelId: 1 }, { unique: true, name: 'reader_library_user_novel' }),
    database.collection('readerLibrary').createIndex({ userId: 1, updatedAt: -1 }, { name: 'reader_library_recent' }),
    database.collection('readerProgress').createIndex({ userId: 1, novelId: 1 }, { unique: true, name: 'reader_progress_user_novel' }),
    database.collection('readerProgress').createIndex({ userId: 1, updatedAt: -1 }, { name: 'reader_progress_recent' }),
    database.collection('readerSettings').createIndex({ userId: 1 }, { unique: true, name: 'reader_settings_user' }),
    database.collection('users').createIndex({ email: 1 }, { unique: true }),
    database.collection('authRateLimits').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: 'auth_rate_limits_ttl' }),
  ]);
}

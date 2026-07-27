import { Db, MongoClient } from "mongodb";
const databaseName = process.env.MONGODB_DB ?? "monochrome_translations";
declare global {
  var monochromeMongoClientPromise: Promise<MongoClient> | undefined;
  var monochromeIndexesPromise: Promise<void> | undefined;
}
function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured.");
  return new MongoClient(uri, {
    maxPoolSize: 5,
    minPoolSize: 0,
    maxIdleTimeMS: 30_000,
  }).connect();
}
export function getMongoClient() {
  if (!globalThis.monochromeMongoClientPromise) {
    globalThis.monochromeMongoClientPromise = connect().catch((error) => {
      globalThis.monochromeMongoClientPromise = undefined;
      throw error;
    });
  }
  return globalThis.monochromeMongoClientPromise;
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
    database.collection('users').createIndex({ usernameNormalized: 1 }, { unique: true, partialFilterExpression: { usernameNormalized: { $type: 'string' } }, name: 'users_username_unique' }),
    database.collection('readerReviews').createIndex({ novelId: 1, createdAt: -1 }, { name: 'reader_reviews_latest' }),
    database.collection('readerReviews').createIndex({ parentId: 1, createdAt: 1 }, { name: 'reader_review_replies' }),
    database.collection('readerReviews').createIndex({ userId: 1, novelId: 1 }, { unique: true, partialFilterExpression: { topLevel: true }, name: 'reader_review_user_novel' }),
    database.collection('readerComments').createIndex({ chapterId: 1, createdAt: -1 }, { name: 'reader_comments_latest' }),
    database.collection('readerComments').createIndex({ parentId: 1, createdAt: 1 }, { name: 'reader_comment_replies' }),
    database.collection('readerContributionRequests').createIndex({ id: 1 }, { unique: true, name: 'reader_contribution_request_id' }),
    database.collection('readerContributionRequests').createIndex({ userId: 1, createdAt: -1 }, { name: 'reader_contribution_requests_user' }),
    database.collection('readerContributionRequests').createIndex({ status: 1, createdAt: 1 }, { name: 'reader_contribution_requests_admin_inbox' }),
    database.collection('readerContributionMessages').createIndex({ requestId: 1, createdAt: 1, id: 1 }, { name: 'reader_contribution_messages_thread_cursor' }),
  ]);
}

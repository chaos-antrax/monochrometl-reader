import { Db, MongoClient } from "mongodb";
const databaseName = process.env.MONGODB_DB ?? "monochrome_translations";
declare global {
  var monochromeMongoClientPromise: Promise<MongoClient> | undefined;
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
  return (await getMongoClient()).db(databaseName);
}

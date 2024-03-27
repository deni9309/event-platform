import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// initialize a 'cached' variable
// attempt to retrieve a mongoose property from the global object (in nodejs this 'global object' provides a space to store global variables)
// the 'cached' variable is intent to hold a cached connection to our DB
let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  // check if 'cached' is already connected
  // this would be the case where the connection runs for the first time
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing');

  // finally, either connect to an already existing 'cached' connection, or we create a new connection
  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
    dbName: 'evently',
    bufferCommands: false,
  });

  cached.conn = await cached.promise;

  return cached.conn;
};

// in serverless functions or environments where our code could be executed multiple times
// but not in a single continuous server process, we need to manage DB connections efficiently,
// because each invocation of a serverless function colud result in a new connection to the DB,
// which is inefficient and can exhaust database resources;
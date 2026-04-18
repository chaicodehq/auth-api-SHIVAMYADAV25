import mongoose from 'mongoose';

/**
 * TODO: Connect to MongoDB
 *
 * 1. Check if uri is provided (throw error if not: "MongoDB URI is required")
 * 2. Connect using mongoose.connect(uri)
 * 3. Return mongoose.connection
 */
export async function connectDB(uri) {
  if(uri == "" || uri == undefined){
    throw new Error("MongoDB URI is required");
  }

  let mongo
  try {
    mongo = await mongoose.connect(uri);
    console.log("mongoDB connected")
  } catch (error) {
    throw new Error("mongoDB connection error" , error);
    process.exit(1);
  }
  return mongo.connection
}

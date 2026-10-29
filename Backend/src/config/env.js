import dotenv from "dotenv";

dotenv.config();

const required = ["MONGODB_URI", "JWT_SECRET"];
for (const name of required) {
  if (!process.env[name]) throw new Error(`${name} must be set in backend/.env`);
}

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI,
  // Keep ProposalIQ isolated from the driver's default `test` database.
  mongoDbName: process.env.MONGODB_DB_NAME || "proposaliq",
  jwtSecret: process.env.JWT_SECRET,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  maxFileSizeBytes: Number(process.env.MAX_FILE_SIZE_MB || 10) * 1024 * 1024
};

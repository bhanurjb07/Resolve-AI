import path from 'path';
import {fileURLToPath} from 'url';
import dotenv from 'dotenv';

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rootDir = path.resolve(backendDir, '..');

dotenv.config({ path: path.join(backendDir, '.env'),quiet: true});

const num=(value, fallback)=>(value===undefined || value=== '' ? fallback : Number(value));

export const config={
  port: num(process.env.PORT, 4000),

  datasetPath: process.env.DATASET_PATH || path.join(rootDir, 'data', 'twcs', 'twcs.csv'),
  samplePath: path.join(rootDir, 'data', 'sample.csv'),
  processedDir: path.join(rootDir, 'data', 'processed'),


  databaseUrl: process.env.DATABASE_URL,

  //Gemini api
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  chatModel: process.env.GEMINI_CHAT_MODEL || 'gemini-3.6-flash',
  judgeModel: process.env.GEMINI_JUDGE_MODEL || process.env.GEMINI_CHAT_MODEL || 'gemini-3.6-flash',
  embeddingModel: process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001',


};
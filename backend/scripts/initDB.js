import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import { pool} from '../src/db/pool.js';
import logger from '../src/utils/loggers.js';

const schemaPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'db','schema.sql');

async function main(){
  if(process.argv.includes('--reset')){
    await pool.query('DROP TABLE IF EXISTS support_cases, agent_runs');
    logger.info('Dropped existing tables');
  }

  await pool.query(fs.readFileSync(schemaPath, 'utf8'));

  logger.success(
    'Database ready: extension "vector", tables support_cases + agent_runs'
  );

  await pool.end();
}

main().catch(async (err) =>{
  logger.error('Database init failed:', err.message);
  logger.warn('Is PostgreSQL running? Try: docker compose up -d');

  await pool.end();
  process.exit(1);
});
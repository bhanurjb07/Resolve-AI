import pg from 'pg';
import {config} from '../config';

export const pool =new pg.Pool({connectionString: config.databaseUrl, max: 5});

//pgvector take vectors as a string like
export function toVectorLiteral(values){
  return `[${values.join(',')}]`;
}
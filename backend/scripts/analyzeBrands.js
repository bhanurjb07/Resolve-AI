import fs from 'fs';
import path from 'path';
import { config } from '../src/config.js';
import { readCsvRows } from '../src/utils/csv.js';
import { isDmDeflection } from '../src/utils/text.js';
import logger from '../src/utils/loggers.js';

/* look at the real dataset and decide which brand to build the agent foor.

For every brand we count
    how many replies it sent
  - ow many *opening* customer tweets it answered (a new issue, not a follow-up)
  - how often its reply just says DM us
*/

const csvPath = process.argv[2] || config.datasetPath;

async function main(){
  logger.info(`Reading ${csvPath} ...`);

  const brands = new Map();       //brand -> stats
  const openingTweetIds = new Set();        //customer tweets that start a conversation
  const brandRepliesTo = [];        // [brand, inReplyToId, text]

  let rows=0;

  for await(const row of readCsvRows(csvPath)){
    rows++;

    if(row.inbound ==='True'){
      if(!row.in_response_to_tweet_id){
        openingTweetIds.add(row.tweet_id);
      }
    }else{
      const stats =brands.get(row.author_id) ||{
        replies: 0,
        dmReplies: 0,
        totalLength: 0,
        openingAnswered: 0,
      };

      stats.replies++;
      stats.totalLength += row.text.length;

      if (isDmDeflection(row.text)) {
        stats.dmReplies++;
      }

      brands.set(row.author_id, stats);

      if(row.in_response_to_tweet_id){
        brandRepliesTo.push([
          row.author_id,
          row.in_response_to_tweet_id,
        ]);
      }
    }

    if (rows % 500000 === 0){
      logger.info(`${rows.toLocaleString()} rows processed...`);
    }
  }

  for(const [brand, inReplyTo] of brandRepliesTo){
    if(openingTweetIds.has(inReplyTo)){
      brands.get(brand).openingAnswered++;
    }
  }

  const table = [...brands.entries()]
    .map(([brand, s])=>({
      brand,
      replies: s.replies,
      openingAnswered: s.openingAnswered,
      dmReplyPct: +((s.dmReplies / s.replies) * 100).toFixed(1),
      avgReplyChars: Math.round(s.totalLength / s.replies),
    }))
    .sort((a, b) => b.openingAnswered - a.openingAnswered)
    .slice(0, 20);

  logger.info(`Total rows: ${rows.toLocaleString()}`);
  logger.info('Top 20 brands by number of answered opening customer tweets:');

  console.table(table);

  const outFile = path.join(
    config.processedDir,
    'brand_analysis.json',
  );

  fs.mkdirSync(config.processedDir, { recursive: true });

  fs.writeFileSync(
    outFile,
    JSON.stringify(
      {
        totalRows: rows,
        brands: table,
      },
      null,
      2,
    ),
  );

  logger.success(`Saved brand analysis to ${outFile}`);
}

main().catch((err) => {
  logger.error('Brand analysis failed', {
    message: err.message,
    stack: err.stack,
  });

  process.exit(1);
});


import fs from 'fas';
import { parse } from 'csv-parse';

//stream a CSV file row by row as objects
//tttolerant of broken lines: sample.csv,like ends with a truncated record.
export function readCsvRows(file) {
  return fs.createReadStream(file).pipe(
    parse({
      columns: true,
      relax_quotes: true,
      relax_column_count: true,
      skip_empty_lines: true,
    }),
  );
}
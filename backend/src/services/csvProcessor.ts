import { createReadStream, createWriteStream } from 'fs';
import { parse } from 'csv-parse';
import { Transform, pipeline } from 'stream';
import { AggregatedSales, SalesRecord } from '../types';

export class CSVProcessor {
  async processCSV(inputPath: string, outputPath: string): Promise<AggregatedSales> {
    const aggregatedSales: AggregatedSales = {};

    return new Promise((resolve, reject) => {
      const readStream = createReadStream(inputPath);
      const parser = parse({ columns: true });
      const transformer = new Transform({
        objectMode: true,
        transform: (record: SalesRecord, _, callback) => {
          try {
            const department = record['Department Name'];
            const sales = parseInt(String(record['Number of Sales']));
            
            if (!isNaN(sales)) {
              aggregatedSales[department] = (aggregatedSales[department] || 0) + sales;
            }
            callback();
          } catch (error) {
            callback(error instanceof Error ? error : new Error(String(error)));
          }
        }
      });

      pipeline(
        readStream,
        parser,
        transformer,
        (err) => {
          if (err) {
            console.error('Pipeline error:', err);
            return reject(err);
          }
          const writeStream = createWriteStream(outputPath);
          
          writeStream.on('error', (writeErr) => {
            console.error('Write stream error:', writeErr);
            reject(writeErr);
          });
          
          writeStream.on('finish', () => {
            resolve(aggregatedSales);
          });

          writeStream.write('Department Name,Total Number of Sales\n');
          for (const [department, total] of Object.entries(aggregatedSales)) {
            writeStream.write(`${department},${total}\n`);
          }
          writeStream.end();
        }
      );

      readStream.on('error', (err) => console.error('Read stream error:', err));
      parser.on('error', (err) => console.error('Parser error:', err));
      transformer.on('error', (err) => console.error('Transformer error:', err));
      readStream.on('end', () => console.log('Read stream ended'));
      parser.on('end', () => console.log('Parser ended'));
      transformer.on('end', () => console.log('Transformer ended'));
    });
  }
}
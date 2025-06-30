import { CSVProcessor } from '../src/services/csvProcessor';
import { createReadStream, createWriteStream, unlinkSync, promises as fsPromises } from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import { finished } from 'stream/promises';

describe('CSVProcessor', () => {
  const processor = new CSVProcessor();
  const testInputPath = join(__dirname, 'test_input.csv');
  const testOutputPath = join(__dirname, 'test_output.csv');

  beforeEach(async () => {
    const writeStream = createWriteStream(testInputPath);
    writeStream.write('Department Name,Date,Number of Sales\n');
    writeStream.write('Electronics,2023-08-01,100\n');
    writeStream.write('Clothing,2023-08-01,200\n');
    writeStream.write('Electronics,2023-08-02,150\n');
    writeStream.end();
    await finished(writeStream);
  });

  afterEach(async () => {
    try {
      await fsPromises.unlink(testInputPath);
      await fsPromises.unlink(testOutputPath);
    } catch (error) {
    }
  });

  it('should correctly aggregate sales by department', async () => {
    const result = await processor.processCSV(testInputPath, testOutputPath);
    
    console.log('Test aggregated sales:', result); 
    expect(result).to.deep.equal({
      Electronics: 250,
      Clothing: 200,
    });

    const outputContent = await fsPromises.readFile(testOutputPath, 'utf-8');
    const outputLines = outputContent
      .trim()
      .split('\n')
      .slice(1); // Skip header

    console.log('Test output content:', outputLines); // Debug: Log output content

    expect(outputLines).to.include.members([
      'Electronics,250',
      'Clothing,200'
    ]);
  });
});
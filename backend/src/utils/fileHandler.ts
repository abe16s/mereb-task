// src/utils/fileHandler.ts
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export class FileHandler {
  private uploadsDir = join(__dirname, '../../Uploads');
  private resultsDir = join(__dirname, '../../Results');

  constructor() {
    if (!existsSync(this.uploadsDir)) {
      mkdirSync(this.uploadsDir, { recursive: true });
    }
    if (!existsSync(this.resultsDir)) {
      mkdirSync(this.resultsDir, { recursive: true });
    }
  }

  generateFilePaths(): { inputPath: string; outputPath: string; fileId: string } {
    const fileId = uuidv4();
    return {
      inputPath: join(this.uploadsDir, `${fileId}.csv`),
      outputPath: join(this.resultsDir, `${fileId}_result.csv`),
      fileId,
    };
  }

  getDownloadUrl(fileId: string): string {
    return `/results/${fileId}_result.csv`;
  }
}
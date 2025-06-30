// src/controllers/uploadController.ts
import { Request, Response } from 'express';
import { createWriteStream } from 'fs';
import { CSVProcessor } from '../services/csvProcessor';
import { FileHandler } from '../utils/fileHandler';
import { UploadResponse } from '../types';

export class UploadController {
  private csvProcessor = new CSVProcessor();
  private fileHandler = new FileHandler();

  async handleUpload(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }

      const { inputPath, outputPath, fileId } = this.fileHandler.generateFilePaths();

      const fileBuffer = req.file.buffer;

      await new Promise<void>((resolve, reject) => {
        const writeStream = createWriteStream(inputPath);
        writeStream.write(fileBuffer);
        writeStream.end();
        writeStream.on('finish', () => resolve());
        writeStream.on('error', () => reject());
      });

      await this.csvProcessor.processCSV(inputPath, outputPath);
      const downloadUrl = this.fileHandler.getDownloadUrl(fileId);

      const response: UploadResponse = {
        success: true,
        downloadUrl,
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Error processing file' 
      });
    }
  }
}
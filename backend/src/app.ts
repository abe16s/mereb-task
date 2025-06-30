import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { UploadController } from './controllers/uploadController';
import { join } from 'path';

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
const upload = multer({ storage: multer.memoryStorage() });
const uploadController = new UploadController();

app.use('/results', express.static(join(__dirname, '../Results')));
app.post('/upload', upload.single('file'), (req, res) =>
  uploadController.handleUpload(req, res)
);

export default app;
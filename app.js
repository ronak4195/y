import dotenv from 'dotenv';
dotenv.config(); 
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import productRoutes from './routes/product.routes.js';
import db from './config/db.config.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const app = express();
const port = process.env.PORT || 4000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());

app.use(express.json());

app.use('/', productRoutes);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'images', 
    format: async (req, file) => 'png', 
    public_id: (req, file) => `product_${Date.now()}`, 
  },
});

const parser = multer({ storage: storage });

app.post('/upload', parser.single('product'), (req, res) => {
  if (req.file && req.file.path) {
    res.json({
      success: 1,
      image_url: req.file.path, 
    });
  } else {
    res.status(500).json({
      success: 0,
      message: 'File upload failed',
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

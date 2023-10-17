import { Storage } from '@google-cloud/storage';
import multer from 'multer';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const storage = new Storage({
  keyFilename: process.env.google_storage,
  projectId: 'bigdataanalytics-390212',
});

const bucket = storage.bucket('bigdatacourzwe');

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit to 10MB
  },
});

export default async function handler(req, res) {
  multerUpload.single('image')(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({ error: 'Upload failed.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }


    const desiredPath = 'mypantry/images/';
    const blobName = desiredPath + 'recipe_' + req.file.originalname;

    const blob = bucket.file(blobName);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {
      console.error("Blob stream error:", err);
      return res.status(500).json({ error: 'Something is wrong! Unable to upload at the moment.' });
    });

    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      //console.log("Generated Public URL:", publicUrl);
      return res.status(200).json({ recipeuploadURL: publicUrl });
    });


    blobStream.end(req.file.buffer);
  });
}
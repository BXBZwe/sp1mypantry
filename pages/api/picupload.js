import { Storage } from '@google-cloud/storage';
const Busboy = require('busboy');

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

export default async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const busboy = new Busboy({ headers: req.headers });

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      const blob = bucket.file(`mypantry/images/${Date.now()}-${filename}`);
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: mimetype
        },
      });

      file.pipe(blobStream);

      blobStream.on('error', (err) => {
        console.error(err);
        res.status(500).send({ error: 'Failed to upload to Google Cloud Storage', details: err.message });
      });

      blobStream.on('finish', async () => {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        res.status(200).json({ url: publicUrl });
      });
    });

    req.pipe(busboy);

  } catch (error) {
    console.error("Unhandled error:", error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
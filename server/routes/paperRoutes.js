const express=require('express')
const router=express.Router();
const multer=require('multer')
const fs=require('fs')
const Paper=require('../models/paper')
const s3=require('../awsConfig')

const upload=multer({dest:'uploads/'})

router.post('/', upload.single('pdf'), async (req, res) => {
    const { title, scheduledFor } = req.body;
    const fileContent = fs.readFileSync(req.file.path);
    const s3Key = `${title}-${Date.now()}`;

    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: s3Key,
        Body: fileContent,
        ContentType: 'application/pdf'
    };

    try {
        const data = await s3.upload(params).promise();
        const newPaper = new Paper({
            title,
            versions: [{ versionId: data.VersionId, s3Key: data.Key }],
            scheduledFor
        });

        await newPaper.save();
        res.status(201).json(newPaper);
    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).send(err.message);
    }
});

router.put('/:id', upload.single('pdf'), async (req, res) => {
    const { id } = req.params;
    const { title, scheduledFor } = req.body;
    const fileContent = fs.readFileSync(req.file.path);

    try {
        const paper = await Paper.findById(id);
        if (!paper) return res.status(404).send('Paper not found');

        let s3Key = paper.s3Key;
        if (!s3Key) {
            s3Key = `${title}-${Date.now()}`;
            paper.s3Key = s3Key; 
        }

        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: s3Key,
            Body: fileContent,
            ContentType: 'application/pdf'
        };

        const data = await s3.putObject(params).promise(); 

      
        const newVersion = { versionId: data.VersionId, s3Key };

        paper.versions.push(newVersion);
        paper.title = title;
        paper.updatedAt = Date.now();
        paper.scheduledFor = scheduledFor;

        await paper.save(); 

        res.status(200).json(paper);
    } catch (err) {
        console.error('Error updating file:', err);
        res.status(500).send(err.message);
    } finally {
     
        fs.unlinkSync(req.file.path);
    }
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const paper = await Paper.findById(id);
        if (!paper) return res.status(404).send('Paper not found');

        const { title, scheduledFor } = paper;
        res.json({ title, scheduledFor });
    } catch (err) {
        console.error('Error fetching file version:', err);
        res.status(500).send(err.message);
    }
});

router.get('/:id/version/:versionId', async (req, res) => {
    const { id, versionId } = req.params;
    try {
        const paper = await Paper.findById(id);
        if (!paper) return res.status(404).send('Paper not found');

        const version = paper.versions.find(v => v.versionId === versionId);
        if (!version) return res.status(404).send('Version not found');

        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: version.s3Key
        };

        // Generate a signed URL for downloading the file
        s3.getSignedUrl('getObject', params, (err, signedUrl) => {
            if (err) {
                console.error('Error generating signed URL:', err);
                return res.status(500).send('Failed to generate signed URL');
            }
            res.status(200).json({ version, signedUrl });
        });
    } catch (err) {
        console.error('Error fetching file version:', err);
        res.status(500).send(err.message);
    }
});

module.exports = router;
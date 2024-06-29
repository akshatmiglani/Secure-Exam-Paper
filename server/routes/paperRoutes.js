const express = require("express");
const router = express.Router();

const multer = require('multer')
const fs = require('fs')
const Paper = require('../models/paper')
const s3 = require('../awsConfig')

const upload = multer({ dest: 'uploads/' })
//get scheudled papers in the next 30 mins
router.get('/scheduled/', async (req, res) => {
    const currentTime = new Date();
    const next30Minutes = new Date(currentTime.getTime() + 30 * 60000);

    try {
        // Find papers scheduled within the next 30 minutes
        const papers = await Paper.find({ scheduledFor: { $gte: currentTime, $lt: next30Minutes } });

        if (papers.length === 0) {
            return res.status(404).json({ error: 'No papers scheduled for the next 30 minutes' });
        }

        // Loop through the found papers to get their latest versions
        const papersWithLatestVersion = await Promise.all(papers.map(async (paper) => {
            // Sort versions by createdAt in descending order to get the latest version
            paper.versions.sort((a, b) => b.createdAt - a.createdAt);

            // Get the latest version
            const latestVersion = paper.versions[0];

            if (!latestVersion) {
                return null; // No versions found for this paper
            }

            // Generate a signed URL for downloading the latest version from S3
            const downloadUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${latestVersion.s3Key}`;

            // Prepare response object
            return {
                _id: paper._id,
                title: paper.title,
                scheduledFor: paper.scheduledFor,
                downloadUrl,
            };
        }));

        // Filter out null values (in case some papers didn't have versions)
        const response = papersWithLatestVersion.filter(paper => paper !== null);

        res.json(response);
    } catch (err) {
        console.error('Error fetching papers scheduled for the next 30 minutes:', err);
        res.status(500).json({ error: 'Failed to fetch scheduled papers' });
    }
});

// all versions of a specific paper
router.get('/:id/versions', async (req, res) => {
    const paperId = req.params.id;

    try {
        // Find the paper by ID
        const paper = await Paper.findById(paperId);

        if (!paper) {
            return res.status(404).json({ error: 'Paper not found' });
        }

        // Array to store formatted response
        const versionsInfo = [];

        // Iterate through all versions of the paper
        for (const version of paper.versions) {
            try {
                // Generate downloadable link with expiry (adjust expiry time as needed)
                const downloadUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${version.s3Key}`;

                const versionInfo = {
                    versionId: version.versionId,
                    createdAt: version.createdAt,
                    downloadUrl,
                };

                // Push version info to response array
                versionsInfo.push(versionInfo);
            } catch (err) {
                console.error('Error generating downloadable URL:', err);
                // Handle error, e.g., assign a placeholder value for downloadUrl
                const versionInfo = {
                    versionId: version.versionId,
                    createdAt: version.createdAt,
                    downloadUrl: null, // Placeholder value or handle error case
                };
                versionsInfo.push(versionInfo);
            }
        }

        // Return JSON response with all versions of the paper
        res.json({
            _id: paper._id,
            title: paper.title,
            versions: versionsInfo
        });
    } catch (err) {
        console.error('Error fetching paper versions:', err);
        res.status(500).json({ error: 'Failed to fetch paper versions' });
    }
});



router.put("/:id", verifyToken, upload.single("pdf"), async (req, res) => {
  const { id } = req.params;
  const { title, scheduledFor } = req.body;
  const fileContent = fs.readFileSync(req.file.path);


  try {
    const paper = await Paper.findById(id);
    if (!paper) return res.status(404).send("Paper not found");

    let s3Key = paper.s3Key;
    if (!s3Key) {
      s3Key = `${title}-${Date.now()}`;
      paper.s3Key = s3Key;
    }

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
      Body: fileContent,
      ContentType: "application/pdf",
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
    console.error("Error updating file:", err);
    res.status(500).send(err.message);
  } finally {
    fs.unlinkSync(req.file.path);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const paper = await Paper.findById(id).populate("uploadedBy", "username");
    if (!paper) return res.status(404).send("Paper not found");

    const { title, scheduledFor, uploadedBy } = paper;
    res.json({ title, scheduledFor, uploadedBy });
  } catch (err) {
    console.error("Error fetching file version:", err);
    res.status(500).send(err.message);
  }
});


// for prefilling the content at update
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
//not used
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


// Route to fetch all papers and generate download URLs
router.get('/', async (req, res) => {
    try {
        // Fetch all papers from the database
        const papers = await Paper.find({});

        // Array to store formatted response
        const allVersionsPapers = [];

        // Iterate through each paper to include all versions
        for (const paper of papers) {
            const { _id, title, versions } = paper;

            // Iterate through all versions of the paper
            for (const version of versions) {
                try {
                    // Generate downloadable link with expiry (adjust expiry time as needed)
                    const downloadUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${version.s3Key}`

                    const paperInfo = {
                        _id,
                        title,
                        scheduledFor: version.scheduledFor,
                        downloadUrl,
                    };

                    // Push version info to response array
                    allVersionsPapers.push(paperInfo);
                } catch (err) {
                    console.error('Error generating downloadable URL:', err);
                    // Handle error, e.g., assign a placeholder value for downloadUrl
                    const paperInfo = {
                        _id,
                        title,
                        scheduledFor: version.scheduledFor,
                        downloadUrl: null, // Placeholder value or handle error case
                    };
                    allVersionsPapers.push(paperInfo);router.get('/', async (req, res) => {
  try {
    // Fetch all papers from the database
    const papers = await Paper.find({});

    // Array to store formatted response
    const allVersionsPapers = [];

    // Iterate through each paper to include all versions
    for (const paper of papers) {
      const { _id, title, versions } = paper;

      // Iterate through all versions of the paper
      for (const version of versions) {
        try {
          // Generate downloadable link with expiry (adjust expiry time as needed)
          const downloadUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${version.s3Key}`;

          const paperInfo = {
            _id,
            title,
            scheduledFor: version.scheduledFor,
            downloadUrl,
          };

          // Push version info to response array
          allVersionsPapers.push(paperInfo);
        } catch (err) {
          console.error("Error generating downloadable URL:", err);
          // Handle error, e.g., assign a placeholder value for downloadUrl
          const paperInfo = {
            _id,
            title,
            scheduledFor: version.scheduledFor,
            downloadUrl: null, // Placeholder value or handle error case
          };
          allVersionsPapers.push(paperInfo);
        }
      }
    }


router.get("/:id/latest", async (req, res) => {
  const paperId = req.params.id;


  try {
    // Find the paper by _id
    const paper = await Paper.findById(paperId);

    if (!paper) {
      return res.status(404).json({ error: "Paper not found" });
    }

    // Sort versions by createdAt in descending order to get the latest version
    paper.versions.sort((a, b) => b.createdAt - a.createdAt);

    // Get the latest version
    const latestVersion = paper.versions[0];

    if (!latestVersion) {
      return res
        .status(404)
        .json({ error: "No versions found for this paper" });
    }

    // Generate downloadable link with expiry (adjust expiry time as needed)
    const downloadUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${latestVersion.s3Key}`;

    // Prepare response object
    const paperInfo = {
      _id: paper._id,
      title: paper.title,
      scheduledFor: latestVersion.scheduledFor,
      downloadUrl,
    };

    // Return JSON response with the latest version paper info
    res.json(paperInfo);
  } catch (err) {
    console.error("Error fetching latest version:", err);
    res.status(500).json({ error: "Failed to fetch latest version" });
  }
});

module.exports = router;

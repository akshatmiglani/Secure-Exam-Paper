const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const Paper = require("../models/Paper");
const s3 = require("../awsConfig");
const verifyToken = require("../middleware/auth");
const { default: mongoose } = require("mongoose");


const upload = multer({ dest: "uploads/" });
// for invigilator
router.get('/scheduled/', async (req, res) => {
    const currentTime = new Date();
    const next30Minutes = new Date(currentTime.getTime() + 30 * 60000);
    const past1Hour = new Date(currentTime.getTime() - 60 * 60000);

    try {
        // Find papers scheduled within the past 1 hour and the next 30 minutes
        const papers = await Paper.find({ 
            scheduledFor: { $gte: past1Hour, $lt: next30Minutes } 
        });

        if (papers.length === 0) {
            return res.status(404).json({ error: 'No papers scheduled for the past 1 hour or the next 30 minutes' });
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
        console.error('Error fetching papers scheduled for the past 1 hour or the next 30 minutes:', err);
        res.status(500).json({ error: 'Failed to fetch scheduled papers' });
    }
});
// GET papers uploaded by the authenticated user
router.get('/user', verifyToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Use req.user.id directly as ObjectId
    const papers = await Paper.find({ uploadedBy: req.user.id });


    if (papers.length === 0) {
      return res.status(404).json({ message: `No papers uploaded by ${req.user.username}` });
    }

    res.json(papers);
  } catch (error) {
    console.error('Error fetching papers:', error); // Log the specific error
    res.status(500).json({ error: 'Failed to fetch papers' });
  }
});


// create new paper

router.post("/", verifyToken, upload.single("pdf"), async (req, res) => {
  const { title, scheduledFor } = req.body;
  const fileContent = fs.readFileSync(req.file.path);
  const s3Key = `${title}-${Date.now()}`;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: s3Key,
    Body: fileContent,
    ContentType: "application/pdf",
  };

  try {
    const data = await s3.upload(params).promise();
    const newPaper = new Paper({
      title,
      versions: [{ versionId: data.VersionId, s3Key: data.Key }],
      scheduledFor,
      uploadedBy: req.user.id, // Set the createdBy field to the authenticated user's ID
    });

    await newPaper.save();
    res.status(201).json(newPaper);
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).send(err.message);
  } finally {
    fs.unlinkSync(req.file.path);
  }
});
// adds a new version for paper
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
// Get details of a paper for UPDATE request
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


// Gets all papers without checking who is the current logged in
router.get("/", async (req, res) => {
  try {
    // Fetch all papers from the database
    const papers = await Paper.find({});

    res.json(papers);
  } catch (err) {
    console.error("Error fetching all papers:", err);
    res.status(500).json({ error: "Failed to fetch all papers" });
  }
});


// gets latest paper version
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
      scheduledFor:paper.scheduledFor,
      downloadUrl,
    };

    // Return JSON response with the latest version paper info
    res.json(paperInfo);
  } catch (err) {
    console.error("Error fetching latest version:", err);
    res.status(500).json({ error: "Failed to fetch latest version" });
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
                  downloadUrl: null, 
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



module.exports = router;

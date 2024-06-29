const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const Paper = require("../models/Paper");
const s3 = require("../awsConfig");
const verifyToken = require("../middleware/auth");

const upload = multer({ dest: "uploads/" });

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

router.get("/:id/version/:versionId", async (req, res) => {
  const { id, versionId } = req.params;
  try {
    const paper = await Paper.findById(id);
    if (!paper) return res.status(404).send("Paper not found");

    const version = paper.versions.find((v) => v.versionId === versionId);
    if (!version) return res.status(404).send("Version not found");

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: version.s3Key,
    };

    s3.getSignedUrl("getObject", params, (err, signedUrl) => {
      if (err) {
        console.error("Error generating signed URL:", err);
        return res.status(500).send("Failed to generate signed URL");
      }
      res.status(200).json({ version, signedUrl });
    });
  } catch (err) {
    console.error("Error fetching file version:", err);
    res.status(500).send(err.message);
  }
});

module.exports = router;

// Route to fetch all papers and generate download URLs
router.get("/", async (req, res) => {
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

    // Return JSON response with all versions papers
    res.json(allVersionsPapers);
  } catch (err) {
    console.error("Error fetching all papers:", err);
    res.status(500).json({ error: "Failed to fetch all papers" });
  }
});

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

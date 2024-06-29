const mongoose = require('mongoose');
const User = require('./User');
const { Schema } = mongoose;

const PaperSchema = new Schema({
    title: { type: String, required: true },
    versions: [
        {
            versionId: { type: String, required: true },
            s3Key: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    scheduledFor: { type: Date, required: true },
    uploadedBy: {type: Schema.Types.ObjectId,ref:User}
});

const Paper = mongoose.model('Paper', PaperSchema);
module.exports = Paper;

const mongoose = require('mongoose');

const consentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    appId: {
        type: String,
        required: true, // e.g., 'Fitbit', 'Spotify'
    },
    dataCategories: [{
        type: String,
        required: true // e.g., 'location', 'steps'
    }],
    status: {
        type: String,
        enum: ['active', 'revoked', 'expired'],
        default: 'active'
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const Consent = mongoose.model('Consent', consentSchema);

module.exports = Consent;

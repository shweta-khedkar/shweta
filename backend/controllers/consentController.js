const Consent = require('../models/Consent');
const { logToBlockchain } = require('../utils/blockchainService');
const cryptoUtils = require('../utils/crypto'); // e.g. encrypt detailsHash

// @desc    Get user consents
// @route   GET /api/consents
// @access  Private
const getConsents = async (req, res) => {
    try {
        const consents = await Consent.find({ userId: req.user._id });
        res.json(consents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Grant new consent
// @route   POST /api/consents
// @access  Private
const grantConsent = async (req, res) => {
    const { appId, dataCategories, expiresAt } = req.body;

    try {
        const consent = await Consent.create({
            userId: req.user._id,
            appId,
            dataCategories,
            expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default 30 days
        });

        // Encrypt details for audit trail
        const detailsHash = cryptoUtils.encrypt(JSON.stringify({ appId, dataCategories }));

        // Asynchronously log to blockchain
        logToBlockchain(req.user._id.toString(), 'GRANT_CONSENT', detailsHash);

        res.status(201).json(consent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Revoke consent
// @route   PUT /api/consents/:id/revoke
// @access  Private
const revokeConsent = async (req, res) => {
    try {
        const consent = await Consent.findById(req.params.id);

        if (!consent) {
            return res.status(404).json({ message: 'Consent not found' });
        }

        // Ensure the consent belongs to the user
        if (consent.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to update this consent' });
        }

        consent.status = 'revoked';
        const updatedConsent = await consent.save();

        const detailsHash = cryptoUtils.encrypt(JSON.stringify({ appId: consent.appId, action: 'revoked' }));
        logToBlockchain(req.user._id.toString(), 'REVOKE_CONSENT', detailsHash);

        res.json(updatedConsent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getConsents, grantConsent, revokeConsent };

const express = require('express');
const router = express.Router();
const { getConsents, grantConsent, revokeConsent } = require('../controllers/consentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getConsents)
    .post(protect, grantConsent);

router.route('/:id/revoke')
    .put(protect, revokeConsent);

module.exports = router;

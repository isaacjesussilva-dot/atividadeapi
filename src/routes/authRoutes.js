const express = require('express');
const { login } = require('../controllers/authController');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// POST /login
router.post('/', asyncHandler(login));

module.exports = router;

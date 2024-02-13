const express = require('express');
const router = express.Router();

const item = require('../controllers/item');

router.get('/', item.index);

module.exports = router;

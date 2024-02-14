const express = require('express');
const router = express.Router();

const itemController = require('../controllers/item');
const categoryController = require('../controllers/category');

router.get('/', itemController.index);

router.get('/items', itemController.list);

router.get('/categories', categoryController.list);


router.get('/items', item.list);
module.exports = router;

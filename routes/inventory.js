const express = require('express');
const router = express.Router();

const itemController = require('../controllers/item');
const categoryController = require('../controllers/category');
const brandController = require('../controllers/brand');

router.get('/', itemController.index);

router.get('/items', itemController.list);

router
    .route('/item/create')
    .get(itemController.itemCreateGet)
    .post(itemController.itemCreatePost);

router.get('/item/:id', itemController.itemDetail);

router.get('/categories', categoryController.list);

router
    .route('/category/create')
    .get(categoryController.categoryCreateGet)
    .post(categoryController.categoryCreatePost);

router.get('/category/:id', categoryController.categoryDetail);

router.get('/brands', brandController.list);

router.get('/brand/:id', brandController.brandDetail);

module.exports = router;

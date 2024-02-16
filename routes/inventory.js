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

router
    .route('/item/:id/update')
    .get(itemController.itemUpdateGet)
    .post(itemController.itemUpdatePost);

router
    .route('/item/:id/delete')
    .get(itemController.itemDeleteGet)
    .post(itemController.itemDeletePost);

router.get('/item/:id', itemController.itemDetail);

router.get('/categories', categoryController.list);

router
    .route('/category/create')
    .get(categoryController.categoryCreateGet)
    .post(categoryController.categoryCreatePost);

router
    .route('/category/:id/update')
    .get(categoryController.categoryUpdateGet)
    .post(categoryController.categoryUpdatePost);

router
    .route('/category/:id/delete')
    .get(categoryController.categoryDeleteGet)
    .post(categoryController.categoryDeletePost);

router.get('/category/:id', categoryController.categoryDetail);

router.get('/brands', brandController.list);

router
    .route('/brand/create')
    .get(brandController.brandCreateGet)
    .post(brandController.brandCreatePost);

router
    .route('/brand/:id/update')
    .get(brandController.brandUpdateGet)
    .post(brandController.brandUpdatePost);

router.get('/brand/:id', brandController.brandDetail);

module.exports = router;

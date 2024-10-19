const express = require('express');
const router = express.Router();
const { getAllProducts, getProductByCategoryId, createProduct, updateProduct, deleteProduct, getProductByName, getProductById } = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, getAllProducts);
router.get('/product/:id', authMiddleware, getProductById);
router.get('/:name', authMiddleware, getProductByName);
router.get('/category/:categoryId', authMiddleware, getProductByCategoryId)
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getAllCategories, getCategoryById, addCategories, deleteCategories } = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware,getAllCategories);
router.post('/', authMiddleware, addCategories)
router.get('/:id', authMiddleware,getCategoryById);
router.delete('/:id', authMiddleware, deleteCategories)

module.exports = router;

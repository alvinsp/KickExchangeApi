const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/userFavoriteController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/favorites', authMiddleware, addFavorite);

router.delete('/favorites/:productId', authMiddleware, removeFavorite);

router.get('/favorites', authMiddleware, getFavorites);

module.exports = router;

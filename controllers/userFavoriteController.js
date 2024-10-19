const db = require('../models/index');

const addFavorite = async (req, res) => {
    const userId = req.id;
    const { productId } = req.body;

    try {
        await db.UserFavorites.create({ userId, productId });
        res.status(201).json({ message: 'Product added to favorites' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const removeFavorite = async (req, res) => {
    const userId = req.id;
    const { productId } = req.params;

    try {
        await db.UserFavorites.destroy({
            where: {
                userId,
                productId
            }
        });
        res.status(200).json({ message: 'Product removed from favorites' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getFavorites = async (req, res) => {
    const userId = req.id;

    try {
        const user = await db.Users.findByPk(userId, {
            include: [{
                model: db.Products,
                as: 'Products',
                through: {
                    attributes: []
                }
            }]
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user.Products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addFavorite, removeFavorite, getFavorites };

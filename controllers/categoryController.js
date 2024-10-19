const db = require("../models/index");

const getAllCategories = async (req, res) => {
    try {
        const getCategories = await db.Categories.findAll()
        res.json(getCategories)
    } catch (error) {
        console.log(error)
    }
}
const getCategoryById = async (req, res) => {
    try {
        const category = await db.Categories.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching category' });
    }
};

const addCategories = async (req, res) => {
    const { name, image } = req.body
    const categories = await db.Categories.create({ name, image })
    res.status(201).json(categories)
}

const deleteCategories = async (req, res) => {
    try {
        const category = await db.Categories.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Categories not found' });
        }
        await category.destroy();
        res.json({ message: "Category has been deleted" })
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting categories' });
    }
};


module.exports = { getAllCategories, getCategoryById, addCategories, deleteCategories }

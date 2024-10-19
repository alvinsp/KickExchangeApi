const db = require('../models/index');
const { Op } = require('sequelize');
const validator = require('validator');

const getAllProducts = async (req, res) => {
    try {
        const products = await db.Products.findAll();
        console.log(products)
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
};

const getProductByCategoryId = async (req, res) => {
    try {
        const productCategoryId = req.params.categoryId;
        const products = await db.Products.findAll({
            where: {
                categoryId: productCategoryId
            },
            include: [{
                model: db.Categories,
                as: 'Category'
            }]
        });
        console.log(`Found products: ${JSON.stringify(products)}`);
        if (products.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await db.Products.findByPk(productId, {
            include: [{
                model: db.Categories,
                as: 'Category'
            }]
        });
        console.log(`Found product: ${JSON.stringify(product)}`);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Error fetching product' });
    }
};

const getProductByName = async (req, res) => {
    try {
        const productName = req.params.name;
        console.log(`Searching for products with name like: ${productName}`);
        const products = await db.Products.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${productName}%`
                }
            }
        });
        console.log(`Found products: ${JSON.stringify(products)}`);
        if (products.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, price, qty, categoryId, url } = req.body;

        if (!name || !price || !qty || !url) {
            return res.status(400).json({ error: 'Semua field (name, price, qty, url) harus diisi' });
        }

        // Validasi price (harus angka positif)
        if (isNaN(price) || parseFloat(price) <= 0) {
            return res.status(400).json({ error: 'Price harus berupa angka positif' });
        }

        // Validasi qty (harus angka positif)
        if (isNaN(qty) || parseInt(qty) <= 0) {
            return res.status(400).json({ error: 'Quantity harus berupa angka positif' });
        }

        if (!validator.isURL(url)) {
            return res.status(400).json({ error: 'Format URL tidak valid' });
        }

        const product = await db.Products.create({
            name,
            price,
            qty,
            categoryId,
            url,
            createdBy: req.user.username,
            updatedBy: req.user.username,
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error creating product' });
        console.log(error)
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, price, qty, categoryId, url } = req.body;
        const product = await db.Products.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (!name || !price || !qty || !url) {
            return res.status(400).json({ error: 'Semua field (name, price, qty, url) harus diisi' });
        }

        // Validasi price (harus angka positif)
        if (isNaN(price) || parseFloat(price) <= 0) {
            return res.status(400).json({ error: 'Price harus berupa angka positif' });
        }

        // Validasi qty (harus angka positif)
        if (isNaN(qty) || parseInt(qty) <= 0) {
            return res.status(400).json({ error: 'Quantity harus berupa angka positif' });
        }

        if (!validator.isURL(url)) {
            return res.status(400).json({ error: 'Format URL tidak valid' });
        }

        product.name = name;
        product.price = price;
        product.qty = qty;
        product.categoryId = categoryId;
        product.url = url;
        product.updatedBy = req.user.username;
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error updating product' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await db.Products.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        await product.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product' });
    }
};

module.exports = { getAllProducts, getProductByCategoryId, getProductById, getProductByName, createProduct, updateProduct, deleteProduct }
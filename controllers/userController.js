const { where } = require('sequelize');
const db = require('../models/index');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');

// Tangani error multer di middleware
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                error: "File terlalu besar, maksimal ukuran file adalah 5MB."
            });
        }
    }
    // Lanjutkan ke middleware berikutnya jika tidak ada error dari multer
    next();
};

const getProfile = async (req, res) => {
    try {
        console.log(`Fetching profile for user ID: ${req.id}`);
        const user = await db.Users.findByPk(req.id, {
            attributes: ['id', 'username', 'email', 'image'],
        });

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error('Failed to fetch profile', err);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

const uploadImage = async (req, res) => {
    try {
        const user = await db.Users.findByPk(req.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const image = req.file;
        if (!image) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        // Kompres gambar dan simpan langsung ke file
        const compressedImagePath = `uploads/compressed-${Date.now()}.jpeg`;

        // Menggunakan sharp untuk mengompres gambar
        await sharp(image.buffer)
            .resize({ width: 800 })  // Resize gambar jika diperlukan
            .jpeg({ quality: 80 })   // Kompres gambar dengan kualitas 80%
            .toFile(compressedImagePath);

        // Hapus gambar lama jika ada
        const oldImagePath = user.image;
        if (oldImagePath) {
            const oldImageFullPath = path.join(__dirname, `../uploads/${oldImagePath}`);
            if (fs.existsSync(oldImageFullPath)) {
                fs.unlinkSync(oldImageFullPath);
            }
        }

        // Update path gambar yang sudah dikompresi ke database
        user.image = compressedImagePath;
        await user.save();

        res.status(200).json({
            message: "Image uploaded and compressed successfully",
            data: user
        });
    } catch (err) {
        console.error('Failed to upload image:', err);
        res.status(500).json({ error: "Failed to upload image" });
    }
};

module.exports = { getProfile, uploadImage, handleMulterError };

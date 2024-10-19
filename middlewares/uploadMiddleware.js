const multer = require('multer');

// Gunakan memoryStorage untuk menyimpan file di memori sementara
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5  // Batas ukuran file 1MB
    },
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});

module.exports = upload;

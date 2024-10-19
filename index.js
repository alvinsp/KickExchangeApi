const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes');
const userFavoriteRoutes = require('./routes/userFavoriteRoutes');

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

require('dotenv').config();

app.use('/uploads', express.static('uploads'));
app.use('/api/users', userRoutes);

app.use('/api', userFavoriteRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
    res.json({
        status: 200,
        message: "Welcome To Products API"
    })
    res.send('Express Vercel')
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Products || listening on port http://localhost:${PORT}`)
})

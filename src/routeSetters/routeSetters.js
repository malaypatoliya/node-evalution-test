const express = require('express');
const authRoutes = require('../routes/authRoutes/authRoutes');
const postRoutes = require('../routes/postRoutes/postRoutes');
const CryptoJS = require('crypto-js');

const router = express.Router();

router.use('/user', authRoutes);
router.use('/post', postRoutes);

// for testing purpose only (remove it later) (get encrypted id)
router.get('/test', (req, res) => {
    res.send(CryptoJS.AES.encrypt(req.header('id'), process.env.SECRET_KEY).toString());
})

const setRoutes = (app) => {
    app.use('/api/v1', router);
}

module.exports = setRoutes;
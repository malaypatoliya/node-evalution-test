const express = require('express');
const authContoller = require('../../controllers/authControllers/authController');
const validateToken = require('../../middlewares/validateToken');

const router = express.Router();

router.post('/login', authContoller.loginFunc)
router.post('/register', authContoller.registerFunc);
router.get('/get-user', validateToken, authContoller.getUserFunc);
router.post('/update-user', validateToken, authContoller.updateUserFunc);

module.exports = router;
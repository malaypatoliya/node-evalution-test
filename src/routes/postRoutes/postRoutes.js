const express = require('express');
const postController = require('../../controllers/postControllers/postController');
const validateToken = require('../../middlewares/validateToken');

const router = express.Router();

router.get('/', validateToken, postController.getPostsFunc);
router.post('/add', validateToken, postController.addPostFunc);
router.put('/update', validateToken, postController.updatePostFunc);
router.delete('/delete', validateToken, postController.deletePostFunc);

module.exports = router;
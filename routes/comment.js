const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comment');



router.post('/', commentCtrl.createComment);

router.post('/upvote', commentCtrl.likeComment);

router.get('/:id/upvote', commentCtrl.getCommentLikes);

router.get('/:id', commentCtrl.getComments)

router.delete('/:id/remove', commentCtrl.deleteComment);

router.put('/', commentCtrl.updateComment);







module.exports = router;
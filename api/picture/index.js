var express = require('express');
var controller = require('./pictures.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/picture/:id', controller.show);
router.post('/', controller.create);
router.post('/:id/upvotes', controller.update_upvotes);
router.post('/:id/comments', controller.add_comment);
router.delete('/:id', controller.destroy);


module.exports = router;
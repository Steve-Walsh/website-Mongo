  var express = require('express');
  var controller = require('./users.controller');

  var router = express.Router();

  router.get('/', controller.index);
  router.get('/:id', controller.view);
  router.post('/registerNewUser', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.destroy);



  module.exports = router;

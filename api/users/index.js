var express = require('express');
 
var controller = require('./users.controller');
var router = express.Router();

router.post('/invite', controller.invite);
router.get('/getAll', controller.getAll);
router.get('/getOne/:id', controller.getOne);
router.post('/pay', controller.login);
router.post('/register', controller.create);
router.put('/update/:id', controller.update);
router.delete('/delete/:id', controller.delete);
router.get('/payments', controller.getpayments);

module.exports = router;

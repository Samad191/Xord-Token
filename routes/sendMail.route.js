const express = require('express');
const { sendMailController } = require('../controllers/index')
const router = express.Router();

router.post('/sheet/sendMail',  sendMailController.sendMailController)

module.exports = router;

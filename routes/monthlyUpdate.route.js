const express = require('express');
const {sheetController, monthlyUpdate} = require('../controllers/index')
const router = express.Router();

router.post('/sheet/monthlyUpdate', monthlyUpdate.monthlyUpdateService)

module.exports = router;
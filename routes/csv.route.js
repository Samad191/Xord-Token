const express = require('express');
const { csvController } = require('../controllers/index')
const router = express.Router();

router.post('/csv/createCsv',  csvController.csvController)
router.post('/json/createJsonFile', csvController.JSONController)

module.exports = router;

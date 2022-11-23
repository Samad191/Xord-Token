const express = require('express');
const {sheetController} = require('../controllers/index')
const router = express.Router();

router.put('/sheet/updateCliffPeriod', sheetController.updateCliffPeriod)
router.put('/sheet/backTrackToPreviousMonth', sheetController.backTrackToPreviousMonth)
// router.put('/sheet/updateCliffPeriod', () => console.log('hello'))

module.exports = router;
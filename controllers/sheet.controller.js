const { sheetService } = require('../services')

const updateCliffPeriod = async (req, res) => {
    console.log('update cliff period', req.body);
    const result = await sheetService.updateCliffPeriod()
    res.send(result)
}

const backTrackToPreviousMonth = async (req, res) => {
    console.log('test', req.body);
    const result = await sheetService.backTrackToPreviousMonth(req.body);
    res.send(result)
}

module.exports = {
    updateCliffPeriod,
    backTrackToPreviousMonth
}
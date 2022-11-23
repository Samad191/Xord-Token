const { monthlyUpdate } = require('../services')

const monthlyUpdateService = async (req, res) => {
    const result = await monthlyUpdate.test(req.body)
    res.send(result)
}

module.exports = {
    monthlyUpdateService
}
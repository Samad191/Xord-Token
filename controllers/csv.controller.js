const { csvService } = require('../services')

const csvController = async (req, res) => {
    const result = await csvService.csv(req.body)
    res.send(result)
}

const JSONController = async (req, res) => {
    console.log('controller working');
    const result = await csvService.createJSONFile();
    res.send('hello world')
}

module.exports = {
    csvController,
    JSONController
}
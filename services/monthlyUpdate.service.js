const { readGoogleSheets } = require('../sheet')

const test = async(req, res) => {
    try {
        console.log('test', req)
        await readGoogleSheets(req)
        return 'hello'
    } catch(err) {
        throw err
    }
}

module.exports = {
    test
}
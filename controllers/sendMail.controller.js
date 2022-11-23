const { sendMailService } = require('../services')

const sendMailController = async (req, res) => {
    console.log('send mail');
    const result = await sendMailService.sendMail()
    res.send(result)
}

module.exports = {
    sendMailController
}
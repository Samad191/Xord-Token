const nodemailer = require("nodemailer")
const sendMail = async () => {
    console.log('send mail route here');
    // refresh tken = 1//04bB0cgdPi_RDCgYIARAAGAQSNwF-L9IriqwcAL28rcl802vUEW9kv1QC93lyGylN0rguUlwRLTYmJshETBWePyU0Vc5ShbhsrNs

    console.log('send mail')
    const NODE_MAILER_CLIENT_ID='7434349028-jlck0hndpdvfm2tmofv7mhmk97ndbsa7.apps.googleusercontent.com'
    const NODE_MAILER_CLIENT_SECRET='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'
    const NODE_MAILER_REFRESH_TOKEN='1//04bB0cgdPi_RDCgYIARAAGAQSNwF-L9IriqwcAL28rcl802vUEW9kv1QC93lyGylN0rguUlwRLTYmJshETBWePyU0Vc5ShbhsrNs'
    const NODE_MAILER_EMAIL='samad@xord.com'
    let transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                type: "OAuth2",
                user: NODE_MAILER_EMAIL,
                clientId: NODE_MAILER_CLIENT_ID,
                clientSecret: NODE_MAILER_CLIENT_SECRET,
                refreshToken: NODE_MAILER_REFRESH_TOKEN,
              },
            });

            var mailOptions = {
              to: 'samad13354@gmail.com',
              subject: "Xord Token",
              from: NODE_MAILER_EMAIL,
              cc: 'danial@xord.com',
              html: `
              <p> Sender: hello</p>
              <p>Reciever: world</p>
              <p>Amount: Xord</p>
              `
            };
            await transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log('Error', error)
              } else {
                console.log('Done')    
              }
            });

}

module.exports = {
    sendMail,
}
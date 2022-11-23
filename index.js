
// const axios = require('axios');
// const nodemailer = require("nodemailer")
// const cron = require('node-cron');
// var MongoClient = require('mongodb').MongoClient;
// const mongoose = require('mongoose');
// const { lastBlock } = require('./model.js')
// const { readGoogleSheets } = require('./sheet.js')

// const sendMail = async ({ to, from, amount }) => {
//     const NODE_MAILER_CLIENT_ID='162776449830-efk5sagvudujb809g68hdf7rebeuoqjs.apps.googleusercontent.com'
//     const NODE_MAILER_CLIENT_SECRET='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'
//     const NODE_MAILER_REFRESH_TOKEN='1//04G0gmItUVBO5CgYIARAAGAQSNwF-L9IrTNBkDh5FFDde4op4L9s3uOwJTq9ulYmWwQgnAm_Tpb2J43UxCowcgPNjYI5bNydXLdw'
//     const NODE_MAILER_EMAIL='ijlalishaq2019@gmail.com'
//     let transporter = nodemailer.createTransport({
//               service: "gmail",
//               auth: {
//                 type: "OAuth2",
//                 user: NODE_MAILER_EMAIL,
//                 clientId: NODE_MAILER_CLIENT_ID,
//                 clientSecret: NODE_MAILER_CLIENT_SECRET,
//                 refreshToken: NODE_MAILER_REFRESH_TOKEN,
//               },
//             });

//             var mailOptions = {
//               to: 'samad@xord.com',
//               subject: "Xord Token",
//               from: NODE_MAILER_EMAIL,
//               html: `
//               <p> Sender: ${from.id}</p>
//               <p>Reciever: ${to.id}</p>
//               <p>Amount: ${amount}</p>
//               `
//             };
//             await transporter.sendMail(mailOptions, function (error, info) {
//               if (error) {
//                 console.log('Error', error)
//               } else {
//                 console.log('Done')    
//               }
//             });
// }

// const fetchSubgraphData = async () => {
//   console.log('running')
//   const res = await axios.post('https://api.thegraph.com/subgraphs/name/ijlal-ishaq/xord-token', {
//     query: `{
//       transactions(first: 1000) {
//         transactionNumber
//         amount
//         receivers{id holding}
//         to {id holding}
//         from {id holding}
//         amount
//       }
//     }`
//   })
//     return res.data.data.transactions;

// }

// let blockNumber = 0;
// const connectToMongo = async () => {

//     mongoose.connect('mongodb+srv://Samad_Xord:Roman_Empire1279@cluster0.kpotnrz.mongodb.net/?retryWrites=true&w=majority',
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   }
// );
//     const db = mongoose.connection;
//     db.on("error", console.error.bind(console, "connection error: "));
//     db.once("open", async function () {
// });
//     console.log('Test')

// }
// const getBlockNumber = async () => {
//     const data = await lastBlock.find({})
//     blockNumber = data[0].lastBlock;
// }

// const sendMailLoop = async(toSendEmails) => {
//     for(let i=0; i< toSendEmails.length; i++) {
//         console.log('send mail loop', toSendEmails[i])
//         await sendMail(toSendEmails[i])
//         await lastBlock.updateOne({ lastBlock: toSendEmails[toSendEmails.length-1].transactionNumber })
//     }
// }

// connectToMongo()
// getBlockNumber()
// readGoogleSheets()
// // fetchSubgraphData()

// // cron.schedule('* * * * *', async () => {
// // //   console.log('test blocknumber', blockNumber)
// //     const transactions = await fetchSubgraphData()
// //     const toSendEmails = transactions.filter(tx => Number(tx.transactionNumber) > blockNumber)
// //     // console.log('send emails ===>>>', toSendEmails)
// //     if(toSendEmails.length > 0) sendMailLoop(toSendEmails)
// //     else console.log('no mails to send')
// // });
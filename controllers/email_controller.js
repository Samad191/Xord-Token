const Web3 = require('web3');
const nodemailer = require("nodemailer");
const { ABI, CONTRACT_ADDRESS } = require('../contract.js')
const web3 = new Web3("wss://rinkeby.infura.io/ws/v3/7c4e9e4322bc446195e561d9ea27d827");
const axios = require('axios');
const cron = require('node-cron');
const test = require('./lastBlock.js')

const myContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

let options = {
    filter: {
        value: []    
    },
    fromBlock: 11463580,             
    toBlock: 'latest'
};

const getBlock = async() => {
  console.log('options', options);
  options.fromBlock = await web3.eth.getBlockNumber()
  console.log('options', options)
}


// getBlock()

const sendMail = async (event) => {
  const NODE_MAILER_CLIENT_ID = ''
  const NODE_MAILER_CLIENT_SECRET = '' 
  const NODE_MAILER_REFRESH_TOKEN = ''
  const NODE_MAILER_EMAIL = 'carwan99@gmail.com';
  var transporter = nodemailer.createTransport({
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
              to: 'samad@xord.com',
              subject: "Xord Token",
              from: NODE_MAILER_EMAIL,
              html: `
              <p> Sender: ${event.returnValues.from}</p>
              <p>Reciever: ${event.returnValues.to}</p>
              <p>Amount: ${event.returnValues.value}</p>
              `
            };
            await transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log('Error', error)
                // res.json({
                //   error: "User not Added, Try again!",
                // });
              } else {
                console.log('Done')
                // res.json({
                //   success: "User Added",
                // });
              }
            });
}

const eventListenter = async () => {
      myContract.events.Transfer(options)
    .on('data', (event) => {
   
      options.fromBlock = event.blockNumber
      console.log('Block number event', event.blockNumber)
      console.log('send mail', event.returnValues)
      // sendMail(event)
    })
    .on('changed', changed => console.log('changed',changed))
    .on('error', err => console.log('err',err))
    .on('connected', str => console.log('connect',str))

}

// eventListenter()

const fetchSubgraphData = async () => {
  console.log('running')
  const res = await axios.post('https://api.thegraph.com/subgraphs/name/ijlal-ishaq/xord-token', {
    query: `{
      transactions(first: 1000) {
        transactionNumber
        amount
        receivers{id holding}
        to {id holding}
        from {id holding}
        amount
      }
    }`
  })
}


cron.schedule('* * * * *', () => {
  // '*/2 * * * *'
  test()
  console.log('test')
  // fetchSubgraphData();
});

module.exports = {
  sendMail
};


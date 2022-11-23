const fs = require('fs');
const { parse } = require('csv-parse');
const fastcsv = require('fast-csv')
const { google } = require('googleapis')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csv = async () => {
    console.log('csv running [][][]')
    const data = [
        { id: 1, name: 'Hassan' },
        { id: 2, name: 'Danial' }
    ]

    const auth = new google.auth.GoogleAuth({ 
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
    })
  
    /////////// Create client instance for auth /////////////////
    const client = await auth.getClient();
  
    ////////////// Instance of google sheets api //////////////////
    const googleSheets = google.sheets({ version: 'v4', auth: client }) 
    
    ///////////////// Xord sheet ID ////////////////////////////
    const spreadsheetId = '1zKRbYUyTe-hxRo1SSuweDxJUQmwQ-mKgj0MVQQ2bs5o'
       
    /////////////////// Get metadata about spreadsheet ///////////////////////
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });
        
    ///////////////// Read rows from spreadsheet ///////////////////
    const esops = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: 'Summary',
    });

    /////////// INITIAL MEMBERS SHEET ///////////////////
    const initialMembers = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: 'Initial Members'
    })

    initialMembers.data.values.shift()
    esops.data.values.shift();

    const initialMembersArray = initialMembers.data.values.map((user, index) => {
        return { 
          name: user[1], 
          officialEmail: user[4],
          totalDistributed: user[6],
          walletAddress: user[5], 
         }
    })

    const ESOPSheet = esops.data.values.map((user, index) => {
        return { 
            name: user[1], 
            officialEmail: user[4],
            walletAddress: user[5],
            totalDistributed: user[6],
         }
      })

    console.log('initial', initialMembers.data.values);
    console.log('esops', esops.data.values);

    const esopsWs = fs.createWriteStream('esops.csv')
    const initialWs = fs.createWriteStream('initials.csv')

    fastcsv.write(ESOPSheet, { headers: true }).pipe(esopsWs);
    fastcsv.write(initialMembersArray, { headers: true }).pipe(initialWs);
}

const createJSONFile = async (month, year, sharePerXordian, walletAddress) => {
    console.log('json', sharePerXordian, walletAddress);
    const addressesObj = {
        addresses: sharePerXordian,
        shares: walletAddress
    };


    const json = JSON.stringify(addressesObj);
    fs.writeFile(`${month}-${year}.json`, json, 'utf-8', () => console.log('Done'));
    console.log('Finished [][][]')
}

module.exports = {
    csv,
    createJSONFile
}
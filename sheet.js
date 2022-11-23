// RUN THIS COMMAND WHILE RUNNING THE SERVER
// export OPENSSL_CONF=/dev/null
const { google } = require('googleapis')
const { getAlphabets } = require('./utils')
const { createJSONFile } = require('./services/csv.service')

const readGoogleSheets = async ({month, year}) => {
    console.log('google sheets', month, year)
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

    ///////////// ADJUSTMENTS SHEET /////////////////
    const adjustments = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: 'Adjustments'
    })
    
    /////// DELETING FIRST ELEMENT OF ARRAY
    adjustments.data.values.shift();

    /////////// CONVERTING ARRAY OF ARRAY TO ARRAY OF OBJECTS //////////
    const adjustmentsArray = adjustments.data.values.map((user) => {
      return {
        id: user[0],
        name: user[1],
        adjustmentNumber: user[2] == '' ? 0 : user[2],
        joiningDate: user[3]
      }
    })

    ////////////// HARD CODE MULTIPLIER ////////////////
    const multiply = {
      1: 1,
      2: 2,
      3: 4,
      4: 8,
      5: 16
    }

    initialMembers.data.values.shift()
   
    /////////// CONVERTING ARRAY OF ARRAY TO ARRAY OF OBJECTS //////////
    const initialMembersArray = initialMembers.data.values.map((user, index) => {
      return { 
        id: user[0], 
        name: user[1], 
        level: user[2], 
        personalEmail: user[3], 
        officialEmail: user[4],
        totalDistributed: user[6], 
        fixNumber: user[7],
        multiple: multiply[user[2]],
        joiningDate: user[8],
       }
  })
    
    esops.data.values.shift();
   
    const sharesPerMonth = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: 'Constants!B1'
  })
    
    ///////// TOTAL SHARES TO BE DISTRIBUTED /////////////
    const totalSharesPerMonth = sharesPerMonth.data.values[0];
  
    /////////// CONVERTING ARRAY OF ARRAY TO ARRAY OF OBJECTS //////////
    const ESOPSheet = esops.data.values.map((user, index) => {
      return { 
          id: user[0], 
          name: user[1], 
          level: user[2], 
          multiple: multiply[user[2]],
          walletAddress: user[5], 
          totalDistributed: user[6],
          joiningDate: user[7],
          dateOfLeaving: user[9]
      }
    })

    const ESOPMember = ESOPSheet.filter((esop) => esop.dateOfLeaving == undefined)
    ESOPMember.map((esop, index) => {
      // console.log('esop', esop);
      if(esop.dateOfLeaving) {
        console.log('date of leaving found [][]', esop)
        // ESOPMember.filter(esop.dateOfLeaving)
      }
    })

 
    /////////// GETTING ADJUSTMENT NUMBER OF XORDIAN FROM ID /////////////////    
    const addAdjustments = (id) => {
      const res = adjustmentsArray.filter((adjustment) => {
        return adjustment.id == id
      })
      return res[0].adjustmentNumber;
    }

    //////////// CALCULATING SHARE PER XORDIAN /////////////////////
    const sharePerXordian = () => {
        let val = 0;
        ESOPMember.map((sort) => {
            val += Number(sort.multiple)

     })
    //  console.log('share per xordian', totalSharesPerMonth / val);
     return  totalSharesPerMonth / val;
    }

    /////////////// SHARES CALCULATION FOR ESOP MEMBERS ////////////////////////
    const sharesCalculationForESOPMembers = (Array) => {
      const result = Array.map((member, index) => {
        if(member.dateOfLeaving == undefined) { 
          return  Number(member.multiple * sharePerXordian()) + Number(addAdjustments(member.id)) + Number(member.totalDistributed)
        }
        else { 
          return member.totalDistributed
        }
      })
      return result;
    }

    /////////// SHARES CALCULATION FOR INITIAL MEMBERS ////////////////////////////
    const sharesCalculationForinitialMembers = (initialMembersArray) => {
      const result = initialMembersArray.map((initialMember) => {
        return  Number(initialMember.fixNumber) + Number(initialMember.totalDistributed)+ Number(addAdjustments(initialMember.id))
      })
      return result
    }

    const sharesCalculationForAMonthESOPMember = (Array) => {
      const result = Array.map((member) => {
          return Number(member.multiple * sharePerXordian() + Number(addAdjustments(member.id)))
      })
      return result;
    }

    const sharesCalculationForAMonthinitialMembers = (initialMembersArray) => {
      const result = initialMembersArray.map((initialMember) => {
        return  Number(initialMember.fixNumber) + Number(addAdjustments(initialMember.id))
      })
      return result
    }

    const addingCliffPeriod = (ESOPMembersArray) => {
      return ESOPMembersArray.map((esopMembers) => {
        return esopMembers.joiningDate
      })
      
    }
    
    ///////// CREATING OBJECT FOR GOOGLE API ////////////////
    const resourcesForInitialMembers = {
      auth,
      spreadsheetId,
      resource: {
        valueInputOption: 'RAW',
        data: [
          {
            range: 'Initial Members!G2:G14',
            values: sharesCalculationForinitialMembers(initialMembersArray).map(element => [element])
          }
        ]
      }
    }

    
    ///////// CREATING OBJECT FOR GOOGLE API ////////////////
    const resourcesForESOPMembers = {
      auth,
      spreadsheetId,
      resource: {
      valueInputOption: 'RAW',
      data: [
        {
          range: `Summary!G2:G${ESOPSheet.length + 1}`,
          values: sharesCalculationForESOPMembers(ESOPSheet).map((element) => [element])
        }
      ]
    }
    }
    
    ////////// HITTING GOOGLE SHEETS API //////////////////////
    await googleSheets.spreadsheets.values.batchUpdate(resourcesForESOPMembers)
    await googleSheets.spreadsheets.values.batchUpdate(resourcesForInitialMembers);
   
    //////// CREATING NEW SHEET ///////////////
    const createMonthlySheetForESOPMember = {
      spreadsheetId,
      auth,
      resource: {
        requests: [{
          addSheet: {
            properties: {
              title: `ESOP ${month} ${year}`
              // title: `ESOP ${new Date().toLocaleString('en-us',{month:'long', year:'numeric'})}`,
            }
          }
        }],
      },
    }
    
  //////// CREATING NEW SHEET ///////////////
  const createMonthlySheetForInitialMember = {
    spreadsheetId,
    auth,
    resource: {
      requests: [{
        addSheet: {
          properties: {
            title: `Initial Member ${month} ${year}`
            // title: `Initial Member ${new Date().toLocaleString('en-us',{month:'long', year:'numeric'})}`,
          }
        }
      }],
    },
  }    
   
    ////////////////////// MONTHLY SHEET //////////////////////////////////
    await googleSheets.spreadsheets.batchUpdate(createMonthlySheetForESOPMember)
    await googleSheets.spreadsheets.batchUpdate(createMonthlySheetForInitialMember)


    const resourcesForNewSheetESOPMember = {
      auth,
      spreadsheetId,
      resource: {
      valueInputOption: 'RAW',
      data: [
        {
          range: `ESOP ${month} ${year}!A1:G1`,
          // range: `ESOP ${new Date().toLocaleString('en-us',{month:'long', year:'numeric'})}!A1:G1`,
          values: [['XID', 'Name', 'Level', 'Shares Alloted this month', 'Joining Date', 'Cliff Period Over', 'Last month shares']],
        }
      ]
    }
    }

    const resourcesForNewSheetInitialMember = {
      auth,
      spreadsheetId,
      resource: {
      valueInputOption: 'RAW',
      data: [
        {
          range: `Initial Member ${month} ${year}!A1:F1`,
          // range: `Initial Member ${new Date().toLocaleString('en-us',{month:'long', year:'numeric'})}!A1:F1`,
          values: [['XID', 'Name', 'Level', 'Shares Alloted this month', 'Joining Date', 'Cliff Period Over']],
        }
      ]
    }
    }


    const resourcesForNewSheetUpdateForESOPMember = {
      auth,
      spreadsheetId,
      resource: {
        valueInputOption: 'RAW',
        data: [
          {
            range: `ESOP ${month} ${year}!D2:D${ESOPMember.length + 1}`,
            // range: `ESOP ${new Date().toLocaleString('en-us',{month:'long', year:'numeric'})}!D2:D${ESOPMember.length + 1}`,
            values: sharesCalculationForAMonthESOPMember(ESOPMember).map((element) => [element])
          },
          {
            range: `ESOP ${month} ${year}!A2:A$${ESOPMember.length + 1}`,
            // range: `ESOP ${new Date().toLocaleString('en-us',{month:'long', year:'numeric'})}!A2:A${ESOPMember.length + 1}`,
            values: ESOPMember.map((member) => [member.id]),
          },
          {
            range: `ESOP ${month} ${year}!B2:B${ESOPMember.length + 1}`,
            // range: `ESOP ${new Date().toLocaleString('en-us',{month:'long', year:'numeric'})}!B2:B${ESOPMember.length + 1}`,
            values: ESOPMember.map((member) => [member.name]),
          },
          {
            range: `ESOP ${month} ${year}!C2:C${ESOPMember.length + 1}`,
            // range: `ESOP ${new Date().toLocaleString('en-us',{month:'long', year:'numeric'})}!C2:C${ESOPMember.length + 1}`,
            values: ESOPMember.map((member) => [member.level]),
          },
          {
            range: `ESOP ${month} ${year}!G2:G${ESOPMember.length + 1}`,
            // range: `ESOP ${new Date().toLocaleString('en-us',{month:'long', year:'numeric'})}!G2:G${ESOPMember.length + 1}`,
            values: ESOPMember.map((member) => [member.totalDistributed]),
          } 
        ]
      }
    }

    const resourcesForNewSheetUpdateForInitialMember = {
      auth,
      spreadsheetId,
      resource: {
        valueInputOption: 'RAW',
        data: [
          {
            range: `Initial Member ${month} ${year}!D2:D${initialMembersArray.length + 1}`,
            // range: `Initial Member ${new Date().toLocaleString('en-us',{month:'long', year:'numeric'})}!D2:D${initialMembersArray.length + 1}`,
            values: sharesCalculationForAMonthinitialMembers(initialMembersArray).map((element) => [element])
          },
          {
            range: `Initial Member ${month} ${year}!A2:A${initialMembersArray.length + 1}`,
            // range: `Initial Member ${new Date().toLocaleString('en-us',{month:'long', year:'numeric'})}!A2:A${initialMembersArray.length + 1}`,
            values: initialMembersArray.map((member) => [member.id]),
          },
          {
            range: `Initial Member ${month} ${year}!B2:B${initialMembersArray.length + 1}`,
            // range: `Initial Member ${new Date().toLocaleString('en-us',{month:'long', year:'numeric'})}!B2:B${initialMembersArray.length + 1}`,
            values: initialMembersArray.map((member) => [member.name]),
          },
          {
            range: `Initial Member ${month} ${year}!C2:C${initialMembersArray.length + 1}`,
            // range: `Initial Member ${new Date().toLocaleString('en-us',{month:'long', year:'numeric'})}!C2:C${initialMembersArray.length + 1}`,
            values: initialMembersArray.map((member) => [member.level]),
          },
          {
            range: `Initial Member ${month} ${year}!E2:E${initialMembersArray.length + 1}`,
            // range: `Initial Member ${new Date().toLocaleString('en-us',{month:'long', year:'numeric'})}!E2:E${initialMembersArray.length + 1}`,
            values: initialMembersArray.map((member) => [member.joiningDate]),
          }
          // {
          //   range: `Initial Member ${new Date().toLocaleString('en-us',{month:'long', year:'numeric'})}!F2:F${initialMembersArray.length + 1}`,
          //   values: initialMembersArray.map((member) => [member.joiningDate]),
          // }
        ]
      }
    }

    ////////// Promise All //////////
    console.log('Promise All');

    // ESOPMember.map((member) => [member.walletAddress]),
    await createJSONFile(month, year, ESOPMember.map((member) => member.walletAddress), sharesCalculationForAMonthESOPMember(ESOPMember).map((element) => element))
   
    Promise.all([
      googleSheets.spreadsheets.values.batchUpdate(resourcesForNewSheetESOPMember),
      googleSheets.spreadsheets.values.batchUpdate(resourcesForNewSheetUpdateForESOPMember),
      googleSheets.spreadsheets.values.batchUpdate(resourcesForNewSheetInitialMember),
      googleSheets.spreadsheets.values.batchUpdate(resourcesForNewSheetUpdateForInitialMember)
    ])

    // await googleSheets.spreadsheets.values.batchUpdate(resourcesForNewSheetESOPMember);
    // console.log(2)
    // await googleSheets.spreadsheets.values.batchUpdate(resourcesForNewSheetUpdateForESOPMember);

    // console.log(3)
    // await googleSheets.spreadsheets.values.batchUpdate(resourcesForNewSheetInitialMember);
    // console.log(4)
    // await googleSheets.spreadsheets.values.batchUpdate(resourcesForNewSheetUpdateForInitialMember)


    console.log('<============== Finished ==============>');
}  


module.exports = {
  readGoogleSheets
}
const { google } = require('googleapis')
const moment = require('moment')
const { getAlphabets, getMonth } = require('../utils')

const getCliffPeriodOverDate = (ESOPMemberArray) => {
    ESOPMemberArray.map((singleESOPMember) => {
            const res = singleESOPMember.joiningDate.split('-');
            const replaced = singleESOPMember.joiningDate.split('-').join('/')
            const monthName = getMonth(replaced.toString().split('/')[1])
            const month = getAlphabets(res[1])
            let splited = replaced.split('/');
            splited.unshift(splited[1])
            splited[2] = `20${Number(splited[3]) + 1}`
            splited.splice(3)
            splited[0] = monthName.toString();
            let formattedDate = new Date(splited.join('/'));
            if(singleESOPMember.dateOfLeaving) {
              console.log('danger if', singleESOPMember.dateOfLeaving, formattedDate);

              //////////////////////////////////////////////////
              ////// The below condition needs to be done //////
              //////////////////////////////////////////////////

              if(singleESOPMember.dateOfLeaving == singleESOPMember.joiningDate) console.log('Same date =======>>>>>')
              return;
            }
            if(formattedDate > new Date) {
                console.log('CLiff period not completed', singleESOPMember.name);
                singleESOPMember.cliffPeriodOver = 'No';
            } else {
                console.log('cliff period completed', singleESOPMember.name)
                singleESOPMember.cliffPeriodOver = 'Yes'
            }
        // }
    })
    return ESOPMemberArray;
}


const updateCliffPeriod = async () => {
  console.clear()
    try {
        console.log('hello')
        console.log('google sheets')
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
        esops.data.values.shift();
        const ESOPMember = esops.data.values.map((user, index) => {
        return { 
            id: user[0], 
            name: user[1], 
            level: user[2], 
            officialEmail: user[4],
            totalDistributed: user[6],
            joiningDate: user[7],
            dateOfLeaving: user[9],
            cliffPeriodOver:'No',
        }
    })

    // const ESOPMember = ESOPSheet.filter((esop) => esop.dateOfLeaving == undefined)
    // const filterWithDateOfLeaving = ESOPMember.filter(esop => esop.dateOfLeaving == undefined)
    const updatedESOPMember = getCliffPeriodOverDate(ESOPMember)
    const resourcesForNewSheetUpdateForESOPMember = {
      auth,
      spreadsheetId,
      resource: {
        valueInputOption: 'RAW',
        data: [
          {
            range: `Summary!A2:A${ESOPMember.length + 1}`,
            values: updatedESOPMember.map((member) => [member.id]),
          },
          {
            range: `Summary!B2:B${ESOPMember.length + 1}`,
            values: updatedESOPMember.map((member) => [member.name]),
          },
          {
            range: `Summary!C2:C${ESOPMember.length + 1}`,
            values: updatedESOPMember.map((member) => [member.level]),
          },
          {
            range: `Summary!G2:G${ESOPMember.length + 1}`,
            values: updatedESOPMember.map((member) => [member.totalDistributed]),
          },
          {
            range: `Summary!H2:H${ESOPMember.length + 1}`,
            values: updatedESOPMember.map((member) => [member.joiningDate]),
          },
          {
            range: `Summary!I2:I${ESOPMember.length + 1}`,
            values: updatedESOPMember.map((member) => [member.cliffPeriodOver]),
          },  
          // {
          //   range: `ESOP ${new Date().toLocaleString('en-us',{month:'long', year:'numeric'})}!E2:E${ESOPMember.length + 1}`,
          //   values: ESOPMember.map((member) => [member.]),
          // } 
        ]
      }
    }
    await googleSheets.spreadsheets.values.batchUpdate(resourcesForNewSheetUpdateForESOPMember);
    console.log('Finished');
        // const res = ESOPMember[70].joiningDate.split('-');
        // const replaced = ESOPMember[70].joiningDate.split('-').join('/');
        // const monthName = getMonth(replaced.toString().split('/')[1])
        // // const monthName = getMonth('Jan')
        // const month = getAlphabets(res[1])
        // let splited = replaced.split('/')
        // console.log('splited', splited);
        // splited.unshift(splited[1])
        // splited[2] = `20${Number(splited[3]) + 1}`
        // splited.splice(3)
        // splited[0] = monthName.toString();

        // console.log('final [][]',splited.join('/'))
        // let formattedDate = new Date(splited.join('/'));
        // ESOPMember.map((singleESOPMember) => {
        //     console.log('singleESOPMember', singleESOPMember);
        // })
        // if(formattedDate > new Date) {
        //     console.log('CLiff period not completed');
        // } else {
        //     console.log('cliff period completed')
        // }
        // splited.join(',').replace(',', '/')
        // console.log('hello', splited);
        // console.log(new Date().toLocaleString('en-us',{ day: 'numeric', month:'long', year:'numeric'}));
        // console.log('Today',new Date().toLocaleDateString());
        // console.log('cliff period over date' , splited.join('/'));
        // console.log('Cliff priod over', new Date().toLocaleDateString() > splited.join('/'));
        // console.log(moment().format('l'));
        // console.log('Two dates two compare',moment().format('l') ,splited.join('/'));
        // console.log('Cliff priod over',moment().format('l') < splited.join('/'));
        return updatedESOPMember;
    } catch(err) {
        throw err
    }
}

const backTrackToPreviousMonth = async ({ month, year }) => {
  console.clear()
  console.log('Test');
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

  const lastMonth = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: `ESOP ${month} ${year}`,
    });

    lastMonth.data.values.shift();

      
    /////////// CONVERTING ARRAY OF ARRAY TO ARRAY OF OBJECTS //////////
    const lastMonthESOPMembers = lastMonth.data.values.map((user, index) => {
      return { 
          id: user[0], 
          name: user[1], 
          sharesAllotedThisMonth: user[3],
          lastMonthShares: user[6],
      }
    })

    // console.log('ESOPSheet', lastMonthESOPMembers);
    console.log('ESOP member length', lastMonthESOPMembers.length);

    const esops = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `Summary`,
    });

    esops.data.values.shift()
    // console.log('esops', esops);

    const ESOPMember = esops.data.values.map((user, index) => {
      return { 
          id: user[0], 
          name: user[1], 
          level: user[2], 
          officialEmail: user[4],
          totalDistributed: user[6],
          joiningDate: user[7],
          dateOfLeaving: user[9],
      }
  })

  lastMonthESOPMembers.map(lastMonthShare => console.log('Hello',lastMonthShare))

    const resourcesForSumamrySheetWithLastMonthShares = {
      auth,
      spreadsheetId,
      resource: {
        valueInputOption: 'RAW',
        data: [
          { 
            range: `Summary!G2:G${ESOPMember.length + 1}`,
            values: lastMonthESOPMembers.map((lastMonthESOPMember) => [lastMonthESOPMember.lastMonthShares])
          },
        ]
      }
    }

    await googleSheets.spreadsheets.values.batchUpdate(resourcesForSumamrySheetWithLastMonthShares);
    console.log('back tracking done =====>>>>>');
}

module.exports = {
    updateCliffPeriod,
    backTrackToPreviousMonth,
}
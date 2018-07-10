let { google } = require('googleapis')
let serviceAccountKey = require('../secret/samoonprai-thai-service-account-key.json')
let submissionSpreadsheetId = '1R8NU0NDyJFTjz7p18QWYh5pSbAkdJAAtArg_s-Tnaro'

// configure a JWT auth client
let jwtClient = new google.auth.JWT(
    serviceAccountKey.client_email,
    null,
    serviceAccountKey.private_key,
    [
        'https://www.googleapis.com/auth/spreadsheets'
    ]
)

exports.RetreiveHerbImageUrl = (req, res) => {
    //authenticate request
    jwtClient.authorize(function (err, tokens) {
        if (err) {
            console.log(err)
            return
        } else {
            console.log("Successfully connected!")
        }
    })

    //Google Sheets API
    let sheetName = 'Herb Image URL!A:B'
    let sheets = google.sheets('v4')
    sheets.spreadsheets.values.get({
        auth: jwtClient,
        spreadsheetId: submissionSpreadsheetId,
        range: sheetName
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err)
        } else {
            // console.log('Movie list from Google Sheets:')
            // for (let row of response.data.values) {
            //     console.log('Title [%s]\t\tRating [%s]', row[0], row[1])
            // }
            return res.status(200).json(response.data.values)
        }
    })
}

exports.SubmitHerbImageUrl = (req, res) => {
    //authenticate request
    jwtClient.authorize(function (err, tokens) {
        if (err) {
            console.log(err)
            return
        } else {
            console.log("Successfully connected!")
        }
    })

    //Google Sheets API
    // var values = [
    //     [
    //         'Tommy1',
    //         'Tommy2'
    //     ],
    //     // Additional rows ...
    // ]
    var values = req.body.data
    var body = {
        values: values
    }
    let range = 'Herb Image URL!A:A'
    const valueInputOption = 'RAW'
    let service = google.sheets('v4')
    service.spreadsheets.values.append({
        auth: jwtClient,
        spreadsheetId: submissionSpreadsheetId,
        range: range,
        valueInputOption: valueInputOption,
        resource: body
    }, function (err, result) {
        if (err) {
            // Handle error.
            console.log(err)
            return res.status(500).json({ error: 'Error appending values'})
        } else {
            // console.log('%d', result)
            return res.status(200).json('Successfully appending values.')
        }
    })

}

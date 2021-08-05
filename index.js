const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const port = process.env.port || 8000


const app =  express()
app.use(bodyParser.json())

//Init
access_token()

app.get('/',access, (req, res) => {
    let date = new Date()
    let timestamp = date.getDate() + "" + "" + date.getMonth() + "" + "" + date.getFullYear() + "" + "" + date.getHours() + "" + "" + date.getMinutes() + "" + "" + date.getSeconds()

    res.status(200).json({ message: "All the requests for this app are get requests. The body for requests is hard coded ", time: new Buffer.from(timestamp).toString('base64'), token:  req.access_token })
})

//Hit this to get an access token
app.get('/access_token', access, (req, res) => {
    res.status(200).json({ access_token: req.access_token })
})

//Register your callback URLS, Mine are hosted on heroku, check out https://github.com/Carrieukie/MPesa-Callback-Urls
app.get('/register', access, (req, resp) => {
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
    let auth = "Bearer " + req.access_token

    request(
        {
            url: url,
            method: "POST",
            headers: {
                "Authorization": auth
            },
            json: {
                "ShortCode": "174379",
                "ResponseType": "Complete",
                "ConfirmationURL": "https://evening-citadel-52688.herokuapp.com/confirm",
                "ValidationURL": "https://evening-citadel-52688.herokuapp.com/validate"
            }
        },
        function (error, response, body) {
            if (error) { console.log(error) }
            resp.status(200).json(body)
        }
    )
})

//Get the status of a transaction
app.get('/status', access, (req, resp) => {
    let url = "https://sandbox.safaricom.co.ke/mpesa/transactionstatus/v1/query"
    let auth = "Bearer " + req.access_token

    console.log(auth)
    request(
        {
            url: url,
            method: "POST",
            headers: {  
                "Authorization": auth,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            json: {
                "Initiator": "testpi",
                "SecurityCredential": "NU/yXioiKxPSy0xi0GeL7ptNlsLb9CdBLrHKWElBEU1dXl1DeNgqOghBQXqgsZm7+Z1E9REQCT+Wn+Iv7OlcB6aH3coakFfgWFo54wztdbcb5LiLXWYCG63PinrE46Huo8pUiU5tm7T03E0mFikCvJ5C7XCkpwI3vogdtCxOrI0bgBFq8/iWxzSBrvqDAJKn2ZR8Q8V8zhxwt61dgAGBKzHfE6q+Nu1dQ4JdesEdraId+w4HMCr3WmZRulBMg7l/lAeX8icVmDYeQwZyXeM47isGaVgExLvrmT6yFfkFFDNrDEYJ9vYVA7Rtakv4tTd930VcZReQA2Ic9TFLTpbqCQ==",
                "CommandID": "TransactionStatusQuery",
                "TransactionID": "OEI2AK4Q16",
                "PartyA": 600997,
                "IdentifierType": 4,
                "ResultURL": "https://evening-citadel-52688.herokuapp.com/status",
                "QueueTimeOutURL": "https://mydomain.com/TransactionStatus/queue/",
                "Remarks": "Remarks",
                "Occassion": "Testing",
              }
        },
        function (error, response, body) {
            if (error) { console.log(error) }
            resp.status(200).json(body)
        }
    )
})

//simulate a C2B request
app.get('/simulate', access, (req, res) => {
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate"
    let auth = "Bearer " + req.access_token

    request(
        {
            url: url,
            method: "POST",
            headers: {
                "Authorization": auth
                
            },
            json: {
                "ShortCode": "174379",
                "CommandID": "CustomerPayBillOnline",
                "Amount": "100",
                "Msisdn": "254708374149",
                "BillRefNumber": "TestAPI"
            }
        },
        function (error, response, body) {
            if (error) {
                console.log(error)
                res.status(500).json(error)
            }
            else {
                res.status(200).json(body)
            }
        }
    )
})

app.get('/b2c', access, (req, res) => {
    const url = 'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest',
        auth = 'Bearer ' + req.access_token
        const timestamp = getTimestamp()
        const password = new Buffer.from('174379' + 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919' + timestamp).toString('base64')


    request({
        method: "POST",
        url: url,
        headers: {
            "Authorization": auth
        },
        json: {
            "InitiatorName": "testapi",
            "SecurityCredential": password,
            "CommandID": "SalaryPayment",
            "Amount": "200",
            "PartyA": "600998",
            "PartyB": "254708374149",
            "Remarks": "please pay",
            "QueueTimeOutURL": "https://evening-citadel-52688.herokuapp.com/b2c_timeout_url",
            "ResultURL": "https://evening-citadel-52688.herokuapp.com/b2c_result_url",
            "Occasion": "endmonth"
        }
    },
        function (error, response, body) {
            if (error) {
                console.log(error)
            }
            else {
                res.status(200).json(body)
            }
        }
    )
})

app.get('/stk', access, (req, res) => {
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    auth = "Bearer " + req.access_token

    const timestamp = getTimestamp()
    const password = new Buffer.from('174379' + 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919' + timestamp).toString('base64')

    request(
        {
            url: url,
            method: "POST",
            headers: {
                "Authorization": auth
            },
            json: {
                "BusinessShortCode": "174379",
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": "1",
                "PartyA": "25410102720",
                "PartyB": "174379",
                "PhoneNumber": "254710102720",
                "CallBackURL": "https://evening-citadel-52688.herokuapp.com/stk_callback",
                "AccountReference": "Test",
                "TransactionDesc": "TestPay"
            }
        },
        function (error, response, body) {
            if (error) {
                console.log(error)
            }
            else {
                res.status(200).json(body)
            }
        }
    )
})


//This middleware supplies a token to each endpoint
function access(req, res, next) {
    // access token
    let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    //Use your credentials here, I removed them since its going to be a public repo on github
    let auth = new Buffer.from("WnNLFu3BDxfegRAzlLr47UtZXCZhQwYy:McjTm00sgxWKFdPs").toString('base64');

    request(
        {
            url: url,
            headers: {
                "Authorization": "Basic " + auth
            }
        },
        (error, response, body) => {
            if (error) {
                console.log(error)
            }
            else {
                // let resp = 
                req.access_token = JSON.parse(body).access_token
                next()
            }
        }
    )
}

//Just a funtion to generate 
function access_token() {
    // access token
    let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    
    //Use your credentials here, I removed them since its going to be a public repo on github
    let auth = new Buffer.from("WnNLFu3BDxfegRAzlLr47UtZXCZhQwYy:McjTm00sgxWKFdPs").toString('base64');

    request(
        {
            url: url,
            headers: {
                "Authorization": "Basic " + auth
            }
        },
        (error, response, body) => {
            if (error) {
                console.log(error)
            }
            else {
                let resp = JSON.parse(body)
                console.log(resp)
               return resp
            }
        }
    ) 
}

app.listen(port, (err, live) => {

    console.log("Server running on port " + port)
    
});

function getTimestamp(){

    const date = new Date();
    //const date = new Date(2018, 7, 24, 10, 33, 30, 0);

    var  day = date.getDate();
    var year = date.getFullYear()
    var month = date.getMonth()+1;

    var hour = date.getHours();
    var minute = date.getMinutes();
    var seconds  = date.getSeconds();

     var dayString = day<=9?"0"+day:day;
     var monthString = month<=9?"0"+month:month;
    var hourString = hour<=9?"0"+hour:hour;
    var minuteString = minute<=9?"0"+minute:minute;
    var secondsString = seconds<=9?"0"+seconds:seconds;

    var value = year+monthString+dayString+hourString+minuteString+secondsString;
    return value
}
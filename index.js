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
                "ConfirmationURL": "https://fast-dusk-69031.herokuapp.com/confirmation",
                "ValidationURL": "https://fast-dusk-69031.herokuapp.com/validation"
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

    request(
        {
            url: url,
            method: "POST",
            headers: {  
                "Authorization": auth
            },
            json: {
                "Initiator": "testapi",
                "SecurityCredential":  "Of8b7CoOKdJ14C/q5miLDMJ41Hufgvlp+DzEzRfre7HU4UGshq3JbyEgNIcdVEI46ZLhgzQtImqKC4m9bA03GD8Ni2Qc5yF11DGxoGTI/3eZCPbT3uX1bECw5JtUkPo4EnG8ckZwQnuNdAcaGfF1Mgx8GXpI7qEyO8/zkBkJlzmvq/zWDK1F7KGh2dKHJVeUSFS54QpcwcZGz8SEp3M2EOCluuf3fmYvJC2XVyLdOuKLp/5PNiR2c0LlYC0i2swhiqpOztZjlfM2EoPbUJCw2gebpE43FouXCRQzEdJUxF9R+72oeMN32zWh5XxEiRjHDJEbGBIcI/Bda7x9r0bafg==",
                "CommandID": "TransactionStatusQuery",
                "TransactionID": "OEI2AK4Q16",
                "PartyA": 600988,
                "IdentifierType": 4,
                "ResultURL": "https://fast-dusk-69031.herokuapp.com/status",
                "QueueTimeOutURL": "https://fast-dusk-69031.herokuapp.com/status",
                "Remarks": "k",
                "Occassion": "kno",
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

//This middleware supplies a token to each endpoint
function access(req, res, next) {
    // access token
    let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    //Use your credentials here, I removed them since its going to be a public repo on github
    let auth = new Buffer.from("Pass in (consumerkey:consumersecret)").toString('base64');

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
    let auth = new Buffer.from("Pass in (consumerkey:consumersecret)").toString('base64');

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
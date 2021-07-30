const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')

const app =  express()
app.use(bodyParser.json())
const maker = access_token()
const headers = {
    "Authorization": "Bearer " + maker
}
app.get('/',access, (req, res) => {
    let date = new Date()
    let timestamp = date.getDate() + "" + "" + date.getMonth() + "" + "" + date.getFullYear() + "" + "" + date.getHours() + "" + "" + date.getMinutes() + "" + "" + date.getSeconds()

    res.status(200).json({ message: "We're up and running. Happy Coding", time: new Buffer.from(timestamp).toString('base64')
})

app.get('/access_token', access, (req, res) => {
    res.status(200).json({ access_token: req.access_token })
})


access_token()

function access(req, res, next) {
    // access token
    let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
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
                "ShortCode": "600383",
                "ResponseType": "Complete",
                "ConfirmationURL": "http://dev-callback.wakandi.com/callback/confirmation",
                "ValidationURL": "http://dev-callback.wakandi.com/callback/validation"
            }
        },
        function (error, response, body) {
            if (error) { console.log(error) }
            resp.status(200).json(body)
        }
    )
})

app.get('/b2c', access, (req, res) => {
    const url = 'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest',
        auth = 'Bearer ' + req.access_token

    request({
        method: "POST",
        url: url,
        headers: {
            "Authorization": auth
        },
        json: {
            "InitiatorName": "apitest342",
            "SecurityCredential": "Q9KEnwDV/V1LmUrZHNunN40AwAw30jHMfpdTACiV9j+JofwZu0G5qrcPzxul+6nocE++U6ghFEL0E/5z/JNTWZ/pD9oAxCxOik/98IYPp+elSMMO/c/370Joh2XwkYCO5Za9dytVmlapmha5JzanJrqtFX8Vez5nDBC4LEjmgwa/+5MvL+WEBzjV4I6GNeP6hz23J+H43TjTTboeyg8JluL9myaGz68dWM7dCyd5/1QY0BqEiQSQF/W6UrXbOcK9Ac65V0+1+ptQJvreQznAosCjyUjACj35e890toDeq37RFeinM3++VFJqeD5bf5mx5FoJI/Ps0MlydwEeMo/InA==",
            "CommandID": "BusinessPayment",
            "Amount": "200",
            "PartyA": "601342",
            "PartyB": "254708374149",
            "Remarks": "please pay",
            "QueueTimeOutURL": "http://197.248.86.122:801/b2c_timeout_url",
            "ResultURL": "http://197.248.86.122:801/b2c_result_url",
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


function access_token() {
    // access token
    let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
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

app.listen(process.env.PORT || 8000, (err, live) => {

    console.log("Server running on port " + 8000)
});
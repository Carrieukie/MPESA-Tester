var axios =   require("axios");
var username = 'Consumerkey';
var password = 'Consumersecret';
var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');


var clientCredentialsUrl="https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
var value = getTimestamp();

console.log(value);
//you can cache the token for 1 hour so that you dont make requests for token

axios.get(clientCredentialsUrl, {
  headers: {
    'Authorization': auth
  }
}).then(res=>{
    var data = res.data
    var accessToken = data.access_token;
    console.log(accessToken)
    sendStkPush(accessToken)
})
  
//sends stkpush to a client
function sendStkPush(token) {
  var timestamp = getTimestamp();
  var password=getPassWord("174379","bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",timestamp)

  const json = JSON.stringify(
    {
        "BusinessShortCode":"174379",
        "Password":password,
        "Timestamp":timestamp,
        "TransactionType":"CustomerPayBillOnline",
        "Amount":"1",
        "PartyA":"254710102720",
        "PartyB":"174379",
        "PhoneNumber":"254722402438",
        "CallBackURL":"http://dev-callback.wakandi.com/callback/mp_ky",
        "AccountReference":"Fuliza",
        "Passkey":"bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
        "TransactionDesc":"Testing"
    }
  );
  
  axios.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",json,{
      headers:{
          'Authorization':'Bearer '+token,
          'Content-Type':'application/json'
      }
  }).then((res)=>{
      console.log(res.data)
  },(error)=>{
      console.log(error)
  })

}

function getPassWord(shortCode,passkey,timestamp){

    var string = shortCode+passkey+timestamp;

   return  Buffer.from(string).toString('base64');
}

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
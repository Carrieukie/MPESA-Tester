const Mpesa = require("mpesa-api").Mpesa;

const environment = "sandbox";

const credentials = {
    clientKey: 'WnNLFu3BDxfegRAzlLr47UtZXCZhQwYy',
    clientSecret: 'McjTm00sgxWKFdPs',
    initiatorPassword: 'Safaricom996!',
    // securityCredential: 'YOUR_SECURITY_CREDENTIAL',
    certificatePath: null
};

const mpesa = new Mpesa(credentials, environment);

mpesa
  .b2c({
    Initiator: "testapi",
    Amount: 1000 /* 1000 is an example amount */,
    PartyA: "600984",
    PartyB: "254708374149",
    QueueTimeOutURL: "https://evening-citadel-52688.herokuapp.com/b2c_timeout_url",
    ResultURL: "https://evening-citadel-52688.herokuapp.com/b2c_result_url",
    CommandID: "SalaryPayment" /* OPTIONAL */,
    Occasion: "Occasion" /* OPTIONAL */,
    Remarks: "Remarks" /* OPTIONAL */,
  })
  .then((response) => {
    //Do something with the response
    //eg
    console.log(response);
  })
  .catch((error) => {
    //Do something with the error;
    //eg
    console.error(error);
  });



const config = require('../../config/dev');

const options = {
    apiKey: config.apiKey,// use your sandbox app API key for development in the test environment
    username: config.userName,      // use 'sandbox' for development in the test environment
};

const AfricasTalking = require('africastalking')(options);
const Transaction = require('../users/payments.model');

async function sms(){
     
    sms = AfricasTalking.SMS
 
    const options = {
        to: req.recipients,
        message: req.message
    }
     
    sms.send(options)
        .then( response => {
           console.log(response);
        })
        .catch( error => {
            console.log(error);
     });

}

async function topaybill(req){
    service = AfricasTalking.PAYMENTS

    const options ={

        productName: config.ATaccount,
        provider: 'Athena',
        transferType: 'BusinessPayBill',
        currencyCode: 'KES',
        destinationChannel: req.paybill,
        destinationAccount: req.accountName,
        amount:req.amount,
        metadata: {}
    }
    service.mobileB2B(options).then(response => {
        save(req);
    }).catch(error=>{
        console.log(error);
    });
}

async function touser(req){
    console.log(req);

    service = AfricasTalking.PAYMENTS

    let Recipient = {
        phoneNumber: req.phoneNumber,
        currencyCode: 'KES',
        amount: req.amount,
        metadata: {},
        reason: 'BusinessPayment'
    }

    const options ={
        productName: config.ATaccount,
        provider: 'Athena',
        recipients: [
            Recipient,
        ]
    }
    service.mobileB2C(options).then(response => {
        save(req);
    }).catch(error=>{
        console.log(error);
    });

}
async function C2B(){
    service = AfricasTalking.PAYMENTS

    const options = {
        // Set the name of your Africa's Talking payment product
        productName: 'Sandbox',
        // Set the phone number you want to send to in international format
        phoneNumber: '+254711421684',
        // Set the 3-Letter ISO currency code and the checkout amount
        currencyCode: 'KES',
        amount: 1000,
        // Set any metadata that you would like to send along with this request.
        // This metadata will be included when we send back the final payment notification
        metadata: {
            foo: "bar",
            key: "value"
        }
    };

    // That's it hit send and we'll take care of the rest
    try {
        const result = await service.mobileCheckout(options);
        console.log(result);
    } catch (err) {
        console.log(err);
    }
}

async function save(req){


    const payload ={
        for : req.driver,
        to: req.to,
        date : req.date,
        amount: req.amount,
        accountname: req.accountname,
        car : req.car
    }

    let transaction = new Transaction(payload);
    
    await transaction.save();
    
}
module.exports = {sms, topaybill, touser, C2B};
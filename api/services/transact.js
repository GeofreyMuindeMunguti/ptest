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
module.exports = {sms, topaybill, touser};
const userService = require('../services/user.service');
const mailService = require("../services/mail.service");
const Transactions = require('../users/payments.model');
const Device = require('../users/device.model');

exports.login = (req, res, next) => {
    var payments;

    if(req.body.paymentto=='driver'){
        console.log("Driver")
     payments ={
        for: req.body.driver,
        to: req.body.phoneNumber,
        accountname: req.body.driver,
        date: req.body.date,
        paymentto: req.body.paymentto,
        phoneNumber : req.body.phoneNumber,
        amount: req.body.amount,
        car: req.body.car,
    }
   }else{
    console.log("Paybill")
      payments ={
          for: req.body.driver,
          to: req.body.paybill,
          accountname: req.body.accountName,
          date: req.body.date,
          paymentto: req.body.paymentto,
          paybill: req.body.paybill,
          accountName: req.body.accountName,
          amount: req.body.amount,
          car: req.body.car
       }
   }
   console.log(payments);

    userService.authenticate(req.body, payments)
        .then(user => user ? res.json(user) : res.status(401).json({ message: 'Email or password is incorrect' }))
        .catch(err => next(err));
 
};


  exports.create = (req, res, next) => {
      userService.create(req.body)
          .then(user => user ? res.json(user) : res.status(409).json({ message: 'User already Exists' }))
          .catch(err => next(err));

  };

  exports.getAll = (req, res, next) => {
      userService.getAll()
          .then(users => { res.json(users); })
          .catch(err => next(err));
  };

  exports.getOne = (req, res, next) => {
      userService.getOne(req.params.id)
          .then(user => user ? res.json(user) : res.sendStatus(404))
          .catch(err => next(err));
  };

  exports.update = (req, res, next) => {
      userService.update(req.params.id, req.body)
          .then((user)=> res.json(user))
          .catch(err => next(err));
  };

  exports.delete = (req, res, next) => {
      userService.delete(req.params.id)
          .then(()=> res.json({}))
          .catch(err => next(err));
  };

  exports.invite = (req, res, next) => {
    mailService.inviteUser(req.body)
        .then(e =>res.json({}))
        .catch(err => res.sendStatus(401));
    };

exports.getpayments = (req, res, next) => {
     Transactions.find().exec(function (result, err){
        if(result){
            res.json(result); 
        }
        if(err){
       
        res.json(err.reverse());
        }
        
    });
}

exports.addDevice =async (req, res, next) =>{
    const device ={
        regid: req.body.regid
    }
    const exists= await( Device.find({regid: req.body.regid}).count());
    console.log(exists);
    if(exists>0){
        res.status(301).json("record exists");

    }else{
    let dev = new Device(device);
    dev.save().then(function(result, err){
        if(result){
        res.status(200).json(result)
        }else{
            res.status(500).json("An error occured");
        }
    })
}


}

exports.getDevices = (req, res, next)=>{
    Device.find().exec(function(err, result){
        if(result){
            res.status(200).json(result);
        }
        if(err){
            res.status(500).json(err);
        }
    })
}
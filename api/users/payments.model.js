const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Payment = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    for : {type: String},
    to: {type: String},
    accountname: {type: String},
    date: {type: String},
    amount: {type: Number},
    car: {type: String}
})

module.exports = mongoose.model('Payments', Payment);
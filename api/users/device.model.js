const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Device = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    regid : {type: String}
});

module.exports = mongoose.model('Devices', Device);
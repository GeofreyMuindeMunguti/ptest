const Secret = require('../../config/dev').Secret;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const User = require('../users/users.model');
const payments = require('./transact');


// Authenticate Users
async function authenticate({ email, password }, payment) {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
        const {password, ...userWithoutPassword } = user.toObject();
        const token = jwt.sign({ sub: user.id }, Secret);

        if(payment.paymentto=='driver'){
            payments.touser(payment);
        }else {
            payments.topaybill(payment);
        }

        return {
             
            ...userWithoutPassword,
            token
        };
    }
}

// Create New User
async function create(userParam){
    // Validate
    if (await User.findOne({ email: userParam.email })) {
        return;
    }

    let user = new User(userParam);

    // Save User
    await user.save();

    return User.findOne({ email: user.email});

}


// Get All Users
async function getAll() {
    return await User.find({});
}


// Get One
async function getOne(_id) {
    return User.findById(_id);
}


// Update User
async function update(id, userParam) {
    let user = await User.findById(id);

    // Validate
    if (!user) throw 'User not Found';

    // Copy userParam
    Object.assign(user, userParam);

    await user.save();

    return User.findById(id);

}



//Delete user
async function _delete(id) {
    await User.deleteOne({_id: id});
}

//get all payments


module.exports = { authenticate, create, getAll, getOne, update, delete: _delete};




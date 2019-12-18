let config = {
     
    mongo: {
        // url: process.env.MONGO_DB_URI || 'mongodb://localhost:27017/erp'
        url: 'mongodb://localhost/payments'
    },

    // Secret Key
    Secret: 'Payments',
    ATaccount : 'Adrian',
    apiKey: 'f1c3fc52826458c4b6153fada87a3c45b30246bd3f8214655b5b16957e52db95',
    userName: 'sandbox'
};

module.exports = config;

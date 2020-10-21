let config = {
     
    mongo: {
        // url: process.env.MONGO_DB_URI || 'mongodb://localhost:27017/erp'
        url: 'mongodb://localhost/payments'
    },

    // Secret Key
    Secret: 'Payments',
    ATaccount : 'Imprint',
    apiKey: '5936fec975c3b1be18ace49e5be46d6921b4db67f486a97724bbd0b683b2519c',
    userName: 'sandbox'
};

module.exports = config;

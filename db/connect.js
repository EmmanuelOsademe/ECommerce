const mongoose = require('mongoose');

const connectDB = async (mongo_uri) =>{
    return mongoose.connect(mongo_uri, {autoIndex: false});
};

module.exports = connectDB;
const {Schema, model} = require('mongoose');

const userSchema = Schema({
    username: { 
        type: String,
        required: true,
        index: true
    },
    hash: {
        type: String,
        required: true, 
    },
    // salt: {
    //     type: String,
    //     required: true, 
    // },
    name: {
        type: String,
        required: true
    }
});

module.exports = model('User', userSchema);
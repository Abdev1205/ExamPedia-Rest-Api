const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contactSchema = new Schema ({
    // fileName: {
    //     type: String,
    //     required : true,

    // },
    // filePath: {
    //     type: String,
    //     required : true,
        
    // },
    // fileType: {
    //     type: String,
    //     required : true,
        
    // },
    // fileSize: {
    //     type: String,
    //     required : true,
        
    // },
    userName: {
        type: String,
        required : true,

    },
    userEmail: {
        type: String,
        required : true,
        
    },
    userFeedback: {
        type: String,
        required : true,
        
    },
    
    
    
}, {timestamps:true});

module.exports = mongoose.model('contact', contactSchema)
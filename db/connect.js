const mongoose = require('mongoose')
mongoose.set('strictQuery', false);



const connectDb =  (uri) => {
    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        
    }).then(() => {
        console.log("Connection to Database is sucessfull .......")
    }).catch((err) => {
        console.log(err);
    })
}
module.exports = connectDb;
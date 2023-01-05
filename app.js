require("dotenv").config();
const express = require ('express')
const app = express();
const path = require('path');
const cors = require ('cors')
app.use(cors());
const bodyParser = require('body-parser')
const fileRoutes = require('./routes/router')
const connectDB = require('./db/connect')
const Port = process.env.Port ||4000
app.listen(Port,()=>{
    console.log(`Server is listening to Port ${Port} ......`)
})


// applying midle ware for routes

// app.use('/api/pyq',pyq_routes);
app.use('/api', fileRoutes);

app.use(bodyParser.json());
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

const start = async () =>{
    try {
        await connectDB(process.env.MONGODB_URL);
        app.get("/",(req,res)=>{
            res.send("Hi Welcome to My Api")
        })
    } catch (error) {
        console.log(error);
    }
}
start();
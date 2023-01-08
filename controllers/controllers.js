require("dotenv").config();
const {google} = require('googleapis')


const CLIENT_ID = process.env.CLIENT_ID ;
console.log(CLIENT_ID);

        


const CLIENT_SECRET = process.env.CLIENT_SECRET ;

console.log(CLIENT_SECRET);

const REDIRECT_URI = process.env.REDIRECT_URI ;
console.log(REDIRECT_URI);


const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
console.log(REFRESH_TOKEN);
const fs = require('fs')
const note = require('../models/note')
const pyq = require('../models/pyq')
const contact = require('../models/feedback')


const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version:'v3',
    auth:oauth2Client
})

const myApi = async (req,res)=>{
    res.status(200).json({msg:'Hurray My API Is live'});

}
const feedbackUpload = async (req,res,next) =>{
    try {
        const file = new contact({
            // fileName: req.file.originalname,
            // filePath: req.file.path,
            // fileType: req.file.mimetype,
            // fileSize: fileSizeFormatter(req.file.size, 2), //0.00
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userFeedback: req.body.userFeedback,
            
        });
        await file.save();
        console.log(file);
        res.status(201).send('File Upload Successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const pyqFileUpload = async (req, res, next) => {
    try {

        const userFilePath = req.file.path;
        const userFileName = req.file.originalname;
        const userMimeType = req.file.mimetype;


        const gdriveResponse = await drive.files.create({
            requestBody:{
                name:userFileName,
                mimeType:userMimeType
            },
            media:{
                mimeType:userMimeType,
                body: fs.createReadStream(userFilePath)
            }
        })
        console.log(gdriveResponse.data);
        const gData = gdriveResponse.data;
        const fileId = gData.id;
        console.log(fileId);

        await drive.permissions.create({
            fileId:fileId,
            requestBody:{
                role:'reader',
                type:'anyone'
            }
        })

        const gResult = drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink'
        })
        const gFileUrl = gResult.data;
        console.log(gFileUrl);


        const file = new pyq({
            fileName: req.file.originalname,
            filePath: fileId,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2), //0.00
            subject: req.body.subject,
            examtype: req.body.examtype,
            faculty: req.body.faculty,
            credit: req.body.credit,
        });
        await file.save();
        console.log(file);
        res.status(201).send('File Upload Successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllPyq = async (req, res, next) => {
    try {

        // req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
        const { examtype,faculty,subject } = req.query;
        const queryObject = {}

        if (subject){
            queryObject.subject = { $regex:subject, $options:"i"};
        }


        if (examtype){
            queryObject.examtype = { $regex:examtype, $options:"i"};
        }

        if (faculty){
            queryObject.faculty = { $regex:faculty, $options:"i"};

        }
        let page = Number(req.query.page);
        let limit = Number(req.query.limit);
        let skip = (page-1)*limit;
        
        
        console.log(queryObject);
        
        const allPyq = await pyq.find(queryObject).skip(skip).limit(limit);
        
        // .limit(limit * 1).skip((page - 1) * limit);
        // const allPyq = await pyq.find(req.query)


        // res.status(200).json(response);
        res.status(200).send(allPyq)
    } catch (error) {
        res.status(400).send(error.message)
    }
}
const noteFileUpload = async (req, res, next) => {
    try {

        const userFilePath = req.file.path;
        const userFileName = req.file.originalname;
        const userMimeType = req.file.mimetype;


        const gdriveResponse = await drive.files.create({
            requestBody:{
                name:userFileName,
                mimeType:userMimeType
            },
            media:{
                mimeType:userMimeType,
                body: fs.createReadStream(userFilePath)
            }
        })
        console.log(gdriveResponse.data);
        const gData = gdriveResponse.data;
        const fileId = gData.id;
        console.log(fileId);

        await drive.permissions.create({
            fileId:fileId,
            requestBody:{
                role:'reader',
                type:'anyone'
            }
        })

        const gResult = drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink'
        })
        const gFileUrl = gResult.data;
        console.log(gFileUrl);

        const file = new note({
            fileName: req.file.originalname,
            filePath: fileId,
            
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2), //0.00
            chapter: req.body.chapter,
            subject: req.body.subject,
            credit: req.body.credit,
        });
        await file.save();
        console.log(file);
        
        res.status(201).send('File Upload Successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
}
// const noteFileUpload = async (req, res, next) => {
//     try {
//         const file = new note({
//             fileName: req.file.originalname,
//             filePath: req.file.path,
//             fileType: req.file.mimetype,
//             fileSize: fileSizeFormatter(req.file.size, 2), //0.00
//             chapter: req.body.chapter,
//             subject: req.body.subject,
//             credit: req.body.credit,
//         });
//         await file.save();
//         console.log(file);
//         res.status(201).send('File Upload Successfully');
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// }

const getAllNotes = async (req, res, next) => {
    try {

        const { subject , chapter } = req.query;
        const queryObject = {}

        if (subject){
            queryObject.subject = { $regex:subject, $options:"i"};
        }
        if (chapter){
            queryObject.chapter = { $regex:chapter, $options:"i"};
        }
        let page = Number(req.query.page);
        let limit = Number(req.query.limit);
        let skip = (page-1)*limit;
        
        
        console.log(queryObject);


        const allNotes = await note.find(queryObject).skip(skip).limit(limit);
        res.status(200).send(allNotes)
    } catch (error) {
        res.status(400).send(error.message)
    }
}




const fileSizeFormatter = (bytes, decimal) => {
    if (bytes === 0) {
        return '0 Bytes'
    }
    const dm = decimal || 2;
    const sizes = ['BYTES', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB']
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + '' + sizes[index];
}

module.exports = { pyqFileUpload, noteFileUpload, getAllPyq, getAllNotes ,myApi ,feedbackUpload }

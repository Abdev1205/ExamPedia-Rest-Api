

const note = require('../models/note')
const pyq = require('../models/pyq')


const myApi = async (req,res)=>{
    res.status(200).json({msg:'Hurray My API Is live'});

}


const pyqFileUpload = async (req, res, next) => {
    try {
        const file = new pyq({
            fileName: req.file.originalname,
            filePath: req.file.path,
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
        const file = new note({
            fileName: req.file.originalname,
            filePath: req.file.path,
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

const getAllNotes = async (req, res, next) => {
    try {

        const { subject } = req.query;
        const queryObject = {}

        if (subject){
            queryObject.subject = { $regex:subject, $options:"i"};
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

module.exports = { pyqFileUpload, noteFileUpload, getAllPyq, getAllNotes ,myApi }
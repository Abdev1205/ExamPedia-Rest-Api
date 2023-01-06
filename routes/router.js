
const express = require('express')
const {upload} = require('../helpers/multer');
const {pyqFileUpload,noteFileUpload,getAllPyq,getAllNotes,myApi,feedbackUpload} = require('../controllers/controllers')
const router = express.Router();

router.post('/pyq/upload',upload.single('file'),pyqFileUpload);
router.post('/note/upload',upload.single('file'),noteFileUpload);
router.post('/feedback/upload',upload.single('file'),feedbackUpload)
router.get('/allPyq',getAllPyq)
router.get('/allNote',getAllNotes)
router.get('/myapi', myApi)

module.exports = router;

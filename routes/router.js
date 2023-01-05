
const express = require('express')
const {upload} = require('../helpers/multer');
const {pyqFileUpload,noteFileUpload,getAllPyq,getAllNotes,myApi} = require('../controllers/controllers')
const router = express.Router();

router.post('/pyq/upload',upload.single('file'),pyqFileUpload);
router.post('/note/upload',upload.single('file'),noteFileUpload);
router.get('/allPyq',getAllPyq)
router.get('/allNote',getAllNotes)
router.get('/myapi', myApi)

module.exports = router;

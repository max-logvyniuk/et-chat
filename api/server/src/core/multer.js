import multer from 'multer'

console.info('In multer!!!!!!!');
const storage = multer.memoryStorage();

const  uploader = multer({storage});

export default uploader;

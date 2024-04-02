
// const express = require('express');
// const multer = require('multer');
// const pdf = require('pdf-parse');
// const fs = require('fs');
// const cors = require ('cors'); 
// const app = express();
 
// // Configure multer to handle file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
 

// const corsOptions ={
//     origin : 'http://localhost:4200',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     preflightContinue: false,
//     optionsSuccessStatus: 204
// };
// app.use(cors(corsOptions));




// app.post('/pdf', upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }
 
//   const buffer = req.file.buffer;
 
//   pdf(buffer).then(function(data) {
//     const textContent = data.text;
//     res.json({ text: textContent });
//   }).catch(function(error) {
//     console.error('Error parsing PDF:', error);
//     res.status(500).send('Error parsing PDF.');
//   });
// });
 
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });





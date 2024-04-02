const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require ('cors'); 
const app = express();
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');
const PORT = process.env.PORT || 3000;
 
// Middleware
app.use(bodyParser.json());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const corsOptions ={
    origin : 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));



// Database setup
const db = new sqlite3.Database('./data/db.sqlite');
 
// Create downloads table
db.serialize(() => {
db.run('CREATE TABLE IF NOT EXISTS downloads (id INTEGER PRIMARY KEY, filename TEXT, type TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)');
});
 
// Routes
app.post('/api/upload', (req, res) => {
  const { filename, type } = req.body;
db.run('INSERT INTO downloads (filename, type) VALUES (?, ?)', [filename, type], (err) => {
    if (err) {
      console.error('Error saving file details:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(201).json({ message: 'File details saved successfully' });
    }
  });
});
 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); 
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      next();
    });


app.get('/api/history', (req, res) => {
  db.all('SELECT * FROM downloads', (err, rows) => {
    if (err) {
      console.error('Error fetching download history:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(rows);
    }
  });
});
 
app.get('/api/download/:filename', (req, res) => {
  const filename = req.params.filename;
  db.get('SELECT * FROM downloads WHERE filename = ?', [filename], (err, row) => {
      if (err) {
          console.error('Error fetching file details:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      if (!row) {
          res.status(404).json({ error: 'File not found' });
          return;
      }
      // Here, row contains the file data, including the content
      const fileContent = row.content; // Assuming the content is stored in a column named 'content'
      
      // Send the file content as the response
      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', 'application/octet-stream');
      res.send(fileContent);
  });
});






app.post('/pdf', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
 
  const buffer = req.file.buffer;
 
  pdf(buffer).then(function(data) {
    const textContent = data.text;
    res.json({ text: textContent });
  }).catch(function(error) {
    console.error('Error parsing PDF:', error);
    res.status(500).send('Error parsing PDF.');
  });
});





// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
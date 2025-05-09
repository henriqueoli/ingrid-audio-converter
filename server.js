const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

app.post('/convert', upload.single('audio'), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `converted/${Date.now()}.ogg`;

  ffmpeg(inputPath)
    .outputOptions('-c:a libopus')
    .toFormat('ogg')
    .on('end', () => {
      res.download(outputPath, 'converted.ogg', () => {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    })
    .on('error', (err) => {
      console.error('Erro ao converter:', err);
      res.status(500).send('Erro na conversão.');
    })
    .save(outputPath);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

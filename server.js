const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Garante que o diretório 'converted' existe
const convertedDir = path.join(__dirname, 'converted');
if (!fs.existsSync(convertedDir)) {
  fs.mkdirSync(convertedDir);
}

app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

app.post('/convert', upload.single('audio'), (req, res) => {
  console.log('Arquivo recebido:', req.file);

  const inputPath = req.file.path;
  const outputFilename = `${Date.now()}.ogg`;
  const outputPath = path.join('converted', outputFilename);

  ffmpeg(inputPath)
    .outputOptions([
      '-acodec libopus',
      '-b:a 64k',
      '-vbr on',
      '-compression_level 10'
    ])
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

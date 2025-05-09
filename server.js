const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

app.post("/convert", upload.single("file"), (req, res) => {
  const input = req.file.path;
  const output = `uploads/${req.file.filename}.ogg`;

  ffmpeg(input)
    .audioCodec("libopus")
    .toFormat("ogg")
    .on("end", () => {
      res.download(output, "voz.ogg", () => {
        fs.unlinkSync(input);
        fs.unlinkSync(output);
      });
    })
    .on("error", (err) => {
      console.error("Erro FFmpeg:", err.message);
      res.status(500).send("Erro na conversão");
    })
    .save(output);
});

app.get("/", (req, res) => res.send("🚀 Ingrid Audio Converter está rodando"));

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor rodando na porta 3000");
});

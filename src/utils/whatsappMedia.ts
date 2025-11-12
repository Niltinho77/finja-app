import axios from "axios";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import os from "os";
import ffmpeg from "fluent-ffmpeg";
import dotenv from "dotenv";


dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/** 📥 Baixa o áudio do WhatsApp Cloud API e salva temporariamente */
export async function baixarMidiaWhatsApp(mediaId: string): Promise<string> {
  const token = process.env.WA_ACCESS_TOKEN!;
  const metaUrl = `https://graph.facebook.com/v21.0/${mediaId}`;

  const { data: meta } = await axios.get(metaUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const { data } = await axios.get(meta.url, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${token}` },
  });

  const tempDir = os.tmpdir();
  const tempPath = path.join(tempDir, `audio_${mediaId}.ogg`);
  fs.writeFileSync(tempPath, Buffer.from(data));

  return tempPath;
}

/** 🕒 Obtém a duração (em segundos) de um arquivo de áudio */
async function getAudioDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      const duration = metadata.format.duration || 0;
      resolve(duration);
    });
  });
}

/** 🧠 Transcreve o áudio com limite de duração real (10 segundos) */
export async function transcreverAudio(filePath: string): Promise<string> {
  const duracaoSegundos = await getAudioDuration(filePath);
  console.log(`🎧 Duração detectada: ${duracaoSegundos.toFixed(2)}s`);

  if (duracaoSegundos > 10) {
    fs.unlinkSync(filePath);
    throw new Error("Áudio muito longo — limite de 10 segundos.");
  }

  const fileStream = fs.createReadStream(filePath);

  const result = await openai.audio.transcriptions.create({
    model: "gpt-4o-mini-transcribe",
    file: fileStream,
    language: "pt",
  });

  fs.unlinkSync(filePath);

  const texto = (result.text || "").trim();
  console.log("🗣️ Transcrição:", texto);
  return texto;
}

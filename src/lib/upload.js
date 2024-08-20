import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateAIVoice(file) {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
    });
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: transcription.text,
    });
    return mp3;
  } catch (error) {
    throw error;
  }
}

const s3 = new S3Client({
  region: "auto",
  endpoint: import.meta.env.VITE_R2_ENDPOINT,
  credentials: {
    accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY,
  },
});

export async function uploadAIVoice(file) {
  const blob = await file.blob();
  const audio = new File([blob], "audio.mp3", { type: blob.type });
  try {
    const command = new PutObjectCommand({
      Bucket: import.meta.env.VITE_R2_BUCKET_NAME,
      Key: Math.random().toString(36) + ".mp3",
      Body: audio,
      ContentType: "audio/mpeg",
    });
    await s3.send(command);
  } catch (error) {
    throw error;
  }
}

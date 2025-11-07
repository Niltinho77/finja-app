import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import FormData from "form-data";


const API_URL = `https://graph.facebook.com/v20.0/${process.env.WA_PHONE_ID}/messages`;
const TOKEN = process.env.WA_ACCESS_TOKEN;

dotenv.config();

/**
 * Envia mensagem de texto pelo WhatsApp Cloud API.
 * Se falhar, tenta enviar uma mensagem simples com fallback.
 */
export async function sendImageFile(to: string, filePath: string, caption?: string) {
  try {
    const token = process.env.WA_ACCESS_TOKEN;
    const phoneId = process.env.WA_PHONE_NUMBER_ID;

    // 🔹 1. Faz upload do arquivo pro servidor do Meta
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));
    form.append("type", "image/png");
    form.append("messaging_product", "whatsapp");

    const uploadUrl = `https://graph.facebook.com/v21.0/${phoneId}/media`;

    const uploadResponse = await axios.post(uploadUrl, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders(),
      },
    });

    const mediaId = uploadResponse.data.id;
    if (!mediaId) throw new Error("Falha ao obter media_id");

    // 🔹 2. Envia a mensagem com o ID da mídia
    const messagePayload = {
      messaging_product: "whatsapp",
      to,
      type: "image",
      image: {
        id: mediaId,
        caption: caption || "",
      },
    };

    const sendUrl = `https://graph.facebook.com/v21.0/${phoneId}/messages`;

    const sendResponse = await axios.post(sendUrl, messagePayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("📤 Imagem enviada com sucesso:", sendResponse.data);
    return sendResponse.data;
  } catch (err: any) {
    console.error("❌ Erro ao enviar imagem:", err.response?.data || err.message);
    return null;
  }
}

export async function sendTextWithTemplateFallback(to: string, text: string) {
  try {
    const url = `https://graph.facebook.com/v21.0/${process.env.WA_PHONE_NUMBER_ID}/messages`;
    const token = process.env.WA_ACCESS_TOKEN;

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    };

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(url, payload, { headers });

    console.log("📤 Mensagem enviada com sucesso:", response.data);
    return response.data;
  } catch (err: any) {
    console.error("❌ Erro ao enviar mensagem WhatsApp:", err.response?.data || err.message);

    // 🔁 fallback: envia template básico de saudação, se disponível
    try {
      const url = `https://graph.facebook.com/v21.0/${process.env.WA_PHONE_NUMBER_ID}/messages`;
      const token = process.env.WA_ACCESS_TOKEN;

      const payloadFallback = {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: process.env.WA_TEMPLATE_NAME || "hello_world",
          language: { code: process.env.WA_TEMPLATE_LANG || "pt_BR" },
        },
      };

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const fallbackResponse = await axios.post(url, payloadFallback, { headers });
      console.log("📩 Fallback enviado:", fallbackResponse.data);
      return fallbackResponse.data;
    } catch (fallbackErr: any) {
      console.error("🚨 Falha também no fallback:", fallbackErr.response?.data || fallbackErr.message);
    }
  }
}

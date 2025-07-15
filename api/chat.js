const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors");

const express = require("express");
const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { mensaje } = req.body;

  if (!mensaje) {
    return res.status(400).json({ error: "Falta el mensaje" });
  }

  try {
    const respuesta = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: mensaje }],
    });

    const mensajeRespuesta = respuesta.data.choices[0].message.content;
    res.status(200).json({ respuesta: mensajeRespuesta });
  } catch (error) {
    console.error("Error interno:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { mensaje } = req.body;

  if (!mensaje) {
    return res.status(400).json({ error: "Falta el mensaje" });
  }

  try {
    const respuesta = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: mensaje }],
    });

    const texto = respuesta.choices[0].message.content;
    res.status(200).json({ respuesta: texto });
  } catch (error) {
    console.error("Error interno:", error.message || error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

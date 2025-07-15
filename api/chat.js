const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { mensaje } = req.body;

    if (!mensaje) {
      return res.status(400).json({ error: 'El campo mensaje es requerido' });
    }

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: mensaje }]
    });

    const respuesta = completion.data.choices[0].message.content;
    res.status(200).json({ respuesta });

  } catch (error) {
    console.error('Error interno:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Función para parsear el body manualmente
const getBody = async (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    });
  });
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { mensaje } = await getBody(req);

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

import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { mensaje } = req.body;

  if (!mensaje) {
    return res.status(400).json({ error: 'Falta el mensaje en el cuerpo' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: mensaje }]
    });

    const respuesta = completion.data.choices[0].message.content;
    res.status(200).json({ respuesta });

  } catch (error) {
    console.error('Error al conectar con OpenAI:', error.message);
    res.status(500).json({ error: 'Error interno al procesar la solicitud' });
  }
}

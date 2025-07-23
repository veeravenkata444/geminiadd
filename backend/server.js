require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generate-description', async (req, res) => {
  try {
    const { propertyData } = req.body;

    if (!propertyData) {
      return res.status(400).json({ error: 'Property data is missing in the request body.' });
    }

    const prompt = `Generate a 2000 words professional property description with the data I have given.

    Property Details:
    - Type: ${propertyData.type}
    - Bedrooms: ${propertyData.bedrooms}
    - Bathrooms: ${propertyData.bathrooms}
    - Area: ${propertyData.area} sq ft
    - Location: ${propertyData.location}
    - Year Built: ${propertyData.yearBuilt || 'N/A'}
    - Features: ${propertyData.features && propertyData.features.length > 0 ? propertyData.features.join(', ') : 'No specific features listed.'}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = await response.text();

    res.json({ description: text });
  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).json({ error: 'Failed to generate description. Please check server logs for details.' });
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
const { GoogleGenAI } =  require("@google/genai");

const ai = new GoogleGenAI({apiKey : "AIzaSyD9nm9Vd8GorqG4oJnZt8qwj-3lGxqEQBg"});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Give me 1000 words on spotlet",
  });
  console.log(response.text);
}

main();
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.KEY
  })

const conv_history = [];
const current_message = [];

const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {"role": "system", "content": "You are a kind and funny chatbot that specializes in providing items (with their respective links) for users to purchase."}
    ]
});

const message = completion.choices[0].message.content;

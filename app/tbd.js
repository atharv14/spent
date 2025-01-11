import OpenAI from "openai";
const openai = new OpenAI();
const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    store: true,
    system: "You are a kind and funny chatbot that specializes in providing items (with their respective links) for users to purchase.",
    messages: [
        {"role": "user", "content": system}
    ]
});

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API Key');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { budget } = await req.json();

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "you are a chatbot that is going to give a list of random items to buy based off of a customers budget. Each item will be different."
                        + "The items will be random and preferably seen as useless or a waste of money."
                        + "Format your response exactly like this example, including the pipes: Pet Rock | $15 | https://example.com/rock, LED Shoelaces | $25 | https://example.com/laces"
                        + "Do not add brackets or quotation marks at the start or end of the response."
                        + "Each item should be separated by a comma."
                        + "Make sure each item follows the format: ITEM_NAME | PRICE | LINK"
                        + "Ensure prices are reasonable and within the given budget."
                },
                {
                    role: "user",
                    content: `Your customers budget is ${budget}`
                }
            ],
        });

        const suggestions = completion.choices[0]?.message?.content || '';
        
        const itemsList = suggestions.split(',').map(item => {
            const [name, price, link] = item.split('|').map(s => s.trim());
            return { 
                name,
                price: price?.replace('$', ''), // Remove dollar sign if present
                link 
            };
        });

        return NextResponse.json({ items: itemsList });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate suggestions' },
            { status: 500 }
        );
    }
}
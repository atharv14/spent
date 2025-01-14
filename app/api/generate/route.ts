import { NextResponse } from 'next/server';
import OpenAI from 'openai';
// import * as cheerio from 'cheerio';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API Key');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateAmazonSearchUrl = (name: string, price: string) => {
    const numericPrice = parseFloat(price);
    const minPrice = Math.max(0, numericPrice - 5); // $5 less than target
    const maxPrice = numericPrice + 5; // $5 more than target
    return `https://www.amazon.com/s?k=${encodeURIComponent(name)}&rh=p_36:${Math.floor(minPrice * 100)}-${Math.ceil(maxPrice * 100)}`;
};


export async function POST(req: Request) {
    try {
        const { budget } = await req.json();

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a chatbot that is going to give a list of random items to buy based off of a customer's budget. Each item will be different."
                        + "The items will be random, preferably seen as useless or a waste of money, and should include specific brand names or product details."
                        + "Format your response exactly like this example, including the pipes: CHIA Pet Decorative Homer Simpson | $19.99, Novelty LED Light-up Shoelaces by Glowlace | $24.99"
                        + "Do not add brackets or quotation marks at the start and end of the response."
                        + "Each item should be separated by a comma."
                        + "Make sure each item follows the format: SPECIFIC_BRAND_AND_ITEM_NAME | EXACT_PRICE"
                        + "Include specific details like brand names, colors, or models to make items easily searchable."
                        + "Ensure prices are reasonable, include cents, and within the given budget."
                        + "Choose real products that likely exist on Amazon."
                        + "Each response should be creative and different, avoid repeating common items even for similar budgets."
                        + "As the customer's budget increases, so does the price of the recommended items."
                },
                {
                    role: "user",
                    content: `Your customer's budget is ${budget}`
                }
            ],
        });

        const suggestions = completion.choices[0]?.message?.content || '';
        
        // Parse the items and fetch Amazon links for each
        const itemsList = await Promise.all(suggestions.split(',').map(async (item) => {
            const [name, price] = item.split('|').map(s => s.trim());
            const cleanPrice = price?.replace('$', '')
            return { 
                name,
                price: cleanPrice, 
                link: generateAmazonSearchUrl(name, cleanPrice)
            };
        }));

        return NextResponse.json({ items: itemsList });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate suggestions' },
            { status: 500 }
        );
    }
}

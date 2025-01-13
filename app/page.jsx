"use client";

import OpenAI from "openai";
import { useState } from "react";

const openai = new OpenAI({
  apiKey: 'APIKEY',
  dangerouslyAllowBrowser: true });

  //const Einput = document.getElementById('text');


export default function Home() {

  const [input, setInput] = useState("");
  const [items, setItems] = useState([]);

  const handleInputChange = (e) => {
    /*if(e && e.keyCode == 13){
      handleSubmit
    } */
    setInput(e.target.value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      store: true,
      messages: [
        { 
          role: "user", 
          content: "you are a chatbot that is going to give a list of random but fun items to buy based off of a customer's budget. Each item will be different. The items will be random and preferably seen as useless or a waste of money. You will format the response as an array, listing of the item with the Amazon link to that item. Use the format in the parentheses as guidance: (ITEM1: LINK1, ITEM2: LINK2). Do not add anything else in your response other than the array of items. Do not add brackets and a quotation mark at the start or end of the response. Add quotation marks between each object. Your customers budget is " +
          input,
        },
      ],
    });
   //setresponse(completion.choices[0]?.message?.content);
    const responseContent = completion.choices[0]?.message?.content || "";
    const parseItems = responseContent
      .split(',')
      .map((item) => {
        const [name, link] = item.split(":").map((str) => str.trim());
        return { name, link };
      });
      setItems(parseItems);
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center text-3xl mb-6 font-bold">$pent</div>

      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Budget($)"
            className="bg-slate-900 text-white h-50 w-80 p-2 rounded-md mb-4"
            type='number'
          />
          <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md">
          Generate Items
          </button>
        </form>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-screen-md">
        {items.map((item,index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center text-center"
          >
          <h3 className="font-bold text-lg mb-2">{item.name}</h3>
          <a
            href={item.link}
            target="blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Buy Now
          </a>
          </div>
        ))}
      </div>
    </div>
  );
}

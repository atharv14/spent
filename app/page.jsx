
"use client";

import OpenAI from "openai";
import { useState } from "react";




const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_APTKEY,
  dangerouslyAllowBrowser: true });


export default function Home() {

  const [input, setinput] = useState("");
  const [response, setresponse] = useState("");

  const handleInputChange = (e) => {
    setinput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", 
    store: true,
    messages: [{ role: "user", content: "You are a kind and funny chatbot that specializes in providing items (with their respective links) for users to purchase. These are the items"
      + input
     }],
    });
    setresponse(completion.choices[0]?.message?.content);

  }


  return (
    <div className="">
      <div className="text-center text-xl">Spentbutworking</div>

      <div className="0">
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={handleInputChange}
          placeholder="i donty know bruh"
          className="bg-slate-900 w-max"
        />
        <br />
        <button type="submit" className=" p-2 bg-slate-700 focus: bg-slate-600">
          send</button>
      </form>
      <div className=" top-9">
        <h2>response:</h2>
        <p>{response}</p>
      </div>
    </div>

    </div>
  );

}
"use client"

import { FormEvent, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          "email": email,
          "first_name": firstName,
          "last_name": lastName
        }),
      });

      if (response.ok) {
        console.log("added user!")
        setEmail(""); // Clear the input field
      } else {
        const errorData = await response.json();
        console.log(`Error: ${errorData.message || "Failed to subscribe."}`);
      }
    } catch (error) {
      console.log(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
            <h1 className="text-black text-5xl font-bold leading-tight">
              Let AI Summarize <br />
              Your Daily News.
            </h1>
          </div>

          <div className="lg:w-1/2 space-y-6">
            <p className="text-lg text-gray-700">
              The most impactful stories of the day, distilled to deepen your
              understanding of the world and save you time.{" "}
              <span className="bg-yellow-200 px-1">By AI, for humans.</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="First Name"
                  className="border border-gray-300 rounded-2xl px-4 py-3 w-full focus:outline-none text-black"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="border border-gray-300 rounded-2xl px-4 py-3 w-full focus:outline-none text-black"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <input
                type="email"
                placeholder="Your Email"
                className="border border-gray-300 rounded-2xl px-4 py-3 w-full focus:outline-none text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-3 rounded-2xl w-40"
                >
                  Join Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

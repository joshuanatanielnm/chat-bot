"use client";

import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto h-screen bg-white dark:bg-zinc-900">
      <h3 className="text-2xl font-bold text-center py-4">
        Simple Chatbot with Mistral
      </h3>
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-4">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center space-y-4 max-w-md">
              <div className="text-4xl mb-4">👋</div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                Welcome to the Chat!
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                I&apos;m your AI assistant powered by Mistral. Feel free to ask
                me anything!
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
                } animate-fade-in`}
              >
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <div
                          key={`${message.id}-${i}`}
                          className="whitespace-pre-wrap break-words overflow-wrap-anywhere"
                        >
                          {part.text}
                        </div>
                      );
                  }
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-zinc-800 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="flex-1 rounded-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
            value={input}
            placeholder="Type your message..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="rounded-full bg-blue-500 text-white px-6 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

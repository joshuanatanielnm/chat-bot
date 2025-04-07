"use client";

import { useConversations } from "@/hooks/useConversations";
import { Message, useChat } from "@ai-sdk/react";
import { Menu, X } from "lucide-react";
import { useEffect, useCallback, useState } from "react";

export default function Chat() {
  const [currentMessage, setCurrentMessage] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createNewConversation,
    updateConversation,
    deleteConversation,
  } = useConversations();

  useEffect(() => {
    if (currentConversationId) {
      const currentConversation = conversations.find(
        (conv) => conv.id === currentConversationId
      );
      setCurrentMessage(currentConversation?.messages || []);
    }
  }, [currentConversationId]);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
  } = useChat({
    id: currentConversationId || undefined,
    initialMessages: currentMessage || [],
  });

  const handleNewChat = useCallback(() => {
    setCurrentMessage([]);
    createNewConversation(); // Then create a new one
  }, [createNewConversation]);

  // Handle form submission with automatic conversation creation
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // If there's no current conversation and there's input, create a new one
      if (!currentConversationId && input.trim()) {
        setCurrentMessage([]);
        createNewConversation();
      }

      // Call the original submit handler
      originalHandleSubmit(e);
    },
    [currentConversationId, input, createNewConversation, originalHandleSubmit]
  );

  // Update conversation messages when they change
  useEffect(() => {
    if (currentConversationId && messages.length > 0) {
      updateConversation(currentConversationId, messages);
    }
  }, [currentConversationId, updateConversation]);

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-22 right-6 z-50 p-2 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 ease-in-out w-64 border-r border-gray-200 dark:border-zinc-800 p-4 flex flex-col bg-white dark:bg-zinc-900 z-40`}
      >
        <button
          onClick={() => {
            handleNewChat();
            setIsSidebarOpen(false);
          }}
          className="w-full mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          New Chat
        </button>
        <div className="flex-1 overflow-y-auto space-y-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                currentConversationId === conv.id
                  ? "bg-blue-100 dark:bg-blue-900"
                  : "hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
              onClick={() => {
                setCurrentConversationId(conv.id);
                setIsSidebarOpen(false);
              }}
            >
              <div className="flex justify-between items-center">
                <span className="truncate text-sm">
                  {conv.title || "New Conversation"}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(conv.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <h3 className="text-xl lg:text-2xl font-bold text-center py-4">
          Simple Chatbot with Mistral
        </h3>
        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-4">
          {messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center space-y-4 max-w-md px-4">
                <div className="text-4xl mb-4">👋</div>
                <h2 className="text-lg lg:text-xl font-semibold text-gray-700 dark:text-gray-300">
                  Welcome to the Chat!
                </h2>
                <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400">
                  I&apos;m your AI assistant powered by Mistral. Feel free to
                  ask me anything!
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
                  className={`max-w-[90%] lg:max-w-[80%] rounded-2xl px-3 lg:px-4 py-2 ${
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
                            className="whitespace-pre-wrap break-words overflow-wrap-anywhere text-sm lg:text-base"
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
              className="flex-1 rounded-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
              value={input}
              placeholder="Type your message..."
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="rounded-full bg-blue-500 text-white px-4 lg:px-6 py-2 text-sm lg:text-base hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

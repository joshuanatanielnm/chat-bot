"use client";

import { useConversations } from "@/hooks/useConversations";
import { Message, useChat } from "@ai-sdk/react";
import { Menu, X } from "lucide-react";
import { useEffect, useCallback, useState } from "react";

// Define types for our components
interface ChatComponentProps {
  conversationId: string;
  onMessageChange: (messages: Message[]) => void;
}

interface NewChatComponentProps {
  onCreateConversation: (id: string) => void;
}

// Separate ChatComponent that will be unmounted and remounted when conversation changes
function ChatComponent({
  conversationId,
  onMessageChange,
}: ChatComponentProps) {
  const { conversations, updateConversation } = useConversations();

  // Find the current conversation
  const conversation = conversations.find((conv) => conv.id === conversationId);

  // Initialize chat with the conversation's messages
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    id: conversationId,
    initialMessages: conversation?.messages || [],
    api: "/api/chat",
  });

  // Update conversation in storage when messages change
  useEffect(() => {
    if (messages.length > 0) {
      updateConversation(conversationId, messages);
      onMessageChange(messages);
    }
  }, [conversationId, messages, updateConversation, onMessageChange]);

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-4">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center space-y-4 max-w-md px-4">
              <div className="text-4xl mb-4">👋</div>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-700 dark:text-gray-300">
                Welcome to the Chat!
              </h2>
              <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400">
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
    </>
  );
}

// Empty chat for new conversations
function NewChatComponent({ onCreateConversation }: NewChatComponentProps) {
  const { createNewConversation } = useConversations();

  const {
    input,
    handleInputChange,
    handleSubmit: originalSubmit,
  } = useChat({
    id: "new-chat-temp",
    initialMessages: [],
    api: "/api/chat",
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (input.trim()) {
        const newConversation = createNewConversation();
        onCreateConversation(newConversation.id);
      }
      originalSubmit(e);
    },
    [input, createNewConversation, originalSubmit, onCreateConversation]
  );

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-4">
        <div className="flex justify-center items-center h-full">
          <div className="text-center space-y-4 max-w-md px-4">
            <div className="text-4xl mb-4">👋</div>
            <h2 className="text-lg lg:text-xl font-semibold text-gray-700 dark:text-gray-300">
              Welcome to the Chat!
            </h2>
            <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400">
              I&apos;m your AI assistant powered by Mistral. Feel free to ask me
              anything!
            </p>
          </div>
        </div>
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
    </>
  );
}

export default function Chat() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [, setMessages] = useState<Message[]>([]);

  const {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createNewConversation,
    deleteConversation,
  } = useConversations();

  // Handle creating a new chat
  const handleNewChat = useCallback(() => {
    const newConversation = createNewConversation();
    setCurrentConversationId(newConversation.id);
    setIsSidebarOpen(false);
  }, [createNewConversation, setCurrentConversationId]);

  // Handle messages change
  const handleMessagesChange = useCallback((newMessages: Message[]) => {
    setMessages(newMessages);
  }, []);

  // Handle creating a conversation from new chat
  const handleCreateConversation = useCallback(
    (id: string) => {
      setCurrentConversationId(id);
    },
    [setCurrentConversationId]
  );

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors"
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
          onClick={handleNewChat}
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

        {/* Render the appropriate chat component based on current state */}
        {currentConversationId ? (
          <ChatComponent
            key={currentConversationId}
            conversationId={currentConversationId}
            onMessageChange={handleMessagesChange}
          />
        ) : (
          <NewChatComponent
            key="new-chat"
            onCreateConversation={handleCreateConversation}
          />
        )}
      </div>
    </div>
  );
}

"use client";

import { useConversations } from "@/hooks/useConversations";
import { Message } from "@ai-sdk/react";
import { Menu, X } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { NewChat } from "@/components/NewChat";
import { Chat } from "@/components/Chat";

// Define types for our components

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [, setMessages] = useState<Message[]>([]);

  const {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createNewConversation,
    deleteConversation,
  } = useConversations();

  // Create a new conversation if there are none
  useEffect(() => {
    // Skip during server-side rendering
    if (typeof window === "undefined") return;

    // Use a timeout to ensure this runs after localStorage is loaded
    const timer = setTimeout(() => {
      if (conversations.length === 0) {
        createNewConversation();
      }
    }, 100); // Small delay to ensure localStorage has been processed

    return () => clearTimeout(timer);
  }, [conversations.length, createNewConversation]);

  // Handle creating a new chat
  const handleNewChat = useCallback(() => {
    const newConversation = createNewConversation();
    setCurrentConversationId(newConversation.id);
    setIsSidebarOpen(false);

    // Force focus by using a small timeout
    setTimeout(() => {
      const inputField = document.querySelector(
        'input[type="text"], input:not([type])'
      );
      if (inputField) {
        (inputField as HTMLInputElement).focus();
      }
    }, 100);
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

  // Handle selecting conversation
  const handleSelectConversation = useCallback(
    (id: string) => {
      setCurrentConversationId(id);
      setIsSidebarOpen(false);

      // Force focus by using a small timeout
      setTimeout(() => {
        const inputField = document.querySelector(
          'input[type="text"], input:not([type])'
        );
        if (inputField) {
          (inputField as HTMLInputElement).focus();
        }
      }, 100);
    },
    [setCurrentConversationId]
  );

  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-20 right-6 z-50 p-3 rounded-full bg-[var(--accent)] text-white shadow-lg hover:opacity-90 transition-colors"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 ease-in-out w-64 border-r border-[var(--border)] p-4 flex flex-col bg-[var(--background)] z-40`}
      >
        <button
          onClick={handleNewChat}
          className="w-full mb-4 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-colors"
        >
          New Chat
        </button>
        <div className="block lg:hidden pb-4">
          <ThemeSwitcher />
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                currentConversationId === conv.id
                  ? "bg-[var(--accent-hover)]"
                  : "hover:bg-[var(--background-secondary)]"
              }`}
              onClick={() => {
                handleSelectConversation(conv.id);
              }}
            >
              <div className="flex justify-between items-center">
                <span className="truncate text-sm">
                  {conv.title || "New Conversation"}
                </span>
                {conversations.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    className="text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(conv.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <div className="flex justify-between items-center py-4 px-4 border-b border-[var(--border)]">
          <h3 className="text-xl lg:text-2xl font-bold">
            Mistral AI Chat Assistant
          </h3>

          {/* Desktop Theme Switcher */}
          <div className="hidden lg:block">
            <ThemeSwitcher />
          </div>
        </div>

        {/* Render the appropriate chat component based on current state */}
        {currentConversationId ? (
          <Chat
            key={`chat-${currentConversationId}`}
            conversationId={currentConversationId}
            onMessageChange={handleMessagesChange}
          />
        ) : (
          <NewChat
            key={`new-chat-${Date.now()}`}
            onCreateConversation={handleCreateConversation}
          />
        )}
      </div>
    </div>
  );
}

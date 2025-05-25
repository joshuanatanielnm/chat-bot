"use client";

import { useConversations } from "@/hooks/useConversations";
import { Message } from "@ai-sdk/react";
import { UIMessage } from "ai";
import { Menu, X } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { NewChat } from "@/components/NewChat";
import { Chat } from "@/components/Chat";

// Define types for our components

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<UIMessage[]>([]);

  const {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createNewConversation,
    deleteConversation,
    updateConversation,
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
    // Save the current conversation before switching only if there are changes
    if (currentConversationId && messages.length > 0) {
      // Get the current conversation from the state to avoid unnecessary updates
      const currentConv = conversations.find(
        (conv) => conv.id === currentConversationId
      );

      // Only update if the messages have changed
      if (
        currentConv &&
        JSON.stringify(currentConv.messages) !== JSON.stringify(messages)
      ) {
        updateConversation(currentConversationId, messages);
      }
    }

    const newConversation = createNewConversation();
    setCurrentConversationId(newConversation.id);
    setIsSidebarOpen(false);
    setMessages([]); // Reset messages for new chat
  }, [
    createNewConversation,
    setCurrentConversationId,
    currentConversationId,
    messages,
    updateConversation,
    conversations,
  ]);

  // Handle messages change
  const handleMessagesChange = useCallback(
    (newMessages: Message[]) => {
      // Convert Message to UIMessage as needed
      const uiMessages = newMessages as unknown as UIMessage[];
      setMessages(uiMessages);

      // Also update the conversation in storage if we have messages and a selected conversation
      if (currentConversationId && newMessages.length > 0) {
        // Get the current conversation to compare messages
        const currentConv = conversations.find(
          (conv) => conv.id === currentConversationId
        );

        // Only update if we have new messages or different messages
        if (
          !currentConv ||
          currentConv.messages.length !== newMessages.length ||
          JSON.stringify(currentConv.messages) !== JSON.stringify(uiMessages)
        ) {
          updateConversation(currentConversationId, uiMessages);
        }
      }
    },
    [currentConversationId, updateConversation, conversations]
  );

  // Handle creating a conversation from new chat
  const handleCreateConversation = useCallback(
    (id: string) => {
      // Save current conversation before switching only if there are changes
      if (currentConversationId && messages.length > 0) {
        // Get the current conversation from the state to avoid unnecessary updates
        const currentConv = conversations.find(
          (conv) => conv.id === currentConversationId
        );

        // Only update if the messages have changed
        if (
          currentConv &&
          JSON.stringify(currentConv.messages) !== JSON.stringify(messages)
        ) {
          updateConversation(currentConversationId, messages);
        }
      }

      setCurrentConversationId(id);
      setMessages([]); // Reset messages for the new conversation
    },
    [
      setCurrentConversationId,
      currentConversationId,
      messages,
      updateConversation,
      conversations,
    ]
  );

  // Handle selecting conversation
  const handleSelectConversation = useCallback(
    (id: string) => {
      // Don't save/update if we're just selecting the same conversation
      if (id === currentConversationId) {
        setIsSidebarOpen(false);
        return;
      }

      // Save current conversation before switching only if there are changes
      if (currentConversationId && messages.length > 0) {
        // Get the current conversation from the state to avoid unnecessary updates
        const currentConv = conversations.find(
          (conv) => conv.id === currentConversationId
        );

        // Only update if the messages have changed
        if (
          currentConv &&
          JSON.stringify(currentConv.messages) !== JSON.stringify(messages)
        ) {
          updateConversation(currentConversationId, messages);
        }
      }

      setCurrentConversationId(id);
      setIsSidebarOpen(false);

      // Find and load messages for the selected conversation
      const selectedConversation = conversations.find((conv) => conv.id === id);
      if (selectedConversation) {
        setMessages(selectedConversation.messages || []);
      } else {
        setMessages([]);
      }
    },
    [
      setCurrentConversationId,
      conversations,
      currentConversationId,
      messages,
      updateConversation,
    ]
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
          className="w-full lg:block hidden mb-4 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-colors"
        >
          New Chat
        </button>
        <div
          className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar"
          style={{
            scrollbarColor: `var(--scrollbar-thumb) var(--scrollbar-track)`,
            scrollbarWidth: "thin",
          }}
        >
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
                      // Add a small debounce to prevent rapid delete operations
                      // This helps prevent input jumping issues
                      const target = e.target as HTMLButtonElement;
                      if (target.dataset.deleting === "true") {
                        return;
                      }
                      target.dataset.deleting = "true";

                      // Delete the conversation
                      deleteConversation(conv.id);

                      // Reset the deleting flag after a short delay
                      setTimeout(() => {
                        if (target) {
                          target.dataset.deleting = "false";
                        }
                      }, 300);
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
        <div className="block lg:hidden pb-4">
          <ThemeSwitcher />
        </div>
        <button
          onClick={handleNewChat}
          className="block lg:hidden w-full mb-4 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-colors"
        >
          New Chat
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-full lg:w-auto h-screen">
        <div className="flex justify-between items-center py-4 px-4 border-b border-[var(--border)]">
          <h3 className="text-xl lg:text-2xl font-bold">
            Cognitica AI Chat Assistant
          </h3>

          {/* Desktop Theme Switcher */}
          <div className="hidden lg:block">
            <ThemeSwitcher />
          </div>
        </div>

        {/* Render the appropriate chat component based on current state */}
        <div className="flex-1 overflow-hidden">
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
    </div>
  );
}

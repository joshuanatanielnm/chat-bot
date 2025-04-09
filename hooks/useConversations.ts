import { useEffect, useState, useCallback } from "react";
import { UIMessage } from "ai";

export interface Conversation {
  id: string;
  title: string;
  messages: UIMessage[];
  createdAt: string;
  updatedAt: string;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [isConversationsEmpty, setIsConversationsEmpty] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem("conversations");
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      setConversations(parsed);
      setIsConversationsEmpty(parsed.length === 0);
      // Set the most recent conversation as current if none is selected
      if (parsed.length > 0 && !currentConversationId) {
        setCurrentConversationId(parsed[0].id);
      }
    }
    setIsInitialized(true);
  }, []); // Remove currentConversationId from dependencies

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("conversations", JSON.stringify(conversations));
    }
  }, [conversations, isInitialized]);

  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [], // Ensure messages are empty
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setConversations((prev) => [...prev, newConversation]);
    setCurrentConversationId(newConversation.id);
    return newConversation;
  }, []);

  const updateConversation = useCallback(
    (id: string, messages: UIMessage[]) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === id) {
            return {
              ...conv,
              messages: [...messages], // Create a new array to ensure state update
              updatedAt: new Date().toISOString(),
              title: messages[0]?.content || "New Conversation",
            };
          }
          return conv;
        })
      );
    },
    []
  );

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((conv) => conv.id !== id));
      if (currentConversationId === id) {
        setCurrentConversationId(null);
      }
    },
    [currentConversationId]
  );

  const getCurrentConversation = useCallback(() => {
    return conversations.find((conv) => conv.id === currentConversationId);
  }, [conversations, currentConversationId]);

  return {
    conversations,
    currentConversationId,
    isConversationsEmpty,
    setCurrentConversationId,
    createNewConversation,
    updateConversation,
    deleteConversation,
    getCurrentConversation,
  };
}

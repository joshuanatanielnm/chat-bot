import { useEffect, useState, useCallback } from "react";
import { UIMessage } from "ai";

export interface Conversation {
  id: string;
  title: string;
  messages: UIMessage[];
  createdAt: string;
  updatedAt: string;
}

// Safe localStorage access helper functions
const getLocalStorage = (key: string): string | null => {
  try {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(key);
    }
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
  }
  return null;
};

const setLocalStorage = (key: string, value: string): boolean => {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
      return true;
    }
  } catch (error) {
    console.error(`Error writing to localStorage: ${error}`);
  }
  return false;
};

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load conversations from localStorage on mount
  useEffect(() => {
    // Use a flag to ensure we only run this once in client-side rendering
    let isMounted = true;

    // Delay slightly to ensure this runs after hydration
    const loadFromStorage = () => {
      if (!isMounted) return;

      const savedConversations = getLocalStorage("conversations");
      if (savedConversations) {
        try {
          const parsed = JSON.parse(savedConversations);
          if (Array.isArray(parsed)) {
            // Sort conversations by updatedAt timestamp (newest first)
            const sortedConversations = parsed.sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            );

            setConversations(sortedConversations);

            // Set the most recent conversation as current if none is selected
            if (sortedConversations.length > 0 && !currentConversationId) {
              setCurrentConversationId(sortedConversations[0].id);
            }
          }
        } catch (error) {
          console.error("Failed to parse conversations:", error);
        }
      }

      if (isMounted) {
        setIsInitialized(true);
      }
    };

    // Delay the localStorage access to ensure it happens after hydration
    if (typeof window !== "undefined") {
      // Use setTimeout to ensure this runs after React hydration
      setTimeout(loadFromStorage, 0);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (isInitialized && conversations.length > 0) {
      setLocalStorage("conversations", JSON.stringify(conversations));
    }
  }, [conversations, isInitialized]);

  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Add new conversation to the beginning of the array so it appears at the top
    setConversations((prev) => [newConversation, ...prev]);
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
    isConversationsEmpty: conversations.length === 0,
    setCurrentConversationId,
    createNewConversation,
    updateConversation,
    deleteConversation,
    getCurrentConversation,
  };
}

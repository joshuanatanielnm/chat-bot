import { useEffect, useState, useCallback } from "react";
import { UIMessage } from "ai";
import { getStorageJSON, setStorageJSON } from "@/utils/storage";

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
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadRetries, setLoadRetries] = useState(0);

  // Load conversations from localStorage on mount with retry mechanism
  useEffect(() => {
    let isMounted = true;

    const loadFromStorage = () => {
      if (!isMounted) return;

      try {
        // Use our enhanced storage utility
        const savedConversations = getStorageJSON<Conversation[]>(
          "conversations",
          []
        );

        if (savedConversations.length > 0) {
          // Sort conversations by updatedAt timestamp (newest first)
          const sortedConversations = savedConversations.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );

          setConversations(sortedConversations);

          // Set the most recent conversation as current if none is selected
          if (sortedConversations.length > 0 && !currentConversationId) {
            setCurrentConversationId(sortedConversations[0].id);
          }

          // Successfully loaded data
          if (isMounted) {
            setIsInitialized(true);
          }
        } else {
          // We got an empty array or invalid data, set initialized to true to create new conversation
          if (isMounted) {
            setIsInitialized(true);
          }
        }
      } catch (error) {
        console.error("Failed to parse conversations:", error);

        // Handle corrupted data by clearing it and retrying
        if (isMounted && loadRetries < 2) {
          setLoadRetries((prev) => prev + 1);
          setTimeout(loadFromStorage, 200); // Retry after a short delay
        } else {
          // After retries, just initialize without data
          if (isMounted) {
            setIsInitialized(true);
          }
        }
      }
    };

    // Delay the localStorage access to ensure it happens after hydration
    if (typeof window !== "undefined") {
      // Use requestAnimationFrame for smoother performance and to ensure we're after hydration
      window.requestAnimationFrame(() => {
        // Additional timeout to ensure we're well after hydration
        setTimeout(loadFromStorage, 100);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [currentConversationId, loadRetries]);

  // Save conversations to localStorage with debounce and retry
  useEffect(() => {
    if (!isInitialized || conversations.length === 0) return;

    // Debounce saves to avoid writing too frequently
    const timeoutId = setTimeout(() => {
      // Use our enhanced storage utility with compression for large datasets
      setStorageJSON("conversations", conversations);
    }, 300);

    return () => clearTimeout(timeoutId);
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
      if (!id || !messages || !Array.isArray(messages)) {
        console.error("Invalid data in updateConversation:", { id, messages });
        return;
      }

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === id) {
            const messagesCopy = Array.isArray(messages) ? [...messages] : [];
            return {
              ...conv,
              messages: messagesCopy,
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
    isInitialized,
  };
}

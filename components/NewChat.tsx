import { useConversations } from "@/hooks/useConversations";
import { useChat } from "@ai-sdk/react";
import { useCallback, useRef, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { isMobileDevice } from "@/utils/deviceDetection";

interface NewChatProps {
  onCreateConversation: (id: string) => void;
}

// Empty chat for new conversations
export const NewChat = ({ onCreateConversation }: NewChatProps) => {
  const { createNewConversation, updateConversation } = useConversations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newConversationId, setNewConversationId] = useState<string | null>(
    null
  );

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalSubmit,
    isLoading,
  } = useChat({
    id: "new-chat-temp",
    initialMessages: [],
    api: "/api/chat",
  });

  // Save messages whenever they change
  useEffect(() => {
    if (newConversationId && messages.length > 0) {
      updateConversation(newConversationId, messages);
    }
  }, [newConversationId, messages, updateConversation]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (input.trim()) {
        setIsSubmitting(true);
        try {
          const newConversation = createNewConversation();
          setNewConversationId(newConversation.id);
          onCreateConversation(newConversation.id);
        } catch (error) {
          console.error("Error creating new conversation:", error);
          setIsSubmitting(false);
        }
      }
      originalSubmit(e);

      // Refocus the input field after submission
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    },
    [input, createNewConversation, originalSubmit, onCreateConversation]
  );

  // Determine if loading
  const loading = isLoading || isSubmitting;

  // Keep track of previous loading state to detect when it changes
  const prevLoadingRef = useRef(loading);

  // Focus input after response is received
  useEffect(() => {
    // If loading just finished (was loading, now it's not)
    if (prevLoadingRef.current && !loading) {
      // Focus the input field
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
    // Update the ref with current loading state
    prevLoadingRef.current = loading;
  }, [loading]);

  // Focus input on component mount
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (inputRef.current && !loading) {
        inputRef.current.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <>
      <div
        className="flex-1 overflow-y-auto px-4 py-8 pb-32 space-y-4 pr-1 custom-scrollbar"
        style={{
          scrollbarColor: `var(--scrollbar-thumb) var(--scrollbar-track)`,
          scrollbarWidth: "thin",
        }}
      >
        <div className="flex justify-center items-center h-full">
          <div className="text-center space-y-4 max-w-md px-4">
            <div className="text-4xl mb-4">👋</div>
            <h2 className="text-lg lg:text-xl font-semibold text-[var(--foreground)]">
              Welcome to the Chat!
            </h2>
            <p className="text-sm lg:text-base text-gray-500">
              I&apos;m your AI assistant powered by Cognitica. Feel free to ask
              me anything!
            </p>
          </div>
        </div>
      </div>

      {/* Wrap the input in a container div with relative positioning */}
      <div className="fixed bottom-0 left-0 right-0 w-full bg-[var(--background)] border-t border-[var(--border)] z-30">
        <div className="p-4 fixed-bottom-input">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              className="flex-1 rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] px-4 py-2 lg:text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
              value={input}
              placeholder="Type your message..."
              onChange={handleInputChange}
              disabled={loading}
              autoFocus={!isMobileDevice()}
            />
            <button
              type="submit"
              className={`rounded-full bg-[var(--accent)] text-white px-4 lg:px-6 py-2 text-sm lg:text-base hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading || !input.trim()}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

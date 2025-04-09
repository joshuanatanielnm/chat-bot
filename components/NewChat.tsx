import { useConversations } from "@/hooks/useConversations";
import { useChat } from "@ai-sdk/react";
import {
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Loader2 } from "lucide-react";

interface NewChatProps {
  onCreateConversation: (id: string) => void;
}

// Empty chat for new conversations
export const NewChat = ({ onCreateConversation }: NewChatProps) => {
  const { createNewConversation } = useConversations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    input,
    handleInputChange,
    handleSubmit: originalSubmit,
    isLoading,
  } = useChat({
    id: "new-chat-temp",
    initialMessages: [],
    api: "/api/chat",
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (input.trim()) {
        setIsSubmitting(true);
        try {
          const newConversation = createNewConversation();
          onCreateConversation(newConversation.id);
        } catch (error) {
          console.error("Error creating new conversation:", error);
          setIsSubmitting(false);
        }
      }
      originalSubmit(e);
    },
    [input, createNewConversation, originalSubmit, onCreateConversation]
  );

  // Focus input when component mounts - use both useEffect and useLayoutEffect for maximum reliability
  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50); // Small delay to ensure DOM is ready

    return () => clearTimeout(focusTimeout);
  }, []);

  // Also use useLayoutEffect for more immediate focus
  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Determine if loading
  const loading = isLoading || isSubmitting;

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-4">
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

      <div className="border-t border-[var(--border)] p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            className="flex-1 rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] px-4 py-2 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
            value={input}
            placeholder="Type your message..."
            onChange={handleInputChange}
            disabled={loading}
            autoFocus
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
    </>
  );
};

import { useConversations } from "@/hooks/useConversations";
import { Message, useChat } from "@ai-sdk/react";
import { useEffect, useRef, useLayoutEffect } from "react";

interface ChatProps {
  conversationId: string;
  onMessageChange: (messages: Message[]) => void;
}

// Separate Chat that will be unmounted and remounted when conversation changes
export const Chat = ({ conversationId, onMessageChange }: ChatProps) => {
  const { conversations, updateConversation } = useConversations();
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Focus input when conversation changes - use both useEffect and useLayoutEffect for maximum reliability
  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50); // Small delay to ensure DOM is ready

    return () => clearTimeout(focusTimeout);
  }, [conversationId]);

  // Also use useLayoutEffect for more immediate focus
  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversationId]);

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-4">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center space-y-4 max-w-md px-4">
              <div className="text-4xl mb-4">👋</div>
              <h2 className="text-lg lg:text-xl font-semibold text-[var(--foreground)]">
                Welcome to the Chat!
              </h2>
              <p className="text-sm lg:text-base text-gray-500">
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
                    ? "bg-[var(--accent)] text-white rounded-br-none"
                    : "bg-[var(--card)] text-[var(--card-foreground)] rounded-bl-none"
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

      <div className="border-t border-[var(--border)] p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            className="flex-1 rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] px-4 py-2 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
            value={input}
            placeholder="Type your message..."
            onChange={handleInputChange}
            autoFocus
          />
          <button
            type="submit"
            className="rounded-full bg-[var(--accent)] text-white px-4 lg:px-6 py-2 text-sm lg:text-base hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 transition-all"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
};

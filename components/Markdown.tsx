import Link from "next/link";
import React, { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";

const components: Partial<Components> = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  code: CodeBlock,
  pre: ({ children }) => <>{children}</>,
  p: ({ children, ...props }) => {
    // Check if any of the children are pre or div elements - both cannot be nested in <p>
    const hasInvalidElement = React.Children.toArray(children).some(
      (child) =>
        React.isValidElement(child) &&
        (child.type === "pre" || child.type === "div")
    );

    if (hasInvalidElement) {
      return <>{children}</>;
    }

    return <p {...props}>{children}</p>;
  },
  ol: ({ children, ...props }) => {
    return (
      <ol className="list-decimal list-outside ml-6 mb-6 space-y-2" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ children, ...props }) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ children, ...props }) => {
    return (
      <ul className="list-disc list-outside ml-6 mb-6 space-y-2" {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
  a: ({ children, ...props }) => {
    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      <Link
        className="text-[var(--accent)] hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </Link>
    );
  },
  h1: ({ children, ...props }) => {
    return (
      <h1 className="text-3xl font-semibold mt-8 mb-4" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ children, ...props }) => {
    return (
      <h2 className="text-2xl font-semibold mt-6 mb-3" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }) => {
    return (
      <h3 className="text-xl font-semibold mt-5 mb-3" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ children, ...props }) => {
    return (
      <h4 className="text-lg font-semibold mt-4 mb-2" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ children, ...props }) => {
    return (
      <h5 className="text-base font-semibold mt-4 mb-2" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ children, ...props }) => {
    return (
      <h6 className="text-sm font-semibold mt-4 mb-2" {...props}>
        {children}
      </h6>
    );
  },
  blockquote: ({ children, ...props }) => {
    return (
      <blockquote
        className="border-l-4 border-[var(--border)] pl-4 py-1 my-4 text-gray-500 italic"
        {...props}
      >
        {children}
      </blockquote>
    );
  },
};

const remarkPlugins = [remarkGfm];

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

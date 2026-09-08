"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "@/components/chat/code-block";
import { MermaidDiagram } from "@/components/chat/mermaid-diagram";

import "@/components/chat/chat-markdown.css";

const components: Components = {
  pre: ({ children }) => <>{children}</>,
  code({ className, children, ...rest }) {
    const match = /language-(\w+)/.exec(className ?? "");
    const code = String(children).replace(/\n$/, "");

    if (!match) {
      return (
        <code className={className} {...rest}>
          {children}
        </code>
      );
    }

    const language = match[1];
    if (language === "mermaid") {
      return <MermaidDiagram code={code} />;
    }
    return <CodeBlock language={language} code={code} />;
  },
};

export function ChatMarkdown({ content }: { content: string }) {
  return (
    <div className="chat-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

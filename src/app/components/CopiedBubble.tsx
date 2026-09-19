import React from "react";

// "Copied!" confirmation shown above a copy button. role="status" also announces it to screen readers.
// Place it inside a relatively positioned wrapper next to the button.
export default function CopiedBubble({ show, message }: { show: boolean; message: string }) {
  return (
    <span
      role="status"
      className={`pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-accent/30 bg-dark px-2 py-1 text-xs text-accent transition-opacity duration-300 print:hidden ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      {show ? message : ""}
    </span>
  );
}

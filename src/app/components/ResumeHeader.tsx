"use client";

import React from "react";
import { contactInfo } from "../data/resumeData";
import { useCopyToClipboard } from "@/lib/useCopyToClipboard";
import CopiedBubble from "./CopiedBubble";

export default function ResumeHeader() {
  const { copiedKey, copy } = useCopyToClipboard();

  return (
    <header className="text-center mb-8 print:mb-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-3 print:text-3xl print:mb-2">
        {contactInfo.name}
      </h1>
      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-gray-300 text-sm md:text-base print:text-xs print:gap-x-2">
        <span>{contactInfo.location}</span>
        <span className="hidden sm:inline">•</span>
        {/* Clicking copies the address instead of opening a mail app; it stays a mailto link
            so it still prints (the print stylesheet hides buttons) and works without JavaScript */}
        <span className="relative">
          <a
            href={`mailto:${contactInfo.email}`}
            onClick={(e) => {
              e.preventDefault();
              copy(contactInfo.email, "email", `mailto:${contactInfo.email}`);
            }}
            title="Copy email address"
            className="hover:text-accent transition-colors"
          >
            {contactInfo.email}
          </a>
          <CopiedBubble show={copiedKey === "email"} message="Email copied!" />
        </span>
        <span className="hidden sm:inline">•</span>
        <a
          href={`https://${contactInfo.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent transition-colors"
        >
          {contactInfo.linkedin}
        </a>
        <span className="hidden sm:inline">•</span>
        <a
          href={`https://${contactInfo.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent transition-colors"
        >
          {contactInfo.website}
        </a>
      </div>
    </header>
  );
}

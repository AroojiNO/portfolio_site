"use client";

import { useEffect, useRef, useState } from "react";

// Copies text to the clipboard and remembers what was copied for a couple of seconds,
// so callers can show a "copied" confirmation. If the browser blocks clipboard access,
// it opens fallbackUrl instead (e.g. a mailto: link).
export function useCopyToClipboard(resetAfterMs = 2000) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const copy = async (text: string, key: string, fallbackUrl?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopiedKey(null), resetAfterMs);
    } catch {
      if (fallbackUrl) window.location.href = fallbackUrl;
    }
  };

  return { copiedKey, copy };
}

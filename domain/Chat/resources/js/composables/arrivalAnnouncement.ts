import type { ChatEntryData } from "@generated/types/chat";

/**
 * What the polite region says about new messages and questions by others: each once, by who wrote it. The entries a
 * view first shows are only remembered, and an entry shown again, as a reload brings it, stays quiet.
 */
export function arrivalAnnouncement(viewer: () => string) {
  const heard = new Set<string>();
  let isStarted = false;

  return (entries: ChatEntryData[]): string | null => {
    const fresh = entries.filter((entry) => !heard.has(entry.id));
    fresh.forEach((entry) => heard.add(entry.id));

    if (!isStarted) {
      isStarted = true;

      return null;
    }

    const incoming = fresh.filter(
      (entry) =>
        entry.author !== null &&
        entry.author !== viewer() &&
        (entry.type === "message" || entry.type === "question"),
    );

    if (incoming.length === 0) {
      return null;
    }

    return incoming
      .map(
        (entry) =>
          `New ${entry.type} from ${entry.authorLabel ?? "someone who left"}.`,
      )
      .join(" ");
  };
}

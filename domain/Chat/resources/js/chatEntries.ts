import type { ChatEntryData } from "@generated/types/chat";

/** One emoji on a message: how many reacted with it and whether the viewer is one of them. */
export type ReactionCount = { emoji: string; count: number; isOwn: boolean };

/**
 * The reactions of each message the entries hold, by the message's id, each emoji once in the order it first came.
 */
export function reactionsByMessage(
  entries: ChatEntryData[],
  viewer: string,
): Map<string, ReactionCount[]> {
  const byMessage = new Map<string, ReactionCount[]>();

  entries.forEach((entry) => {
    const targetId = entry.message?.targetMessageId ?? null;

    if (entry.type !== "reaction" || entry.message === undefined || targetId === null) {
      return;
    }

    const counts = byMessage.get(targetId) ?? [];
    const known = counts.find((reaction) => reaction.emoji === entry.message?.body);

    if (known === undefined) {
      counts.push({ emoji: entry.message.body, count: 1, isOwn: entry.author === viewer });
    } else {
      known.count += 1;
      known.isOwn ||= entry.author === viewer;
    }

    byMessage.set(targetId, counts);
  });

  return byMessage;
}

/** The entry of each message the entries hold, by the message's id, so a reply finds the message it answers. */
export function entriesByMessage(entries: ChatEntryData[]): Map<string, ChatEntryData> {
  return new Map(
    entries.flatMap((entry) => (entry.message === undefined ? [] : [[entry.message.id, entry]])),
  );
}

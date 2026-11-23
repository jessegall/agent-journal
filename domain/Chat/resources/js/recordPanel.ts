import type { DockCardEnvelope } from "@kit/dockCards";
import { isRunning } from "./composables/useChatTimeline";

/** The key a record is known by across the chat's lines: its type and id. */
export function recordKey(card: DockCardEnvelope): string {
  return `${card.source.type}:${card.source.id}`;
}

/**
 * The record open beside the chat, from the newest card of each record the lines show: the one the user chose, else
 * the newest that still runs and that the user has not closed; none once that one ends.
 */
export function openedRecordOf(
  cards: DockCardEnvelope[],
  chosen: string | null,
  closed: string[],
): DockCardEnvelope | null {
  if (chosen !== null) {
    return cards.findLast((card) => recordKey(card) === chosen) ?? null;
  }

  const newest = new Map(cards.map((card) => [recordKey(card), card]));

  return (
    [...newest.values()].findLast(
      (card) => isRunning(card.root) && !closed.includes(recordKey(card)),
    ) ?? null
  );
}

import { ref } from "vue";

/** A record being handed to an agent: what the chat calls it, and where it opens or else its type and id. */
export type HandedRecord = { title: string; reference: string };

/**
 * A message waiting for an agent's chat to open so it can be sent there: a record let go on the agent, or a new chat's
 * first message.
 */
export type HandOver = { agentId: string; text: string };

/** The drag data type a record carries while it is dragged towards an agent. */
export const HANDED_RECORD_TYPE = "application/x-journal-record";

const pending = ref<HandOver | null>(null);

/** Whether a drag carries a record that can be handed over. */
export function carriesRecord(event: DragEvent): boolean {
  return event.dataTransfer?.types.includes(HANDED_RECORD_TYPE) ?? false;
}

/** Puts the record on the drag, so an agent can take it when it is let go. */
export function startHanding(event: DragEvent, record: HandedRecord): void {
  event.dataTransfer?.setData(HANDED_RECORD_TYPE, JSON.stringify(record));
}

/** The record a drop carries. */
export function droppedRecord(event: DragEvent): HandedRecord {
  return JSON.parse(
    event.dataTransfer?.getData(HANDED_RECORD_TYPE) ?? "{}",
  ) as HandedRecord;
}

/** The message that hands a record to an agent: what to do with it and how to find it. */
export function handOverText(record: HandedRecord): string {
  return `Read this, please: ${record.title} (${record.reference})`;
}

/**
 * The hand-over waiting for its agent's chat: set when a record is let go on an agent or a new chat opens with a first
 * message, taken once by that agent's chat.
 */
export function useHandOver() {
  function hold(handOver: HandOver): void {
    pending.value = handOver;
  }

  function takeFor(agentId: string | null): HandOver | null {
    const waiting = pending.value;

    if (waiting === null || waiting.agentId !== agentId) {
      return null;
    }

    pending.value = null;

    return waiting;
  }

  return { pending, hold, takeFor };
}

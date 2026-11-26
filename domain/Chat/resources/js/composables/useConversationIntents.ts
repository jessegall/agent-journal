import type { FormDataConvertible } from "@inertiajs/core";
import { reactive, ref } from "vue";
import type { ChatEntryData } from "@generated/types/chat";
import { onChatAccessEnded } from "@kit/chatAccess";
import { keyedPost } from "@kit/keyedPost";
import { onPurge } from "@kit/protectedView";
import { newRequestId } from "@kit/requestId";
import { appliedReadGeneration, markDirty } from "@kit/usePageChanges";
import { send as sendRoute } from "@generated/routes/chat";
import { useMessageDrafts } from "./useMessageDrafts";

/**
 * Where one send or reply the user made stands on this screen: sending while its request is out, confirmed once the
 * server took it, uncertain while the conversation is read again after an answer that never came, and unknown when
 * that read did not show it. A refused send leaves the conversation and is offered to restore or discard.
 */
export type IntentStatus = "sending" | "confirmed" | "uncertain" | "unknown";

export const UNKNOWN_OUTCOME_TEXT =
  "We couldn't confirm whether this was sent.";

export type ConversationIntent = {
  key: string;
  kind: "send" | "reply";
  body: Record<string, FormDataConvertible>;
  text: string;
  replyToId: string | null;
  status: IntentStatus;
  refusal: string | null;
  isTransportOpen: boolean;
  confirmedGeneration: number;
  checkedGeneration: number;
};

/**
 * A row the conversation shows: an entry the server returned, or the user's own send still settling.
 */
export type ConversationRow =
  | { kind: "entry"; entry: ChatEntryData }
  | { kind: "intent"; intent: ConversationIntent };

type SendDraft = {
  draftKey: string;
  text: string;
  agent: string | null;
  expectedSessionId: string | null;
  inboxId: string;
};

/**
 * What a reply names of the message it answers: its id, its number in the inbox and its text.
 */
export type ReplyTarget = { id: string; number: number; body: string };

/**
 * The owners of the conversations open in this tab, one per draft scope (user and chat inbox), so Home and Chat share
 * it.
 */
const owners = new Map<string, ReturnType<typeof createOwner>>();

function createOwner(draftKey: string) {
  const drafts = useMessageDrafts();
  const intents = reactive<ConversationIntent[]>([]);
  const refusals = reactive(new Map<string, string>());

  /**
   * What a screen reader receives next about the sends: Sending, Sent, or why one was refused, once each.
   */
  const announcement = ref("");
  // Set once the chat is lost: every late answer of a request sent before is ignored, and nothing is sent again.
  let isPurged = false;
  const userId = draftKey.split("/")[0];

  onPurge(() => {
    intents.splice(0, intents.length);
    drafts.purgeUser(userId);
  });

  function begin(
    kind: "send" | "reply",
    text: string,
    replyToId: string | null,
    body: Record<string, FormDataConvertible>,
  ) {
    const key = newRequestId();
    drafts.recordRecovery({ intentKey: key, draftKey, text, replyToId });
    drafts.clearSent(draftKey, text);
    const intent: ConversationIntent = {
      key,
      kind,
      body,
      text,
      replyToId,
      status: "sending",
      refusal: null,
      isTransportOpen: true,
      confirmedGeneration: 0,
      checkedGeneration: 0,
    };
    intents.push(intent);
    announcement.value = "Sending";

    return intents[intents.length - 1];
  }

  /**
   * Starts a send of the draft: its key, its recovery entry, the cleared draft and a Sending row, at once.
   */
  function beginSend(draft: SendDraft): ConversationIntent {
    return begin("send", draft.text, null, {
      body: draft.text,
      agent: draft.agent,
      expectedSessionId: draft.expectedSessionId,
      inboxId: draft.inboxId,
    });
  }

  /**
   * Starts a reply to the message, in the chat it was posted in: a send that names the message's number.
   */
  function beginReply(draft: SendDraft, original: ReplyTarget): ConversationIntent {
    return begin("reply", draft.text, original.id, {
      body: draft.text,
      agent: draft.agent,
      expectedSessionId: draft.expectedSessionId,
      inboxId: draft.inboxId,
      targetMessageNumber: original.number,
    });
  }

  function refuse(intent: ConversationIntent): void {
    if (isPurged) {
      return;
    }

    const index = intents.indexOf(intent);

    if (index >= 0) {
      intents.splice(index, 1);
    }

    const reason = intent.refusal ?? "The message was not sent.";
    refusals.set(intent.key, reason);
    announcement.value = `Not sent: ${reason}`;
    drafts.restoreOrOffer(intent.key);
  }

  /**
   * Puts a refused send's text back into the composer, after what is typed there now.
   */
  function restore(intentKey: string): void {
    const entry = drafts
      .recoveryEntries(draftKey)
      .find((recovery) => recovery.intentKey === intentKey);

    if (entry === undefined) {
      return;
    }

    const typed = drafts.read(draftKey);
    drafts.write(
      draftKey,
      typed === "" ? entry.text : `${typed}\n\n${entry.text}`,
    );
    discardRecovery(intentKey);
  }

  function discardRecovery(intentKey: string): void {
    drafts.discard(intentKey);
    refusals.delete(intentKey);
  }

  /**
   * Why a send was refused, when this tab heard it; after a reload only that it was not sent.
   */
  function refusalOf(intentKey: string): string {
    return refusals.get(intentKey) ?? "The message was not sent.";
  }

  /**
   * Sends the intention through Inertia under its request key, reading back only the conversation's own prop, with
   * no optimistic update, so reads that other tabs' rows cause keep arriving while it is out. A refusal comes back
   * as errors; an answer that never came is settled by reading the conversation again.
   */
  function submit(intent: ConversationIntent, conversationProp: string): void {
    if (isPurged) {
      return;
    }

    keyedPost(
      sendRoute().url,
      intent.body,
      intent.key,
      {
        onAccepted: () => confirmBy(intent),
        onRefused: (reason) => {
          intent.refusal = reason;
          refuse(intent);
        },
        onUncertain: () => checkByRead(intent),
        onFinish: () => finishTransport(intent),
      },
      [conversationProp],
    );
  }

  /**
   * The server took the send; the conversation it reads back shows its entry.
   */
  function confirmBy(intent: ConversationIntent): void {
    if (!isPurged && intent.status === "sending") {
      intent.status = "confirmed";
      intent.confirmedGeneration = markDirty("write");
      drafts.confirm(intent.key);
      announcement.value = "Sent";
    }
  }

  /**
   * The answer never came: the conversation is read again, and a read that answered leaves it unknown, with Check
   * again, which sends it once more under its own request key.
   */
  function checkByRead(intent: ConversationIntent): void {
    if (isPurged || intent.status === "confirmed") {
      return;
    }

    intent.status = "uncertain";
    intent.checkedGeneration = markDirty("write");
  }

  /**
   * Reads the conversation again for an intention left unknown.
   */
  function checkAgain(intent: ConversationIntent): void {
    checkByRead(intent);
  }

  /**
   * Sends an intention left unknown again under its own request key, so the server answers the message it already
   * made rather than posting a second one.
   */
  function retry(intent: ConversationIntent, conversationProp: string): void {
    if (intent.isTransportOpen) {
      return;
    }

    intent.status = "sending";
    intent.isTransportOpen = true;
    submit(intent, conversationProp);
  }

  /**
   * The request is over, whatever it answered: the composer may send again, and a confirmation stays.
   */
  function finishTransport(intent: ConversationIntent): void {
    intent.isTransportOpen = false;
  }

  /**
   * Whether a read that began after the intention's confirmation answered, so an older snapshot never takes a
   * confirmed send away and a newer one, which shows its entry, removes it.
   */
  function isSettled(intent: ConversationIntent): boolean {
    return (
      intent.status === "confirmed" &&
      appliedReadGeneration.value >= intent.confirmedGeneration
    );
  }

  /**
   * The rows to show: the entries the server returned, with each of the user's own sends still settling after them.
   */
  function rows(entries: ChatEntryData[]): ConversationRow[] {
    return [
      ...entries.map((entry): ConversationRow => ({ kind: "entry", entry })),
      ...intents
        .filter((intent) => !isSettled(intent))
        .map((intent): ConversationRow => ({ kind: "intent", intent })),
    ];
  }

  /**
   * Forgets the intentions a read settled; called when a read was applied.
   */
  function settle(): void {
    for (const intent of intents.filter((pending) => isSettled(pending))) {
      intents.splice(intents.indexOf(intent), 1);
      drafts.confirm(intent.key);
    }

    for (const intent of intents.filter(
      (pending) => pending.status === "uncertain",
    )) {
      if (appliedReadGeneration.value >= intent.checkedGeneration) {
        intent.status = "unknown";
      }
    }
  }

  /**
   * Whether a request of this conversation is still out.
   */
  function isSending(): boolean {
    return intents.some((intent) => intent.isTransportOpen);
  }

  /**
   * Forgets every send of a chat this tab lost; their late answers change nothing.
   */
  function purge(): void {
    isPurged = true;
    intents.splice(0, intents.length);
    refusals.clear();
  }

  return {
    intents,
    purge,
    beginSend,
    beginReply,
    submit,
    checkAgain,
    retry,
    finishTransport,
    rows,
    settle,
    isSending,
    announcement,
    recoveryEntries: () => drafts.recoveryEntries(draftKey),
    restore,
    discardRecovery,
    refusalOf,
  };
}

export type ConversationIntents = ReturnType<typeof createOwner>;

// A chat this tab lost takes its sends, its drafts and its recoveries with it.
onChatAccessEnded((inboxId) => {
  for (const [key, owner] of [...owners]) {
    if (!key.endsWith(`/${inboxId}`)) {
      continue;
    }

    owner.purge();
    owners.delete(key);
  }

  useMessageDrafts().purgeChat(inboxId);
});

/**
 * The one owner of the user's sends in one chat, the same on Home and on Chat's own page.
 */
export function useConversationIntents(draftKey: string): ConversationIntents {
  const known = owners.get(draftKey);

  if (known !== undefined) {
    return known;
  }

  const owner = createOwner(draftKey);
  owners.set(draftKey, owner);

  return owner;
}

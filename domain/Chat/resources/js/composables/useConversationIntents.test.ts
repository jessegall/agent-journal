// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import type { ChatMessageData } from "@generated/types/chat";

type PostOptions = {
  async: boolean;
  only: string[];
  preserveState: boolean;
  optimistic?: unknown;
  headers: Record<string, string>;
  onSuccess: (page: { flash: Record<string, unknown> }) => void;
  onError: (errors: Record<string, string>) => void;
  onNetworkError: () => boolean;
  onFinish: () => void;
};

const applied = ref(0);
let marked = 0;
let keyCount = 0;
const posts: Array<{
  url: string;
  data: Record<string, unknown>;
  options: PostOptions;
}> = [];

vi.mock("@inertiajs/vue3", () => ({
  router: {
    post: (url: string, data: Record<string, unknown>, options: PostOptions) =>
      posts.push({ url, data, options }),
  },
}));
vi.mock("@kit/usePageChanges", () => ({
  appliedReadGeneration: applied,
  markDirty: () => ++marked,
}));
vi.mock("@kit/requestId", () => ({ newRequestId: () => `key-${++keyCount}` }));
vi.mock("@kit/protectedView", () => ({ onPurge: () => () => undefined }));
vi.mock("@generated/routes/chat", () => ({
  send: () => ({ url: "/chat/messages", method: "post" }),
  reply: () => ({ url: "/chat/messages/reply", method: "post" }),
}));

const { useConversationIntents } = await import("./useConversationIntents");
const { notifyChatAccessEnded } = await import("@kit/chatAccess");
const { useMessageDrafts } = await import("./useMessageDrafts");

let scope = 0;

/**
 * The draft as the composer holds it once the text was typed.
 */
function draft(text: string) {
  useMessageDrafts().write(`user-${scope}/inbox-chat`, text);

  return {
    draftKey: `user-${scope}/inbox-chat`,
    text,
    agent: "agent-1",
    expectedSessionId: "session-1",
    expectedGeneration: 1,
    inboxId: "inbox-chat",
  };
}

function row(id: string, requestKey: string | null): ChatMessageData {
  return { id, requestKey } as ChatMessageData;
}

function ownerOf() {
  return useConversationIntents(`user-${scope}/inbox-chat`);
}

describe("useConversationIntents", () => {
  beforeEach(() => {
    scope++;
    posts.length = 0;
    applied.value = 0;
    marked = 0;
  });

  it("posts through Inertia under its key, reading back only the conversation prop, with no optimistic update", () => {
    const owner = ownerOf();
    const intent = owner.beginSend(draft("Hello"));

    owner.submit(intent, "window_chat_conversation");

    expect(posts[0].url).toBe("/chat/messages");
    expect(posts[0].options).toMatchObject({
      async: true,
      only: ["window_chat_conversation"],
      preserveState: true,
      headers: { "Idempotency-Key": intent.key },
    });
    expect(posts[0].options.optimistic).toBeUndefined();
    expect(useMessageDrafts().read(`user-${scope}/inbox-chat`)).toBe("");
  });

  it("forgets a lost chat: its pending send, its draft, and nothing restores into it later", () => {
    const owner = ownerOf();
    const intent = owner.beginSend(draft("Hello"));
    owner.submit(intent, "window_chat_conversation");

    notifyChatAccessEnded("inbox-chat");
    posts[0].options.onError({ body: "Refused" });
    useMessageDrafts().write(`user-${scope}/inbox-chat`, "Typed after");

    expect(owner.intents).toHaveLength(0);
    expect(useMessageDrafts().read(`user-${scope}/inbox-chat`)).toBe("");
  });

  it("posts at the chat inbox under the same request key it sends again on a retry", () => {
    const owner = ownerOf();
    const intent = owner.beginSend(draft("Hello"));

    owner.submit(intent, "window_chat_conversation");
    owner.finishTransport(intent);
    owner.retry(intent, "window_chat_conversation");

    expect(posts[0].data).toMatchObject({
      inboxId: "inbox-chat",
      requestKey: intent.key,
    });
    expect(posts[1].data).toMatchObject({ requestKey: intent.key });
    expect(posts[1].options.headers).toEqual({ "Idempotency-Key": intent.key });
  });

  it("replaces the Sending bubble with the one row a read returned while the request is still out", () => {
    const owner = ownerOf();
    const intent = owner.beginSend(draft("Hello"));
    owner.submit(intent, "page");

    expect(owner.rows([]).map((shown) => shown.kind)).toEqual(["intent"]);
    expect(
      owner.rows([row("message-1", intent.key)]).map((shown) => shown.kind),
    ).toEqual(["message"]);
    expect(owner.isSending()).toBe(true);
  });

  it("keeps a confirmed send across an older read, and lets a read begun after it decide", () => {
    const owner = ownerOf();
    const intent = owner.beginSend(draft("Hello"));
    owner.submit(intent, "page");

    posts[0].options.onSuccess({ flash: {} });
    posts[0].options.onFinish();

    expect(intent.status).toBe("confirmed");
    expect(owner.rows([]).map((shown) => shown.kind)).toEqual(["intent"]);
    applied.value = intent.confirmedGeneration;
    expect(owner.rows([])).toEqual([]);
    expect(owner.isSending()).toBe(false);
  });

  it("settles a lost answer by reading the conversation again: found by its key, or unknown when missing", () => {
    const owner = ownerOf();
    const found = owner.beginSend(draft("Found"));
    owner.submit(found, "page");
    const missing = owner.beginSend(draft("Missing"));
    owner.submit(missing, "page");

    posts[0].options.onNetworkError();
    posts[1].options.onNetworkError();
    expect([found.status, missing.status]).toEqual(["uncertain", "uncertain"]);
    applied.value = marked;
    owner.settle([row("message-1", found.key)]);

    expect(
      owner.rows([row("message-1", found.key)]).map((shown) => shown.kind),
    ).toEqual(["message", "intent"]);
    expect(missing.status).toBe("unknown");
  });

  it("takes away only the refused row, offers its text, and keeps a second send independent", () => {
    const owner = ownerOf();
    const first = owner.beginSend(draft("First"));
    owner.submit(first, "page");
    const second = owner.beginSend(draft("Second"));
    owner.submit(second, "page");

    posts[0].options.onError({
      session: "The agent now runs another session.",
    });

    expect(first.key).not.toBe(second.key);
    expect(
      owner
        .rows([])
        .map((shown) => shown.kind === "intent" && shown.intent.text),
    ).toEqual(["Second"]);
    expect(owner.recoveryEntries().map((entry) => entry.text)).toContain(
      "First",
    );
    expect(owner.refusalOf(first.key)).toBe(
      "The agent now runs another session.",
    );
  });
});

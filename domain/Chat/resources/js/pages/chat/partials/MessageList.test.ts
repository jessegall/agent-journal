// @vitest-environment happy-dom
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import type { ChatEntryData } from "@generated/types/chat";
import type { ConversationIntent } from "../../../composables/useConversationIntents";

vi.mock("@inertiajs/vue3", () => ({
  Link: { template: "<a><slot /></a>" },
  router: { on: vi.fn(), post: vi.fn() },
}));
vi.mock("@generated/routes/chat", () => ({
  react: () => ({ url: "/chat/react" }),
}));

const { default: MessageList } = await import("./MessageList.vue");

function intent(status: ConversationIntent["status"]): ConversationIntent {
  return {
    key: `key-${status}`,
    kind: "send",
    body: {},
    text: `Text while ${status}`,
    replyToId: null,
    status,
    refusal: null,
    isTransportOpen: status === "sending",
    confirmedGeneration: 0,
    checkedGeneration: 0,
  };
}

function message(
  number: number,
  author: string,
  authorLabel: string,
  options: { group?: number; body?: string; targetNumber?: number } = {},
): ChatEntryData {
  const targetNumber = options.targetNumber ?? null;

  return {
    id: `m${number}`,
    type: "message",
    groupNumber: options.group ?? number,
    author,
    authorLabel,
    createdAt: `2026-11-22T13:0${number}:00Z`,
    message: {
      id: `m${number}`,
      number,
      body: options.body ?? `message ${number}`,
      targetMessageId: targetNumber === null ? null : `m${targetNumber}`,
      targetNumber,
      isReadByViewer: true,
    },
  } as ChatEntryData;
}

function listOf(
  props: {
    entries?: ChatEntryData[];
    pending?: ConversationIntent[];
    refused?: { entry: object; reason: string }[];
    viewer?: string;
  } = {},
) {
  return mount(MessageList, {
    props: {
      entries: props.entries ?? [],
      hasOlder: false,
      pending: props.pending ?? [],
      refused: props.refused ?? [],
      viewer: props.viewer ?? "user:user-1",
      participants: [],
      conversationProp: "page",
      inboxId: "inbox-chat",
    } as never,
  });
}

describe("MessageList", () => {
  it("shows a send still settling as Sending with no reply or other action", () => {
    const list = listOf({ pending: [intent("sending")] });

    expect(list.text()).toContain("Text while sending");
    expect(list.text()).toContain("Sending…");
    expect(list.findAll("button")).toHaveLength(0);
  });

  it("offers Check again for an outcome no lookup could tell", async () => {
    const list = listOf({ pending: [intent("unknown")] });

    expect(list.text()).toContain("We couldn't confirm whether this was sent.");
    await list.get("button").trigger("click");
    expect(list.emitted("checkAgain")).toHaveLength(1);
  });

  it("shows a refused send with the server reason and its text, to restore or discard", async () => {
    const entry = { intentKey: "key-1", draftKey: "user-1/agent-1", text: "My reply", replyToId: null };
    const list = listOf({ refused: [{ entry: { ...entry, generation: 1, keptAt: 0 }, reason: "The message changed." }] });

    expect(list.text()).toContain("My reply");
    expect(list.text()).toContain("The message changed.");
    const [restore, discard] = list.findAll("button");
    await restore.trigger("click");
    await discard.trigger("click");
    expect(list.emitted("restore")).toEqual([["key-1"]]);
    expect(list.emitted("discard")).toEqual([["key-1"]]);
  });

  it("puts who a reply answers and a line of the original above its text, as You for the viewer's own", () => {
    const entries = [
      message(1, "user:ada", "Ada", { body: "Agreed" }),
      message(2, "user:bea", "Bea", { body: "Thanks", targetNumber: 1 }),
    ];

    const asCy = listOf({ entries, viewer: "user:cy" });
    const reply = asCy.findAll("article")[1];
    expect(reply.text()).toContain("Ada");
    expect(reply.text().indexOf("Agreed")).toBeLessThan(reply.text().indexOf("Thanks"));
    expect(listOf({ entries, viewer: "user:ada" }).findAll("article")[1].text()).toContain("You");
  });

  it("names a reply to an original not loaded yet by its number", () => {
    const list = listOf({ entries: [message(5, "user:bea", "Bea", { targetNumber: 2 })], viewer: "user:cy" });

    expect(list.text()).toContain("Reply to message 2");
  });

  it("names an author once for a run of messages in one group and again for the next group", () => {
    const list = listOf({
      entries: [
        message(1, "agent:a1", "Builder", { group: 1 }),
        message(2, "agent:a1", "Builder", { group: 1 }),
        message(3, "agent:a1", "Builder", { group: 2 }),
      ],
      viewer: "user:ada",
    });

    const names = list.findAll("article").map((article) => article.text().includes("Builder"));
    expect(names).toEqual([true, false, true]);
  });

  it("shows a body as text, never as HTML", () => {
    const list = listOf({ entries: [message(1, "user:ada", "Ada", { body: "<b>bold</b>" })], viewer: "user:cy" });

    expect(list.find("b").exists()).toBe(false);
    expect(list.text()).toContain("<b>bold</b>");
  });
});

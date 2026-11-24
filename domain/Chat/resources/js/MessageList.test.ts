// @vitest-environment happy-dom
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import type { ConversationIntent } from "./composables/useConversationIntents";

vi.mock("@inertiajs/vue3", () => ({
  Link: { template: "<a><slot /></a>" },
  router: { on: vi.fn() },
}));
vi.mock("@generated/routes/chat", () => ({
  history: () => ({ url: "/chat/history" }),
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

function listOf(
  pending: ConversationIntent[],
  refused: { entry: object; reason: string }[] = [],
) {
  return mount(MessageList, {
    props: {
      lines: [],
      messages: [],
      pending,
      refused,
      viewer: "user:user-1",
      participants: [],
    } as never,
  });
}

describe("MessageList", () => {
  it("shows a send still settling as Sending with no reply or other action", () => {
    const list = listOf([intent("sending")]);

    expect(list.text()).toContain("Text while sending");
    expect(list.text()).toContain("Sending…");
    expect(list.findAll("button")).toHaveLength(0);
  });

  it("offers Check again for an outcome no lookup could tell", async () => {
    const list = listOf([intent("unknown")]);

    expect(list.text()).toContain("We couldn't confirm whether this was sent.");
    await list.get("button").trigger("click");
    expect(list.emitted("checkAgain")).toHaveLength(1);
  });

  it("shows a refused send with the server reason and its text, to restore or discard", async () => {
    const entry = {
      intentKey: "key-1",
      draftKey: "user-1/agent-1",
      text: "My reply",
      replyToId: null,
    };
    const list = listOf(
      [],
      [
        {
          entry: { ...entry, generation: 1, keptAt: 0 },
          reason: "The message changed.",
        },
      ],
    );

    expect(list.text()).toContain("My reply");
    expect(list.text()).toContain("The message changed.");
    const [restore, discard] = list.findAll("button");
    await restore.trigger("click");
    await discard.trigger("click");
    expect(list.emitted("restore")).toEqual([["key-1"]]);
    expect(list.emitted("discard")).toEqual([["key-1"]]);
  });

  it("shows the addressee arrow, an unavailable original, and answer and decline only from the server actions", () => {
    const row = (id: string, answer: boolean) => ({
      id,
      sequence: 1,
      rootId: null,
      speaker: { actor: "user:ada", label: "Ada", driver: null },
      addressedTo: "user:bea",
      replyTo: { id: null, visible: false },
      body: "Ready?",
      state: "waiting_for_answer",
      stateVersion: 0,
      respondent: "user:bea",
      actions: { answer, decline: answer, retryDelivery: false },
      readByMe: true,
      sentAt: "2026-11-22T13:42:00Z",
      requestKey: null,
      deliveries: [],
      reactions: [],
    });
    const participants = [
      { actor: "user:ada", label: "Ada", driver: null, role: "owner" },
      { actor: "user:bea", label: "Bea", driver: null, role: "member" },
    ];
    const asBea = mount(MessageList, {
      props: {
        lines: [],
        messages: [row("q1", true)],
        pending: [],
        refused: [],
        viewer: "user:bea",
        participants,
        questionUrl: () => "#",
      } as never,
    });
    const asCy = mount(MessageList, {
      props: {
        lines: [],
        messages: [row("q1", false)],
        pending: [],
        refused: [],
        viewer: "user:cy",
        participants,
        questionUrl: () => "#",
      } as never,
    });

    expect(asBea.text()).toContain("Ada");
    expect(asBea.text()).toContain("→ Bea");
    expect(asBea.find("article span.italic").exists()).toBe(true);
    expect(asBea.find("article").attributes("aria-label")).toBe("Ada to Bea");
    expect(asBea.find("article").attributes("tabindex")).toBe("0");
    expect(asBea.find('a[href^="#message-"]').exists()).toBe(false);
    expect(asBea.text()).toContain("Answer");
    expect(asBea.text()).toContain("Decline");
    expect(asCy.text()).toContain("Reply");
    expect(asCy.text()).not.toContain("Decline");
  });

  it("shows which recipient was not delivered under your bubble, and the retry only when the server offers it", () => {
    const row = (retryDelivery: boolean) => ({
      id: "m1",
      sequence: 1,
      rootId: null,
      speaker: { actor: "user:ada", label: "Ada", driver: null },
      addressedTo: null,
      body: "Plan?",
      state: "sent",
      stateVersion: 0,
      respondent: null,
      actions: { answer: false, decline: false, retryDelivery },
      readByMe: true,
      sentAt: "2026-11-22T13:42:00Z",
      requestKey: null,
      deliveries: [
        {
          recipient: "agent:claude",
          label: "Claude",
          state: "accepted",
          reason: null,
          pendingFrom: null,
          rangeId: null,
        },
        {
          recipient: "agent:codex",
          label: "Codex",
          state: "exhausted",
          reason: "The driver did not answer.",
          pendingFrom: 8000,
          rangeId: retryDelivery ? "range-1" : null,
        },
      ],
      reactions: [],
    });
    const props = {
      lines: [],
      pending: [],
      refused: [],
      viewer: "user:ada",
      participants: [],
      questionUrl: () => "#",
      conversationProp: "chat",
      inboxId: "inbox",
    };
    const operator = mount(MessageList, {
      props: { ...props, messages: [row(true)] } as never,
    });
    const sender = mount(MessageList, {
      props: { ...props, messages: [row(false)] } as never,
    });

    expect(operator.text()).toContain("Codex: Not delivered");
    expect(operator.text()).not.toContain("8000");
    expect(operator.text()).not.toContain("Claude:");
    expect(operator.findAll("button").map((button) => button.text())).toContain(
      "Retry",
    );
    expect(sender.text()).toContain("Codex: Not delivered");
    expect(sender.text()).not.toContain("Retry");
  });

  it("keeps an agent's steps and answer in one turn, with React and Reply on the answer's name line", () => {
    const message = (id: string, sequence: number, driver: string | null) => ({
      id,
      sequence,
      rootId: null,
      speaker: { actor: driver === null ? "user:ada" : "agent:main", label: id, driver },
      addressedTo: null,
      body: `Body ${id}`,
      state: "sent",
      stateVersion: 0,
      respondent: null,
      actions: { answer: false, decline: false, retryDelivery: false },
      readByMe: true,
      sentAt: "2026-11-22T13:42:00Z",
      requestKey: null,
      deliveries: [],
      reactions: [],
    });
    const step = {
      sequence: 2,
      subject: "Ship",
      line: "Step 1 of 4",
      postedAt: "2026-11-22T13:43:00Z",
      card: null,
      cardPlacement: "inline" as const,
    };
    const list = mount(MessageList, {
      props: {
        lines: [step],
        messages: [message("asked", 1, null), message("answered", 3, "claude-code")],
        pending: [],
        refused: [],
        viewer: "user:bea",
        participants: [],
        questionUrl: () => "#",
      } as never,
    });
    const turns = list.findAll("[data-turn]");
    const controls = list.find("#message-answered [data-message-actions]");

    expect(turns).toHaveLength(2);
    expect(turns[0].text()).toContain("Body asked");
    expect(turns[1].text()).toContain(step.line);
    expect(turns[1].text()).toContain("Body answered");
    expect(controls.findAll("button").map((button) => button.text())).toEqual(["React", "Reply"]);
  });

  it("shows a plain line between the messages at its timeline position", () => {
    const message = (id: string, sequence: number) => ({
      id,
      sequence,
      rootId: null,
      speaker: { actor: "user:ada", label: "Ada", driver: null },
      addressedTo: null,
      body: `Body ${id}`,
      state: "sent",
      stateVersion: 0,
      respondent: null,
      actions: { answer: false, decline: false, retryDelivery: false },
      readByMe: true,
      sentAt: "2026-11-22T13:42:00Z",
      requestKey: null,
      deliveries: [],
      reactions: [],
    });
    const step = {
      sequence: 2,
      subject: "Ship",
      line: "Step 1 of 4",
      postedAt: "2026-11-22T13:43:00Z",
      card: null,
      cardPlacement: "inline" as const,
    };
    const list = mount(MessageList, {
      props: {
        lines: [step],
        messages: [message("first", 1), message("second", 3)],
        pending: [],
        refused: [],
        viewer: "user:bea",
        participants: [],
        questionUrl: () => "#",
      } as never,
    });
    const text = list.text();

    expect(text.indexOf(step.line)).toBeGreaterThan(text.indexOf("Body first"));
    expect(text.indexOf(step.line)).toBeLessThan(text.indexOf("Body second"));
  });

  it("puts who a reply answers and a line of the original above its text, as You for the viewer's own", () => {
    const row = (id: string, actor: string, replyTo: object, body: string) => ({
      id,
      sequence: 1,
      rootId: null,
      speaker: { actor, label: actor === "user:ada" ? "Ada" : "Bea", driver: null },
      addressedTo: null,
      replyTo,
      body,
      state: "sent",
      stateVersion: 0,
      respondent: null,
      actions: { answer: false, decline: false, retryDelivery: false },
      readByMe: true,
      sentAt: "2026-11-22T13:42:00Z",
      requestKey: null,
      deliveries: [],
      reactions: [],
    });
    const original = { actor: "user:ada", label: "Ada", excerpt: "Agreed" };
    const list = (viewer: string) =>
      mount(MessageList, {
        props: {
          lines: [],
          messages: [row("r1", "user:bea", { id: "m0", visible: true, original }, "Thanks")],
          pending: [],
          refused: [],
          viewer,
          participants: [],
          questionUrl: () => "#",
        } as never,
      });

    const asCy = list("user:cy");
    const line = asCy.get("article button[title]");
    expect(line.text()).toContain("Ada");
    expect(line.text()).toContain("Agreed");
    expect(asCy.text().indexOf("Agreed")).toBeLessThan(asCy.text().indexOf("Thanks"));
    expect(list("user:ada").get("article button[title]").text()).toContain("You");
    expect(list("user:bea").get("article button[title]").text()).toContain("Ada");
  });

  it("names an agent once for a run of its messages and again after five minutes", () => {
    const row = (id: string, sequence: number, sentAt: string) => ({
      id,
      sequence,
      rootId: null,
      speaker: { actor: "agent:a1", label: "Builder", driver: "Claude Code" },
      addressedTo: null,
      body: id,
      state: "sent",
      stateVersion: 0,
      respondent: null,
      actions: { answer: false, decline: false, retryDelivery: false },
      readByMe: true,
      sentAt,
      requestKey: null,
      deliveries: [],
      reactions: [],
    });
    const list = mount(MessageList, {
      props: {
        lines: [],
        messages: [
          row("first", 1, "2026-11-22T13:00:00Z"),
          row("second", 2, "2026-11-22T13:02:00Z"),
          row("third", 3, "2026-11-22T13:09:00Z"),
        ],
        pending: [],
        refused: [],
        viewer: "user:ada",
        participants: [],
        questionUrl: () => "#",
      } as never,
    });

    const names = list.findAll("article").map((article) => article.text().includes("Builder"));
    expect(names).toEqual([true, false, true]);
  });

  it("keeps Delivered in view under your latest message only", () => {
    const row = (id: string, sequence: number) => ({
      id,
      sequence,
      rootId: null,
      speaker: { actor: "user:ada", label: "Ada", driver: null },
      addressedTo: null,
      body: id,
      state: "sent",
      stateVersion: 0,
      respondent: null,
      actions: { answer: false, decline: false, retryDelivery: false },
      readByMe: true,
      sentAt: "2026-11-22T13:42:00Z",
      requestKey: null,
      deliveries: [
        { recipient: "agent:a1", label: "Builder", state: "accepted", reason: null, pendingFrom: null, rangeId: null },
      ],
      reactions: [],
    });
    const list = mount(MessageList, {
      props: {
        lines: [],
        messages: [row("older", 1), row("latest", 2)],
        pending: [],
        refused: [],
        viewer: "user:ada",
        participants: [],
        questionUrl: () => "#",
      } as never,
    });

    const lines = list.findAll("p").filter((line) => line.text() === "Delivered");
    expect(lines).toHaveLength(2);
    expect(lines[0].classes()).toContain("opacity-0");
    expect(lines[1].classes()).not.toContain("opacity-0");
  });
});

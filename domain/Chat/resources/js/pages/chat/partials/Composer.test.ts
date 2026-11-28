// @vitest-environment happy-dom
import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import type { ReplyTarget } from "../../../composables/useConversationIntents";

const purgers: Array<() => void> = [];

const begun: string[] = [];

vi.mock("../../../composables/useConversationIntents", async () => {
  const { useMessageDrafts: drafts } =
    await import("../../../composables/useMessageDrafts");

  return {
    useConversationIntents: () => ({
      beginSend: (draft: { draftKey: string; text: string }) => {
        begun.push(draft.text);
        drafts().clearSent(draft.draftKey, draft.text);

        return { key: "intent-1" };
      },
      submit: () => undefined,
    }),
  };
});
vi.mock("@kit/protectedView", () => ({
  onPurge: (purger: () => void) => {
    purgers.push(purger);

    return () => undefined;
  },
}));
vi.mock("@kit/Button", () => ({
  default: { template: "<button><slot /></button>" },
}));
vi.mock("@kit/Icon", () => ({ default: { template: "<i />" } }));
vi.mock("../../../composables/useComposerHeight", () => ({
  useComposerHeight: () => undefined,
}));

const interrupted: string[] = [];

vi.mock("../../../composables/useTurnInterrupt", async () => {
  const { ref } = await import("vue");

  return {
    useTurnInterrupt: () => ({
      isPending: ref(false),
      refusal: ref(null),
      interrupt: (agent: { id: string }) => interrupted.push(agent.id),
    }),
  };
});

const { useMessageDrafts } = await import("../../../composables/useMessageDrafts");
const { default: Composer } = await import("./Composer.vue");

function mountComposer(
  replyingTo: ReplyTarget | null = null,
  workingAgent: object | null = null,
) {
  return mount(Composer, {
    props: {
      draftKey: "user-1/inbox-chat",
      agent: "agent-1",
      addresseeName: "Main agent",
      sessionId: null,
      inboxId: "inbox-chat",
      replyingTo,
      conversationProp: "window_chat_conversation",
      participants: [],
      viewer: "user:user-1",
      workingAgent,
    } as never,
  });
}

describe("Composer", () => {
  it("clears the text at once when Enter sends it, before any answer", async () => {
    const composer = mountComposer();
    await composer.find("textarea").setValue("Hello there");

    await composer.find("textarea").trigger("keydown.enter");

    expect(begun).toContain("Hello there");
    expect(
      (composer.find("textarea").element as HTMLTextAreaElement).value,
    ).toBe("");
  });

  it("shows the stored draft once mounted, and a purge empties it and removes the stored draft", async () => {
    useMessageDrafts().write("user-1/inbox-chat", "Half a thought");
    const composer = mountComposer();
    await flushPromises();
    expect(
      (composer.find("textarea").element as HTMLTextAreaElement).value,
    ).toBe("Half a thought");

    purgers.forEach((purger) => purger());
    await flushPromises();

    expect(
      (composer.find("textarea").element as HTMLTextAreaElement).value,
    ).toBe("");
    expect(useMessageDrafts().read("user-1/inbox-chat")).toBe("");
  });

  it("shows the message being answered with a button that stops the reply", async () => {
    const composer = mountComposer({ id: "m1", number: 1, body: "Which plan?" });

    expect(composer.text()).toContain("Which plan?");

    await composer.get('button[aria-label="Stop replying"]').trigger("click");

    expect(composer.emitted("cancelReply")).toHaveLength(1);
  });

  it("offers no Stop while the agent does not work", () => {
    const composer = mountComposer();

    expect(composer.find("[data-stop-turn]").exists()).toBe(false);
  });

  it("shows Stop beside Send while the agent works, and Stop and Esc stop only its turn", async () => {
    interrupted.length = 0;
    const composer = mountComposer(null, { id: "agent-1", sessionId: "session-1" });

    await composer.get("[data-stop-turn]").trigger("click");
    await composer.find("textarea").trigger("keydown.esc");

    expect(interrupted).toEqual(["agent-1", "agent-1"]);
    expect(begun).not.toContain("");
  });
});

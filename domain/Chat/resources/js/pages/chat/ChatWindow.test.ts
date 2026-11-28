// @vitest-environment happy-dom
import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import type { PropType } from "vue";
import { provideHostProp } from "@kit/hostProp";
import { provideWindowKey } from "@kit/useWindowQuery";
import type { ChatData, ConversationData } from "@generated/types/chat";

type Reload = { only: string[]; data: Record<string, unknown>; preserveUrl?: boolean; onFinish?: () => void };

const reloads: Reload[] = [];

vi.mock("@inertiajs/vue3", () => ({
  usePage: () => ({ component: "web/Home", url: "/", props: { viewer: { id: "user-window" }, drivers: [] } }),
  router: { reload: (options: Reload) => reloads.push(options) },
}));
vi.mock("./partials/ChatPane.vue", () => ({
  default: {
    props: ["chat"],
    template: '<section data-pane :data-agent="chat.selectedAgentId">{{ chat.conversation?.agentId }}</section>',
  },
}));
vi.mock("./partials/TerminalModal.vue", () => ({ default: { template: "<div />" } }));

const { default: ChatWindow } = await import("./ChatWindow.vue");
const { useOpenChats } = await import("../../composables/useOpenChats");

function conversationOf(agentId: string): ConversationData {
  return { agentId, inboxId: `inbox-${agentId}` } as unknown as ConversationData;
}

function windowWith(selectedAgentId: string, conversation: ConversationData): ChatData {
  return {
    agents: [
      { id: "agent-2", sessionId: null },
      { id: "agent-3", sessionId: null },
    ],
    selectedAgentId,
    conversation,
  } as unknown as ChatData;
}

function mountOnHome(data: ChatData) {
  return mount(defineComponent({
    props: { data: { type: Object as PropType<ChatData>, required: true } },
    setup(props) {
      provideWindowKey("chat.conversation");
      provideHostProp("window_chat_conversation");

      return () => h(ChatWindow, { data: props.data });
    },
  }), { props: { data } });
}

describe("ChatWindow", () => {
  beforeEach(() => {
    reloads.length = 0;
    window.history.replaceState(null, "", "/");
    const chats = useOpenChats("user-window");
    chats.chats.agentIds = [];
    chats.chats.recent = [];
    chats.open("agent-3");
    chats.open("agent-2");
    chats.showColumns(2);
  });

  it("reads each column side by side by its own reload of the chat window alone, on its skeleton until it answers", async () => {
    const window = mountOnHome(windowWith("agent-2", conversationOf("agent-2")));
    await flushPromises();

    expect(window.get('[data-column="agent-2"]').text()).toBe("agent-2");
    expect(window.get('[data-column="agent-3"]').find("[data-column-loading]").exists()).toBe(true);
    expect(reloads).toHaveLength(1);
    expect(reloads[0]).toMatchObject({
      only: ["window_chat_conversation"],
      data: { window: { "chat.conversation": { read: "agent-3" } } },
      preserveUrl: true,
    });

    await window.setProps({ data: windowWith("agent-2", conversationOf("agent-3")) });

    reloads[0].onFinish?.();
    await flushPromises();

    expect(window.get('[data-column="agent-3"]').text()).toBe("agent-3");
    expect(window.get('[data-column="agent-2"]').text()).toBe("agent-2");
    expect(reloads).toHaveLength(1);
  });

  it("opens Home with two chats open on one chat alone, reading no other", async () => {
    useOpenChats("user-window").showColumns(1);

    const window = mountOnHome(windowWith("agent-2", conversationOf("agent-2")));
    await flushPromises();

    expect(window.find("[data-side-by-side]").exists()).toBe(false);
    expect(window.findAll("[data-pane]")).toHaveLength(1);
    expect(reloads).toEqual([]);
  });

  it("keeps the full address in one column even if Home has more visible", async () => {
    const window = mount(ChatWindow, { props: { data: windowWith("agent-2", conversationOf("agent-2")) } });
    await flushPromises();

    expect(window.find("[data-side-by-side]").exists()).toBe(false);
    expect(window.get("[data-pane]").text()).toBe("agent-2");
    expect(reloads).toEqual([]);
  });

});

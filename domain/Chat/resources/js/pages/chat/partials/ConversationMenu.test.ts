// @vitest-environment happy-dom
import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import type { AgentOptionData } from "@generated/types/chat";

const visited: string[] = [];

vi.mock("@inertiajs/vue3", () => ({
  router: { visit: (url: string) => visited.push(url), reload: () => undefined },
}));

const { default: ConversationMenu } = await import("./ConversationMenu.vue");
const { HANDED_RECORD_TYPE, useHandOver } =
  await import("../../../composables/useHandOver");

function agent(
  id: string,
  name: string,
  facts: Partial<AgentOptionData> = {},
): AgentOptionData {
  const retired = facts.isRetired === true;

  return {
    id,
    name,
    profileKey: "journal-main",
    isRetired: retired,
    presence: retired ? "retired" : "idle",
    presenceLabel: retired ? "Retired" : "Idle",
    sessionId: null,
    sessionGeneration: 0,
    hasTerminal: false,
    switchId: null,
    switchStage: null,
    switchStageLabel: null,
    isSwitchOver: true,
    actions: [],
    conversations: [],
    startRefusal: null,
    sessionDriver: null,
    sessionDriverLabel: null,
    sessionModel: null,
    needsAttention: false,
    isMain: false,
    unreadCount: 0,
    lastActiveAt: null,
    waitsOnYou: false,
    status: {
      sessionState: retired ? "retired" : "idle",
      isStartRefused: false,
      label: retired ? "Retired" : "Idle",
      reason: null,
      remedy: null,
      commandOutcome: null,
      observationAgeSeconds: null,
      actions: [],
      isProcessConfirmed: false,
    },
    ...facts,
  } as AgentOptionData;
}

const agents = [
  agent("main", "Main agent", { isMain: true, lastActiveAt: "2026-11-28T09:00:00Z" }),
  agent("reviewer", "Reviewer", {
    lastActiveAt: "2026-11-28T10:00:00Z",
    waitsOnYou: true,
    unreadCount: 3,
  }),
  agent("writer", "Writer", { lastActiveAt: "2026-11-28T08:00:00Z" }),
  agent("old", "Old writer", { isRetired: true }),
];

async function openList(shown: AgentOptionData[] = agents) {
  const list = mount(ConversationMenu, {
    props: {
      agents: shown,
      selectedAgentId: "main",
      openAgentIds: ["main"],
      agentUrl: (chosen: AgentOptionData) => `/?agent=${chosen.id}`,
    },
  });
  await list.get("[data-chat-list-trigger]").trigger("click");
  await flushPromises();

  return list;
}

function rowIds(list: Awaited<ReturnType<typeof openList>>): string[] {
  return list.findAll("[data-conversation]").map((row) => row.attributes("data-conversation") ?? "");
}

describe("ConversationMenu", () => {
  it("lists the chats On Home first, then the Recent ones most recently active first, retired agents hidden", async () => {
    const list = await openList();

    expect(list.findAll("[data-group]").map((group) => group.attributes("data-group"))).toEqual([
      "On Home",
      "Recent",
    ]);
    expect(rowIds(list)).toEqual(["main", "reviewer", "writer"]);
    expect(list.get('[data-conversation="main"]').text()).toContain("main");
    expect(list.get('[data-conversation="main"]').attributes("aria-current")).toBe("true");
  });

  it("shows a row's unread count and a chip when its question waits on the viewer", async () => {
    const row = (await openList()).get('[data-conversation="reviewer"]');

    expect(row.find('[aria-label="3 unread"]').exists()).toBe(true);
    expect(row.find("[data-waits-on-you]").exists()).toBe(true);
  });

  it("searches the names and underlines the match", async () => {
    const list = await openList();

    await list.get('input[role="combobox"]').setValue("writ");

    expect(rowIds(list)).toEqual(["writer"]);
    expect(list.get('[data-conversation="writer"] u').text()).toBe("Writ");
  });

  it("says when nothing matches, and offers New chat and the retired agents that match", async () => {
    const list = await openList();

    await list.get('input[role="combobox"]').setValue("old");

    expect(list.get("[data-no-match]").text()).toContain("No chat matches “old”");
    expect(list.get("[data-no-match]").text()).toContain("Show retired agents");
    await list.findAll("[data-no-match] button").at(-1)?.trigger("click");
    expect(list.emitted("newChat")).toHaveLength(1);
  });

  it("filters to the main agents, the helpers, or the chats that wait on the viewer with their count", async () => {
    const list = await openList();

    await list.get('[data-filter="main"]').trigger("click");
    expect(rowIds(list)).toEqual(["main"]);

    await list.get('[data-filter="helper"]').trigger("click");
    expect(rowIds(list)).toEqual(["reviewer", "writer"]);

    expect(list.get('[data-filter="waiting"]').text()).toContain("1");
    await list.get('[data-filter="waiting"]').trigger("click");
    expect(rowIds(list)).toEqual(["reviewer"]);
  });

  it("shows the retired agents behind a toggle", async () => {
    const list = await openList();

    expect(list.get("[data-retired-toggle]").text()).toBe("Show 1 retired agents");
    await list.get("[data-retired-toggle]").trigger("click");

    expect(rowIds(list)).toContain("old");
    expect(list.get("[data-retired-toggle]").text()).toBe("Hide retired agents");
  });

  it("caps the list at 336 px and scrolls it, with the foot outside it", async () => {
    const list = await openList();
    const rows = list.get("[data-chat-list]");

    expect(rows.classes()).toContain("max-h-[336px]");
    expect(rows.classes()).toContain("overflow-y-auto");
    expect(rows.find("[data-new-chat]").exists()).toBe(false);
    expect(list.find("[data-new-chat]").exists()).toBe(true);
  });

  it("lists no group chat and offers no New group chat or Add someone", async () => {
    const list = await openList();

    expect(list.text()).not.toContain("Group");
    expect(list.find("[data-new-group]").exists()).toBe(false);
    expect(list.find("[data-add-someone]").exists()).toBe(false);
  });

  it("opens a chat with Enter after moving to it, and beside this one with Shift+Enter", async () => {
    visited.length = 0;
    const list = await openList();
    const field = list.get('input[role="combobox"]');

    await field.trigger("keydown", { key: "ArrowDown" });
    await field.trigger("keydown", { key: "Enter", shiftKey: true });

    expect(list.emitted("openBeside")?.[0]).toEqual([agents[1]]);

    await list.get("[data-chat-list-trigger]").trigger("click");
    await flushPromises();
    await list.get('input[role="combobox"]').trigger("keydown", { key: "Enter" });

    expect(visited).toEqual(["/?agent=main"]);
  });

  it("offers End session only while the chosen agent's status offers to stop it, and asks first", async () => {
    const idle = await openList();
    expect(idle.get("[data-end-session]").attributes("disabled")).toBeDefined();

    const working = await openList([
      agent("main", "Main agent", {
        sessionId: "session-1",
        status: { ...agents[0].status, actions: [{ type: "stop", label: "End session" }] },
      }),
    ]);
    await working.get("[data-end-session]").trigger("click");

    expect(working.findComponent({ name: "StopConfirmation" }).exists()).toBe(true);
  });

  it("hands a record let go on a chat to that agent, whose chat opens", async () => {
    visited.length = 0;
    const record = { title: "Doc 101", reference: "/documents/101" };
    const dataTransfer = {
      types: [HANDED_RECORD_TYPE],
      getData: () => JSON.stringify(record),
    };

    await (await openList())
      .get('[data-conversation="reviewer"]')
      .trigger("drop", { dataTransfer });

    expect(visited).toEqual(["/?agent=reviewer"]);
    expect(useHandOver().takeFor("reviewer")).toEqual({
      ...record,
      agentId: "reviewer",
    });
  });
});

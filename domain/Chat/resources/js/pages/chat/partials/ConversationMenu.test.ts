// @vitest-environment happy-dom
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import type { AgentOptionData } from "@generated/types/chat";

const visited: string[] = [];

vi.mock("@inertiajs/vue3", () => ({
  router: { visit: (url: string) => visited.push(url) },
}));

const { default: ConversationMenu } = await import("./ConversationMenu.vue");
const { chatRoster } = await import("../../../composables/useChatRoster");
const { HANDED_RECORD_TYPE, useHandOver } =
  await import("../../../composables/useHandOver");

function agent(id: string, name: string, retired = false): AgentOptionData {
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
    actions: retired ? [] : ["start"],
    conversations: [],
    startRefusal: null,
    sessionDriver: null,
    sessionDriverLabel: null,
    sessionModel: null,
    needsAttention: false,
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
  };
}

function menu(canCreateChats = true) {
  return mount(ConversationMenu, {
    props: {
      agents: [
        agent("main", "Main agent"),
        agent("reviewer", "Reviewer"),
        agent("old", "Old writer", true),
      ],
      mainAgentId: "main",
      selectedAgentId: "main",
      canCreateChats,
      agentUrl: (chosen: AgentOptionData) => `/?agent=${chosen.id}`,
    },
  });
}

describe("ConversationMenu", () => {
  it("lists a conversation with each working agent, the chosen one ticked and the main agent named so", () => {
    const rows = menu().findAll("[data-conversation]");

    expect(rows.map((row) => row.attributes("data-conversation"))).toEqual([
      "main",
      "reviewer",
    ]);
    expect(rows[0].attributes("aria-checked")).toBe("true");
    expect(rows[0].text()).toContain("main agent");
    expect(rows[1].attributes("aria-checked")).toBe("false");
  });

  it("opens the chosen conversation", async () => {
    visited.length = 0;

    await menu().find('[data-conversation="reviewer"]').trigger("click");

    expect(visited).toEqual(["/?agent=reviewer"]);
  });

  it("opens the chat's members to add someone, and offers a new group chat only to who may make one", async () => {
    const opened = menu();

    await opened.find("[data-add-someone]").trigger("click");

    expect(chatRoster.isOpen).toBe(true);
    expect(opened.find("[data-new-group]").exists()).toBe(true);
    expect(menu(false).find("[data-new-group]").exists()).toBe(false);
  });

  it("hands a record let go on a conversation to that agent, whose chat opens", async () => {
    visited.length = 0;
    const record = { title: "Doc 101", reference: "/documents/101" };
    const dataTransfer = {
      types: [HANDED_RECORD_TYPE],
      getData: () => JSON.stringify(record),
    };

    await menu()
      .find('[data-conversation="reviewer"]')
      .trigger("drop", { dataTransfer });

    expect(visited).toEqual(["/?agent=reviewer"]);
    expect(useHandOver().takeFor("reviewer")).toEqual({
      ...record,
      agentId: "reviewer",
    });
  });
});

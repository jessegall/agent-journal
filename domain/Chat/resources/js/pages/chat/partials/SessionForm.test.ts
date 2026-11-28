// @vitest-environment happy-dom
import { flushPromises, mount } from "@vue/test-utils";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { reactive } from "vue";
import type { AgentOptionData, AgentStatusData } from "@generated/types/chat";
import { declaredLooks } from "@kit/testing/driverLooks";

const posted: { url: string; body: Record<string, unknown> }[] = [];

const shownPage = reactive<{ component: string; props: Record<string, unknown> }>({
  component: "Home",
  props: {},
});

// The registered drivers the dialog offers, as the journal's catalogue lists them.
const drivers = [
  { key: "claude-code", label: "Claude Code", family: "claude-code", driverType: "terminal", isAvailable: true, unavailableReason: null },
  { key: "codex-headless", label: "Codex", family: "codex", driverType: "headless", isAvailable: true, unavailableReason: null },
];

function accountsOf(family: string) {
  return {
    driver: family,
    accounts: [
      {
        id: `${family}-work`,
        label: "Work account",
        unavailableReason: null,
        unavailableSentence: null,
        expiresAt: null,
        signInRevision: 4,
        isDefault: true,
      },
      {
        id: `${family}-old`,
        label: "Old account",
        unavailableReason: "needs-sign-in",
        unavailableSentence: "its account needs to sign in again",
        expiresAt: null,
        signInRevision: 1,
        isDefault: false,
      },
    ],
    defaultModel: family === "codex" ? "gpt-6.2-sol" : "opus",
    preferredDriver: null,
  };
}

vi.mock("@inertiajs/vue3", () => ({
  Link: { template: "<a><slot /></a>" },
  usePage: () => shownPage,
  router: {
    reload: () => undefined,
    on: () => () => undefined,
    post: (url: string, body: Record<string, unknown>) => posted.push({ url, body }),
  },
}));
vi.mock("@kit/loaders", async (importOriginal) => {
  const original = await importOriginal<typeof import("@kit/loaders")>();

  return {
    ...original,
    load: (loader: { key: string }, input: Record<string, string>) => {
      if (loader.key === "chat.start-drivers") {
        return Promise.resolve({ status: "ok", value: { drivers } });
      }

      return Promise.resolve({ status: "ok", value: accountsOf(input.family) });
    },
  };
});
vi.mock("@kit/Dialog", () => ({
  default: { template: '<div><slot /><slot name="footer" /></div>' },
}));
vi.mock("@kit/sessionStarts", () => ({
  accountsPage: { url: () => "/accounts" },
  switchMethod: { url: (profile: string) => `/profiles/${profile}/switch` },
}));

const { default: SessionForm } = await import("./SessionForm.vue");

// An agent's status in its whole shape, as the chat sends it: idle and confirmed unless the test says otherwise.
function statusOf(facts: Partial<AgentStatusData> = {}): AgentStatusData {
  return {
    sessionState: "idle",
    isStartRefused: false,
    label: "Idle",
    reason: null,
    remedy: null,
    commandOutcome: null,
    observationAgeSeconds: null,
    actions: [],
    isProcessConfirmed: true,
    ...facts,
  };
}

function agentOn(facts: Partial<AgentOptionData> = {}): AgentOptionData {
  return {
    id: "agent-1",
    name: "Agent 1",
    profileKey: "main-agent",
    isRetired: false,
    sessionId: "session-1",
    sessionGeneration: 2,
    hasTerminal: false,
    switchId: null,
    switchStage: null,
    switchStageLabel: null,
    isSwitchOver: true,
    conversations: [{ id: "conversation-1", driver: "claude-code", startedAt: "2026-11-28T08:00:00Z" }],
    sessionDriver: "claude-code",
    sessionDriverLabel: "Claude Code",
    sessionModel: "opus",
    status: statusOf(),
    ...facts,
  } as unknown as AgentOptionData;
}

function switchButton(form: VueWrapper) {
  return form.get("[data-switch]");
}

async function chooseModel(form: VueWrapper, label: string) {
  await form.get('[data-model] button, button[data-model]').trigger("click");
  await form
    .findAll('[role="option"]')
    .find((option) => option.text().startsWith(label))!
    .trigger("click");
}

beforeEach(() => {
  posted.length = 0;
  window.sessionStorage.clear();
  shownPage.props = { viewer: { id: "user-1" }, drivers: declaredLooks };
});

describe("the Switch driver dialog", () => {
  it("says what runs the agent now, and keeps Switch off until something differs", async () => {
    const form = mount(SessionForm, { props: { agent: agentOn() } });
    await flushPromises();

    expect(form.get("[data-now]").text()).toContain("Claude Code · opus");
    expect(switchButton(form).attributes("disabled")).toBeDefined();
    expect(form.find("[data-no-account]").exists()).toBe(false);
  });

  it("keeps the session and conversation for the same program, its next turn on the new model", async () => {
    const form = mount(SessionForm, { props: { agent: agentOn() } });
    await flushPromises();

    await chooseModel(form, "sonnet");
    expect(form.find("[data-same-program]").exists()).toBe(true);
    expect(switchButton(form).text()).toBe("Switch");
    await switchButton(form).trigger("click");

    expect(posted.at(-1)?.body).toMatchObject({
      driver: "claude-code",
      model: "sonnet",
      accountId: "claude-code-work",
      expectedSessionId: "session-1",
      expectedGeneration: 2,
      conversationId: "conversation-1",
      carryConversation: false,
    });
  });

  it("carries the conversation over to another program by default", async () => {
    const form = mount(SessionForm, { props: { agent: agentOn() } });
    await flushPromises();

    await form.get('[data-segment="codex"]').trigger("click");
    await flushPromises();
    expect(switchButton(form).text()).toBe("Switch to Codex");
    await switchButton(form).trigger("click");

    expect(posted.at(-1)?.body).toMatchObject({
      driver: "codex",
      driverType: "headless",
      model: "gpt-6.2-sol",
      accountId: "codex-work",
      conversationId: null,
      carryConversation: true,
    });
  });

  it("starts clean on another program when asked, so the new session reads only the memories", async () => {
    const form = mount(SessionForm, { props: { agent: agentOn() } });
    await flushPromises();

    await form.get('[data-segment="codex"]').trigger("click");
    await flushPromises();
    await form.get("[data-start-clean]").setValue(true);
    await switchButton(form).trigger("click");

    expect(posted.at(-1)?.body).toMatchObject({ driver: "codex", carryConversation: false });
  });

  it("waits for the current turn unless told to stop it now", async () => {
    const working = agentOn({
      status: statusOf({ sessionState: "working", label: "Working", actions: [{ type: "interrupt", label: "Interrupt" }] }),
    });
    const form = mount(SessionForm, { props: { agent: working } });
    await flushPromises();

    await chooseModel(form, "sonnet");
    await form.get("[data-wait-for-turn]").setValue(false);
    await switchButton(form).trigger("click");

    expect(posted.at(-1)?.body).toMatchObject({ stopsTurn: true });
  });

  it("starts nothing for an agent with no session: the choice waits for its next message", async () => {
    const stopped = agentOn({ sessionId: null, status: statusOf({ sessionState: "stopped", label: "Stopped" }) });
    const form = mount(SessionForm, { props: { agent: stopped } });
    await flushPromises();

    expect(form.get("[data-no-session]").text()).toContain("nothing starts now");
    await form.get('[data-segment="codex"]').trigger("click");
    await flushPromises();
    await switchButton(form).trigger("click");

    expect(posted.at(-1)?.body).toMatchObject({ driver: "codex", model: "gpt-6.2-sol" });
    expect(posted.at(-1)?.body).not.toHaveProperty("expectedSessionId");
  });
});

// @vitest-environment happy-dom
import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AgentOptionData } from "@generated/types/chat";

type Outcome = { onAccepted: () => void; onRefused: (reason: string | null) => void; onUncertain: () => void };

const posts: Array<{ url: string; body: Record<string, unknown>; outcome: Outcome; only: string[] }> = [];
// Each driver family's signed-in accounts, as the accounts loader answers them.
let signedIn: Record<string, Array<{ id: string; label: string; isDefault: boolean }>> = {};

const loads: string[] = [];

vi.mock("@inertiajs/vue3", () => ({
  Link: { props: ["href"], template: '<a :href="href"><slot /></a>' },
  usePage: () => ({
    url: "/",
    get props() {
      return {
        viewer: { id: "user-picker" },
        drivers: [
          { family: "claude-code", label: "Claude Code", models: ["haiku", "sonnet", "opus"], efforts: ["low", "medium", "high"], defaultEffort: "medium" },
          { family: "codex", label: "Codex", models: ["gpt-6-luna"], efforts: ["low", "medium"], defaultEffort: "medium" },
        ],
        // The app context names each family's accounts and default model, so the picker reads no loader.
        startAccounts: ["claude-code", "codex"].map((family) => ({
          driver: family,
          defaultModel: family === "codex" ? "gpt-6-luna" : "sonnet",
          preferredDriver: null,
          accounts: (signedIn[family] ?? []).map((account) => ({
            ...account,
            unavailableReason: null,
            unavailableSentence: null,
            expiresAt: null,
            signInRevision: 3,
          })),
        })),
      };
    },
  }),
}));
vi.mock("@kit/loaders", () => ({
  load: (loader: { key: string }) => {
    loads.push(loader.key);

    return Promise.resolve({ status: "failed" });
  },
}));
vi.mock("@kit/keyedPost", () => ({
  keyedPost: (url: string, body: Record<string, unknown>, _key: string, outcome: Outcome, only: string[]) =>
    posts.push({ url, body, outcome, only }),
}));
vi.mock("@kit/sessionStarts", () => ({
  startMain: { url: (profile: string) => `/profiles/${profile}/start-main` },
  accountsPage: { url: () => "/accounts" },
}));

const { default: StartPicker } = await import("./StartPicker.vue");

function agentWith(facts: Partial<AgentOptionData> = {}): AgentOptionData {
  return {
    id: "agent-4",
    name: "Agent 4",
    profileKey: "main-agent",
    sessionId: null,
    conversations: [],
    status: { sessionState: "stopped", label: "Stopped", actions: [], reason: null },
    ...facts,
  } as unknown as AgentOptionData;
}

async function pickerFor(agent: AgentOptionData, isNew = true) {
  const picker = mount(StartPicker, { props: { agent, isNew } });
  await flushPromises();

  return picker;
}

describe("StartPicker", () => {
  beforeEach(() => {
    posts.length = 0;
    loads.length = 0;
    localStorage.clear();
    signedIn = { "claude-code": [{ id: "acct-work", label: "Work (Max)", isDefault: true }] };
  });

  it("starts a new chat on its last choice: only signed-in drivers as cards, each naming its account", async () => {
    localStorage.setItem(
      "journal.new-chat-choice.user-picker",
      JSON.stringify({ family: "claude-code", model: "opus", effort: "high" }),
    );
    const picker = await pickerFor(agentWith());

    expect(picker.get("[data-start-title]").text()).toBe("Start a new chat");
    expect(picker.text()).not.toContain("main agent");
    expect(picker.get('[data-start-option="driver:claude-code"]').text()).toContain("Work (Max)");
    expect(picker.find('[data-start-option="driver:codex"]').exists()).toBe(false);
    expect(picker.get("[data-not-signed-in]").text()).toContain("Codex is not signed in");
    expect(picker.get('[data-start-option="model:opus"]').attributes("aria-checked")).toBe("true");
    expect(picker.get('[data-start-option="effort:high"]').attributes("aria-checked")).toBe("true");
  });

  it("picks the defaults with no last choice, and Start begins the session in this chat with the effort chosen", async () => {
    const picker = await pickerFor(agentWith());

    expect(picker.get('[data-start-option="model:sonnet"]').attributes("aria-checked")).toBe("true");
    await picker.get('[data-start-option="effort:low"]').trigger("click");
    await picker.get("[data-start]").trigger("click");

    expect(posts[0]).toMatchObject({
      url: "/profiles/main-agent/start-main",
      body: {
        agentId: "agent-4",
        driver: "claude-code",
        model: "sonnet",
        effort: "low",
        accountId: "acct-work",
        accountRevision: 3,
      },
    });
  });

  it("keeps the choices after a failed start, says why and offers Start again", async () => {
    const picker = await pickerFor(agentWith());
    await picker.get('[data-start-option="model:opus"]').trigger("click");
    await picker.get("[data-start]").trigger("click");

    posts[0].outcome.onRefused("Work (Max) reached its usage limit for now");
    await flushPromises();

    expect(picker.get("[data-start-failure]").text()).toContain("reached its usage limit");
    expect(picker.get("[data-start]").text()).toBe("Start again");
    expect(picker.get('[data-start-option="model:opus"]').attributes("aria-checked")).toBe("true");
  });

  it("asks an ended chat to start again as it ran last", async () => {
    const ended = agentWith({ conversations: [{ id: "conversation-1", driver: "claude-code" }] } as Partial<AgentOptionData>);
    const picker = await pickerFor(ended, false);

    expect(picker.get("[data-start-title]").text()).toBe("Start Agent 4 again");
    expect(picker.text()).toContain("As last time");
  });

  it("offers only Add an account when no account is signed in", async () => {
    signedIn = {};
    const picker = await pickerFor(agentWith());

    expect(picker.text()).toContain("No account is signed in");
    expect(picker.find("[data-add-account]").exists()).toBe(true);
    expect(picker.find("[data-start]").exists()).toBe(false);
  });

  it("reads every choice's main label in the bright text colour, chosen or not", async () => {
    signedIn = { "claude-code": [{ id: "acct-work", label: "Work (Max)", isDefault: true }, { id: "acct-home", label: "Home", isDefault: false }] };
    const picker = await pickerFor(agentWith());
    const labels = picker.findAll("[data-start-label]");

    expect(labels.length).toBeGreaterThan(3);
    labels.forEach((label) => expect(label.classes()).toContain("text-text"));
    expect(picker.get('[data-start-option="effort:low"]').classes()).toContain("text-text");
  });

  it("shows its choices on its first paint, read from the app context with no loader call", () => {
    const picker = mount(StartPicker, { props: { agent: agentWith(), isNew: true } });

    expect(picker.find('[data-start-option="driver:claude-code"]').exists()).toBe(true);
    expect(loads).toEqual([]);
  });

  it("renders a start the server says runs, or failed, from the agent's status alone", async () => {
    const starting = await pickerFor(
      agentWith({ status: { sessionState: "starting", label: "Starting", actions: [], reason: null } } as Partial<AgentOptionData>),
    );
    const failed = await pickerFor(
      agentWith({
        status: { sessionState: "failed", label: "Start failed", actions: [], reason: "Work (Max) reached its usage limit" },
      } as Partial<AgentOptionData>),
    );

    expect(starting.text()).toContain("Starting the session");
    expect(failed.get("[data-start-failure]").text()).toContain("reached its usage limit");
    expect(failed.get("[data-start]").text()).toBe("Start again");
  });
});

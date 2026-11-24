// @vitest-environment happy-dom
import { flushPromises, mount } from "@vue/test-utils";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, reactive } from "vue";
import type { AgentOptionData } from "@generated/types/chat";

const posted: { url: string; body: Record<string, unknown> }[] = [];
type PostOptions = {
  headers?: Record<string, string>;
  onFinish?: () => void;
  onSuccess: (page: { flash: Record<string, unknown> }) => void;
  onError: (errors: Record<string, string>) => void;
};
const postOptions: PostOptions[] = [];

// The chat window's prop on Home; asking it for a driver's accounts answers them as part of its data.
const shownPage = reactive<{
  component: string;
  props: Record<string, unknown>;
}>({ component: "Home", props: {} });
const accountsAnswer = {
  driver: "claude-code",
  accounts: [
    {
      id: "expired",
      label: "Old account",
      unavailableReason: "needs-sign-in",
      unavailableSentence: "its account needs to sign in again",
      expiresAt: null,
      signInRevision: 1,
      isDefault: true,
    },
    {
      id: "ready",
      label: "Work account",
      unavailableReason: null,
      unavailableSentence: null,
      expiresAt: null,
      signInRevision: 4,
      isDefault: false,
    },
  ],
  modelChoices: ["claude-opus-5-5", "claude-sonnet-5-5"],
};

// The registered drivers the chat window offers, as the journal's catalogue lists them.
const drivers = [
  {
    key: "claude-code",
    label: "Claude Code",
    family: "claude-code",
    driverType: "terminal",
    isAvailable: true,
    unavailableReason: null,
  },
  {
    key: "claude-code-headless",
    label: "Claude Code headless",
    family: "claude-code",
    driverType: "headless",
    isAvailable: true,
    unavailableReason: null,
  },
  {
    key: "codex",
    label: "Codex",
    family: "codex",
    driverType: "terminal",
    isAvailable: false,
    unavailableReason: "The Codex terminal is not proven on any host yet.",
  },
  {
    key: "codex-headless",
    label: "Codex headless",
    family: "codex",
    driverType: "headless",
    isAvailable: true,
    unavailableReason: null,
  },
];

// How many of the next account reads fail, as when the journal cannot be reached.
const readFailures = { count: 0 };

vi.mock("@inertiajs/vue3", () => ({
  Link: { template: "<a><slot /></a>" },
  usePage: () => shownPage,
  useHttp: () => ({ requestId: "", get: vi.fn(), post: vi.fn() }),
  router: {
    reload: (options: {
      only: string[];
      onError?: (errors: Record<string, string>) => void;
    }) => {
      if (readFailures.count > 0) {
        readFailures.count--;
        options.onError?.({ page: "The accounts could not be read." });

        return;
      }

      shownPage.props = {
        [options.only[0]]: {
          state: "ready",
          data: { eligibleAccounts: { ...accountsAnswer }, drivers },
        },
      };
    },
    on: () => () => undefined,
    post: (
      url: string,
      body: Record<string, unknown>,
      options: PostOptions,
    ) => {
      posted.push({ url, body });
      postOptions.push(options);
      options.onFinish?.();
    },
  },
}));
// The server's preview of a start: the drafted driver type, else headless, and only the Codex terminal cannot run.
vi.mock("@kit/pageReads", async (importOriginal) => {
  const original = await importOriginal<typeof import("@kit/pageReads")>();

  return {
    ...original,
    readPage: (routeName: string, query: Record<string, string>) => {
      if (routeName !== "web.start-preview") {
        return original.readPage(routeName, query);
      }

      const driverType = query.driverType === "" ? "headless" : query.driverType;
      const runs = !(query.family === "codex" && driverType === "terminal");

      return Promise.resolve({
        family: query.family,
        familySource: "explicit",
        driverType,
        driverTypeSource: query.driverType === "" ? "profile" : "explicit",
        driverKey:
          driverType === "headless" ? `${query.family}-headless` : query.family,
        label: `${query.family} ${driverType}`,
        canRun: runs,
        unavailableReason: runs
          ? null
          : "The Codex terminal is not proven on any host yet.",
        isModeLocked: false,
        catalogueRevision: 4,
      });
    },
  };
});

function startButton(form: VueWrapper) {
  return form
    .findAll("button")
    .find((candidate) => candidate.text() === "Start session");
}

vi.mock("@kit/Dialog", () => ({
  default: { template: '<div><slot /><slot name="footer" /></div>' },
}));
vi.mock("@kit/sessionStarts", () => ({
  accountsPage: { url: () => "/accounts" },
  cancelLaunch: {
    url: () => "/agents/main/sessions/session-1/cancel-launch",
  },
  startMain: { url: (profile: string) => `/profiles/${profile}/start-main` },
  startReceipt: {
    url: (requestId: string) => `/profiles/starts/${requestId}`,
  },
  switchMethod: { url: (profile: string) => `/profiles/${profile}/switch` },
}));

const { default: SessionForm } = await import("./SessionForm.vue");

const idle: AgentOptionData = {
  id: "main",
  name: "Main agent",
  profileKey: "journal-main",
  retired: false,
  presence: "idle",
  presenceLabel: "Idle",
  sessionId: null,
  sessionGeneration: 0,
  hasTerminal: false,
  switchId: null,
  switchStage: null,
  switchStageLabel: null,
  isSwitchOver: true,
  actions: ["start"],
  conversations: [],
  startRefusal: null,
  sessionDriver: null,
  sessionDriverLabel: null,
  sessionModel: null,
  needsAttention: false,
  status: {
    sessionState: "stopped",
    label: "Stopped",
    reason: null,
    remedy: null,
    operation: null,
    commandOutcome: null,
    observationAgeSeconds: null,
    actions: [{ type: "start", label: "Start session" }],
    isProcessConfirmed: false,
  },
};

describe("SessionForm", () => {
  beforeEach(() => window.sessionStorage.clear());

  it("chooses the ready account over an expired default, says why the other is unavailable, and sends one request id twice", async () => {
    const form = mount(SessionForm, {
      props: { agent: idle, mode: "start" },
    });
    await flushPromises();

    const options = form.findAll('select[id$="-account"] option');
    expect(
      options.map((option) => [
        option.text(),
        option.attributes("disabled") !== undefined,
      ]),
    ).toEqual([
      ["Old account: its account needs to sign in again", true],
      ["Work account", false],
    ]);
    expect(form.text()).toContain(
      "Starts claude-code headless, on Work account.",
    );
    const driverOptions = form.findAll('select[id$="-driver"] option');
    expect(driverOptions.map((option) => option.text())).toEqual([
      "Claude Code",
      "Codex",
    ]);

    await form.find("form").trigger("submit");
    await flushPromises();
    await form.find("form").trigger("submit");
    await flushPromises();

    expect(
      posted.map((sent) => [
        sent.url,
        sent.body.accountId,
        sent.body.accountRevision,
      ]),
    ).toEqual([
      ["/profiles/journal-main/start-main", "ready", 4],
      ["/profiles/journal-main/start-main", "ready", 4],
    ]);
    expect(posted[0].body.requestId).toBe(posted[1].body.requestId);
    expect([posted[0].body.driverType, posted[0].body.previewRevision]).toEqual([
      null,
      4,
    ]);
    form.unmount();
  });

  it("keeps a Codex terminal it cannot run, says why and disables Start, and lets Headless or the inherited mode back", async () => {
    const form = mount(SessionForm, {
      attachTo: document.body,
      props: { agent: idle, mode: "start" },
    });
    await flushPromises();

    await form.find('select[id$="-driver"]').setValue("codex");
    await form.find('input[type="checkbox"]').setValue(false);
    await flushPromises();

    expect(form.text()).toContain(
      "The Codex terminal is not proven on any host yet.",
    );
    expect(startButton(form)?.attributes("disabled")).toBeDefined();

    await form.find('input[type="checkbox"]').setValue(true);
    await flushPromises();

    expect(form.text()).not.toContain(
      "The Codex terminal is not proven on any host yet.",
    );
    expect(startButton(form)?.attributes("disabled")).toBeUndefined();

    const inherit = form
      .findAll("button")
      .find((button) => button.text() === "Use saved or profile setting");
    await inherit?.trigger("click");
    await flushPromises();

    expect(
      form
        .findAll("button")
        .some((button) => button.text() === "Use saved or profile setting"),
    ).toBe(false);
    form.unmount();
  });

  it("disables Start and points to Accounts when every account is unavailable", async () => {
    const all = accountsAnswer.accounts;
    accountsAnswer.accounts = [all[0]];
    const form = mount(SessionForm, {
      props: { agent: idle, mode: "start" },
    });
    await flushPromises();

    expect(form.text()).toContain("None of its accounts can start now.");
    const start = form
      .findAll("button")
      .find((candidate) => candidate.text() === "Start session");
    expect(start?.attributes("disabled")).toBeDefined();
    accountsAnswer.accounts = all;
    form.unmount();
  });

  it("offers Retry when the accounts could not be read", async () => {
    readFailures.count = 1;
    const form = mount(SessionForm, {
      props: { agent: idle, mode: "start" },
    });
    await flushPromises();

    expect(form.text()).toContain("The accounts could not be read.");
    await form
      .findAll("button")
      .find((candidate) => candidate.text() === "Retry")!
      .trigger("click");
    await flushPromises();

    expect(form.findAll('select[id$="-account"] option')).toHaveLength(2);
    form.unmount();
  });

  it("shows Starting at once and closes only once the session the start answered with runs", async () => {
    const form = mount(SessionForm, {
      props: { agent: idle, mode: "start" },
    });
    await flushPromises();
    await form.find("form").trigger("submit");
    expect(form.text()).toContain("Starting");

    await form.setProps({
      agent: {
        ...idle,
        presence: "working",
        sessionId: "session-2",
        status: { ...idle.status, isProcessConfirmed: true },
      },
    });
    postOptions.at(-1)?.onSuccess({ flash: { startedSessionId: "session-1" } });
    await flushPromises();
    expect(form.text()).toContain(
      "Another session is running; this start is not confirmed yet",
    );

    await form.setProps({
      agent: {
        ...idle,
        sessionId: "session-1",
        status: {
          ...idle.status,
          sessionState: "idle",
          isProcessConfirmed: true,
        },
      },
    });
    expect(form.emitted("close")).toBeUndefined();
    postOptions.at(-1)?.onSuccess({ flash: { startedSessionId: "session-1" } });
    await flushPromises();
    expect(form.emitted("close")).toHaveLength(1);
    form.unmount();
  });

  it("offers the profile's models, default first, and shows a model refusal under Model with the focus there", async () => {
    const form = mount(SessionForm, {
      props: { agent: idle, mode: "start" },
      attachTo: document.body,
    });
    await flushPromises();

    const models = form
      .findAll('select[id$="-model"] option')
      .map((option) => option.text());
    expect(models).toEqual(["claude-opus-5-5 (default)", "claude-sonnet-5-5"]);

    await form.find("form").trigger("submit");
    postOptions
      .at(-1)
      ?.onError({ model: "This profile does not allow that model." });
    await flushPromises();

    const model = form.find('select[id$="-model"]');
    expect(model.attributes("aria-describedby")).toBe(
      `${model.attributes("id")}-error`,
    );
    expect(form.find(`#${model.attributes("id")}-error`).text()).toBe(
      "This profile does not allow that model.",
    );
    expect(document.activeElement?.id).toBe(model.attributes("id"));
    expect(
      (form.find('select[id$="-account"]').element as HTMLSelectElement).value,
    ).toBe("ready");
    form.unmount();
  });

  it("sends Start again after a refusal as a new start, never as the refused one", async () => {
    const form = mount(SessionForm, {
      props: { agent: idle, mode: "start" },
    });
    await flushPromises();

    await form.find("form").trigger("submit");
    const refusedKey = postOptions.at(-1)?.headers?.["Idempotency-Key"];
    postOptions.at(-1)?.onError({ start: "The host has no folder to start agents in." });
    await flushPromises();

    await form.find("form").trigger("submit");
    const retryKey = postOptions.at(-1)?.headers?.["Idempotency-Key"];

    expect(refusedKey).toBeTypeOf("string");
    expect(retryKey).toBeTypeOf("string");
    expect(retryKey).not.toBe(refusedKey);
    form.unmount();
  });

  it("ends a start whose session is gone without a refusal, says why, and starts anew under a new key", async () => {
    const form = mount(SessionForm, {
      props: { agent: idle, mode: "start" },
    });
    await flushPromises();

    await form.find("form").trigger("submit");
    const firstKey = postOptions.at(-1)?.headers?.["Idempotency-Key"];
    await form.setProps({
      agent: {
        ...idle,
        sessionId: null,
        status: { ...idle.status, sessionState: "stopped", reason: "Restarted", isProcessConfirmed: false },
      },
    });
    postOptions.at(-1)?.onSuccess({ flash: { startedSessionId: "session-1" } });
    await flushPromises();
    expect(form.text()).toContain("Restarted");
    expect(form.text()).not.toContain("Starting");

    await form.find("form").trigger("submit");
    expect(postOptions.at(-1)?.headers?.["Idempotency-Key"]).not.toBe(firstKey);
    form.unmount();
  });

  it("keeps the chosen second account through a refresh while another stays the default", async () => {
    const all = accountsAnswer.accounts;
    accountsAnswer.accounts = [
      { ...all[1], id: "first", label: "First account", isDefault: true },
      {
        ...all[1],
        id: "second",
        label: "Second account",
        isDefault: false,
      },
    ];
    const form = mount(SessionForm, {
      props: { agent: idle, mode: "start" },
    });
    await flushPromises();

    await form.find('select[id$="-account"]').setValue("second");
    shownPage.props = {
      window_chat_conversation: {
        state: "ready",
        data: { eligibleAccounts: { ...accountsAnswer }, drivers },
      },
    };
    await flushPromises();

    expect(
      (form.find('select[id$="-account"]').element as HTMLSelectElement).value,
    ).toBe("second");
    accountsAnswer.accounts = all;
    form.unmount();
  });

  it("gives two open dialogs their own field ids", async () => {
    const both = mount(
      defineComponent({
        components: { SessionForm },
        setup: () => ({ agent: idle }),
        template:
          '<div><SessionForm :agent="agent" mode="start" /><SessionForm :agent="agent" mode="start" /></div>',
      }),
    );
    await flushPromises();

    const ids = both
      .findAll('select[id$="-model"]')
      .map((field) => field.attributes("id"));

    expect(ids).toHaveLength(2);
    expect(ids[0]).not.toBe(ids[1]);
    both.unmount();
  });

  it("keeps the sent start for this tab and shows it again after a reload without posting again", async () => {
    const form = mount(SessionForm, {
      props: { agent: idle, mode: "start" },
    });
    await flushPromises();
    await form.find("form").trigger("submit");
    const sentCount = posted.length;
    form.unmount();

    const reloaded = mount(SessionForm, {
      props: { agent: idle, mode: "start" },
    });
    await flushPromises();

    expect(reloaded.text()).toContain("Starting");
    expect(posted).toHaveLength(sentCount);
    reloaded.unmount();
  });

  it("forgets the tab record when the dialog is closed", async () => {
    const form = mount(SessionForm, {
      props: { agent: idle, mode: "start" },
    });
    await flushPromises();
    await form
      .findAll("button")
      .find((candidate) => candidate.text() === "Close")!
      .trigger("click");

    expect(window.sessionStorage.length).toBe(0);
    form.unmount();
  });
});

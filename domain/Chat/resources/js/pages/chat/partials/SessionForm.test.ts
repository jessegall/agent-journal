// @vitest-environment happy-dom
import { flushPromises, mount } from "@vue/test-utils";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, reactive } from "vue";
import type { AgentOptionData } from "@generated/types/chat";
import { declaredLooks } from "@kit/testing/driverLooks";
import { holdsContract, RECORDED } from "@kit/testing/pageRequests";

const posted: { url: string; body: Record<string, unknown> }[] = [];
type PostOptions = {
  headers?: Record<string, string>;
  onFinish?: () => void;
  onSuccess: (page: { flash: Record<string, unknown> }) => void;
  onError: (errors: Record<string, string>) => void;
};
const postOptions: PostOptions[] = [];

// The chat window's prop on Home; each new read of it has the form read its accounts again.
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
  defaultModel: "opus",
  preferredDriver: null as string | null,
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
// How many coming account reads a newer read cuts short.
const cancelledReads = { count: 0 };

vi.mock("@inertiajs/vue3", () => ({
  Link: { template: "<a><slot /></a>" },
  usePage: () => shownPage,
  useHttp: () => ({ requestId: "", get: vi.fn(), post: vi.fn() }),
  router: {
    reload: (options: { only: string[] }) => {
      shownPage.props = {
        ...shownPage.props,
        [options.only[0]]: { status: "ready", data: { drivers } },
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
vi.mock("@kit/loaders", async (importOriginal) => {
  const original = await importOriginal<typeof import("@kit/loaders")>();

  return {
    ...original,
    load: (loader: { key: string }, input: Record<string, string | null>) => {
      if (loader.key === "chat.start-drivers") {
        return Promise.resolve({ status: "ok", value: { drivers } });
      }

      if (loader.key === "accounts.start-accounts") {
        if (cancelledReads.count > 0) {
          cancelledReads.count--;

          return Promise.reject(new original.LoaderCancelled());
        }

        if (readFailures.count > 0) {
          readFailures.count--;

          return Promise.resolve({ status: "invalid", errors: { family: "The accounts could not be read." } });
        }

        return Promise.resolve({ status: "ok", value: { ...accountsAnswer, driver: input.family } });
      }

      if (loader.key !== "web.start-preview") {
        return original.load(loader as never, input as never);
      }

      const driverType = input.driverType ?? "headless";
      const runs = !(input.family === "codex" && driverType === "terminal");

      return Promise.resolve({
        status: "ok",
        value: {
          family: input.family,
          familySource: "explicit",
          driverType,
          driverTypeSource: input.driverType === null ? "profile" : "explicit",
          driverKey:
            driverType === "headless" ? `${input.family}-headless` : input.family,
          label: `${input.family} ${driverType}`,
          canRun: runs,
          unavailableReason: runs
            ? null
            : "The Codex terminal is not proven on any host yet.",
          isModeLocked: false,
          catalogueRevision: 4,
        },
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
  cancelStart: {
    url: () => "/agents/main/sessions/session-1/cancel-start",
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
  isRetired: false,
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
    isStartRefused: false,
    label: "Stopped",
    reason: null,
    remedy: null,
    commandOutcome: null,
    observationAgeSeconds: null,
    actions: [{ type: "start", label: "Start session" }],
    isProcessConfirmed: false,
  },
};

/** The options of the kit Select whose button's id ends in the field's name. */
function optionsOf(form: VueWrapper, field: string) {
  return form.findAll(`button[id$="-${field}"] ~ div [role="option"]`);
}

/** Opens the Select of a field and chooses the option with that label. */
async function choose(form: VueWrapper, field: string, label: string) {
  await form.get(`button[id$="-${field}"]`).trigger("click");
  await optionsOf(form, field)
    .find((option) => option.text() === label)!
    .trigger("click");
}

/** The label the Select of a field shows as chosen. */
function chosenIn(form: VueWrapper, field: string): string {
  return form.get(`button[id$="-${field}"]`).text();
}

// Every test starts on Home with the journal's driver catalogue; the form reads its drivers with its loader.
beforeEach(() => {
  window.sessionStorage.clear();
  shownPage.props = {
    viewer: { type: "guest", canShare: false },
    drivers: declaredLooks,
  };
});

describe("SessionForm", () => {
  it("chooses the ready account over an expired default, says why the other is unavailable, and sends one request id twice", async () => {
    const form = mount(SessionForm, {
      props: { agent: idle, mode: "start" },
    });
    await flushPromises();

    const options = optionsOf(form, "account");
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
    const driverOptions = optionsOf(form, "driver");
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

    await choose(form, "driver", "Codex");
    await form.get('[role="switch"][aria-label="Headless"]').trigger("click");
    await flushPromises();

    expect(form.text()).toContain(
      "The Codex terminal is not proven on any host yet.",
    );
    expect(startButton(form)?.attributes("disabled")).toBeDefined();

    await form.get('[role="switch"][aria-label="Headless"]').trigger("click");
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

    expect(optionsOf(form, "account")).toHaveLength(2);
    form.unmount();
  });

  it("does not call an account read a newer read cut short a failure", async () => {
    cancelledReads.count = 1;
    const form = mount(SessionForm, {
      props: { agent: idle, mode: "start" },
    });
    await flushPromises();

    expect(form.text()).not.toContain("The accounts could not be read.");
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
          isStartRefused: false,
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

  it("offers every model with the profile's tier default marked, and shows a model refusal under Model with the focus there", async () => {
    const form = mount(SessionForm, {
      props: { agent: idle, mode: "start" },
      attachTo: document.body,
    });
    await flushPromises();

    const models = optionsOf(form, "model").map((option) => option.text());
    expect(models).toEqual(["haiku", "sonnet", "opus (default)", "fable"]);
    expect(chosenIn(form, "model")).toBe("opus (default)");

    await form.find("form").trigger("submit");
    postOptions
      .at(-1)
      ?.onError({ model: "That model cannot start on this account." });
    await flushPromises();

    const model = form.find('button[id$="-model"]');
    expect(model.attributes("aria-describedby")).toBe(
      `${model.attributes("id")}-error`,
    );
    expect(form.find(`#${model.attributes("id")}-error`).text()).toBe(
      "That model cannot start on this account.",
    );
    expect(document.activeElement?.id).toBe(model.attributes("id"));
    expect(chosenIn(form, "account")).toBe("Work account");
    form.unmount();
  });

  it("preselects the driver the profile prefers while nothing chose one", async () => {
    accountsAnswer.preferredDriver = "codex";
    const form = mount(SessionForm, { props: { agent: idle, mode: "start" } });
    await flushPromises();

    expect(chosenIn(form, "driver")).toBe("Codex");
    accountsAnswer.preferredDriver = null;
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

    await choose(form, "account", "Second account");
    await form.setProps({ agent: { ...idle } });
    await flushPromises();

    expect(chosenIn(form, "account")).toBe("Second account");
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
      .findAll('button[id$="-model"]')
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

describe("the start a session form sends", () => {
  it("is the start the start route takes", async () => {
    const ready = accountsAnswer.accounts[1];
    const readyId = ready.id;
    ready.id = RECORDED.account;
    posted.length = 0;
    const form = mount(SessionForm, { props: { agent: idle, mode: "start" } });
    await flushPromises();

    await form.find("form").trigger("submit");
    await flushPromises();
    const start = posted.at(-1)!;
    ready.id = readyId;
    form.unmount();

    // The request id, sent in the body and as the Idempotency-Key, is the form's own random one; the contract holds
    // one fixed id in its place.
    expect(postOptions.at(-1)?.headers).toEqual({ "Idempotency-Key": start.body.requestId });
    holdsContract("session-start", {
      method: "POST",
      url: start.url,
      body: { ...start.body, requestId: "recorded-session-start" },
      headers: { "Idempotency-Key": "recorded-session-start" },
    });
  });
});

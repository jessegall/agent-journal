// @vitest-environment happy-dom
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { reactive } from "vue";

type SentForm = {
  submit: ReturnType<typeof vi.fn>;
  sent: () => Record<string, unknown>;
  errors: Record<string, string>;
  code?: string;
  label?: string;
};

const forms: SentForm[] = [];

vi.mock("@inertiajs/vue3", () => ({
  useForm: (fields: Record<string, unknown>) => {
    let shape: () => Record<string, unknown> = () => ({ ...fields });
    const form = reactive({
      ...fields,
      errors: {} as Record<string, string>,
      processing: false,
      submit: vi.fn(),
      sent: () => shape(),
      transform(next: () => Record<string, unknown>) {
        shape = next;

        return form;
      },
      optimistic() {
        return form;
      },
      reset() {
        Object.assign(form, fields);
      },
      clearErrors() {
        form.errors = {};
      },
      setError(field: string, message: string) {
        form.errors = { ...form.errors, [field]: message };
      },
    });
    forms.push(form as unknown as SentForm);

    return form;
  },
  Link: { template: "<a><slot /></a>" },
}));
vi.mock("@generated/routes/accounts", () => ({
  startSignIn: () => ({ url: "/accounts/sign-ins", method: "post" }),
  signInAgain: ({ account }: { account: string }) => ({
    url: `/accounts/${account}/sign-in-again`,
    method: "post",
  }),
  submitCode: ({ attempt }: { attempt: string }) => ({
    url: `/accounts/sign-ins/${attempt}/code`,
    method: "post",
  }),
  cancelSignIn: ({ attempt }: { attempt: string }) => ({
    url: `/accounts/sign-ins/${attempt}`,
    method: "delete",
  }),
  rename: ({ account }: { account: string }) => ({
    url: `/accounts/${account}/name`,
    method: "put",
  }),
  challenge: ({ attempt }: { attempt: string }) => ({
    url: `/accounts/sign-ins/${attempt}/challenge`,
  }),
}));
vi.mock("@kit/xsrfToken", () => ({ xsrfToken: () => "token" }));
vi.mock("@kit/usePageChanges", () => ({
  formSendingHooks: () => ({
    onStart: () => undefined,
    onFinish: () => undefined,
  }),
}));

import type {
  AccountRowData,
  DriverMethodsData,
  SignInAttemptData,
  SignInMethodData,
  SignInState,
} from "@generated/types/accounts";

const { default: AddAccountWizard } = await import("./AddAccountWizard.vue");

const claudeMethods: SignInMethodData[] = [
  {
    method: "oauth",
    isSecret: false,
    secretSource: null,
    billingNote: "Your Claude subscription pays for what agents use.",
    title: "Sign in with Claude",
    description: "Opens Claude's sign-in page.",
    billingLabel: "Subscription",
  },
  {
    method: "api_key",
    isSecret: true,
    billingNote: "Billed to the API key, apart from any subscription.",
    title: "API key",
    description: "Paste a key from the Anthropic Console.",
    billingLabel: "API",
    secretSource: "In the Anthropic Console, open API keys and create a key.",
  },
];
const methods: DriverMethodsData[] = [
  { driver: "claude-code", methods: claudeMethods },
  { driver: "codex", methods: [claudeMethods[0]] },
];

function attempt(
  state: SignInState,
  fields: Partial<SignInAttemptData> = {},
): SignInAttemptData {
  return {
    id: "attempt-1",
    driver: "claude-code",
    method: "api_key",
    type: "new_account",
    accountId: null,
    resultAccountId: null,
    state,
    expiresAt: "2026-11-21T12:00:00+00:00",
    refusal: null,
    ...fields,
  };
}

function accountRow(id: string, label: string): AccountRowData {
  return {
    id,
    driver: "claude-code",
    label,
    signIn: claudeMethods[1],
    state: "signed_in",
    identity: null,
    workspace: null,
    isActive: false,
    runningCount: 0,
    checkedAt: null,
    expiresAt: null,
    cleanupProblem: null,
    awaitsCleanupRetry: false,
    recentStarts: [],
  };
}

function openWizard() {
  return mount(AddAccountWizard, {
    attachTo: document.body,
    props: { request: { kind: "new" }, methods, attempts: [], rows: [] },
  });
}

function button(view: ReturnType<typeof openWizard>, label: string) {
  const found = view
    .findAll("button")
    .find((candidate) => candidate.text().includes(label));

  if (found === undefined) {
    throw new Error(`No button ${label}`);
  }

  return found;
}

beforeEach(() => {
  forms.length = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      json: async () => ({ address: null, code: null }),
    })),
  );
});

afterEach(() => vi.unstubAllGlobals());

describe("AddAccountWizard", () => {
  it("starts one sign-in however often Continue is pressed", async () => {
    const view = openWizard();
    await flushPromises();
    const [start] = forms;

    await view
      .findAll('[role="radio"]')
      .find((card) => card.text().includes("API key"))!
      .trigger("click");
    const continueButton = button(view, "Continue");
    void continueButton.trigger("click");
    await continueButton.trigger("click");

    expect(start.submit).toHaveBeenCalledTimes(1);
  });

  it("refuses a key past its byte bound with a field error and sends nothing", async () => {
    const view = openWizard();
    await flushPromises();
    const [start, , , answer] = forms;

    await view
      .findAll('[role="radio"]')
      .find((card) => card.text().includes("API key"))!
      .trigger("click");
    await button(view, "Continue").trigger("click");
    expect(start.submit).toHaveBeenCalledTimes(1);
    await view.setProps({ attempts: [attempt("waiting")] });
    await flushPromises();

    await view.find('input[type="password"]').setValue("é".repeat(2049));
    await view.find("form").trigger("submit");

    expect(answer.submit).not.toHaveBeenCalled();
    expect(view.text()).toContain("it takes 1 to 4096 bytes");
  });

  it("shows the whole sign-in link to select when the browser refuses the copy", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          address: "https://claude.ai/oauth/authorize?state=1",
          code: null,
        }),
      })),
    );
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: vi.fn(async () => Promise.reject(new Error("denied"))),
      },
    });
    const view = openWizard();
    await flushPromises();

    await view
      .findAll('[role="radio"]')
      .find((card) => card.text().includes("Sign in with Claude"))!
      .trigger("click");
    await button(view, "Continue").trigger("click");
    await view.setProps({
      attempts: [attempt("waiting", { method: "oauth" })],
    });
    await flushPromises();
    await button(view, "Copy link").trigger("click");
    await flushPromises();

    expect(view.text()).toContain("Copy failed.");
    const link = view
      .findAll("input")
      .find((input) => input.attributes("readonly") !== undefined);
    expect((link!.element as HTMLInputElement).value).toBe(
      "https://claude.ai/oauth/authorize?state=1",
    );
  });

  it("walks a key sign-in from the choice to the account added", async () => {
    const view = openWizard();
    await flushPromises();
    const [start, , , answer] = forms;

    expect(view.findAll('[data-step-bar][data-done="true"]')).toHaveLength(1);
    expect(button(view, "Continue").attributes("disabled")).toBeDefined();
    expect(view.text()).toContain("Choose a way to sign in to continue.");

    await view
      .findAll('[role="radio"]')
      .find((card) => card.text().includes("API key"))!
      .trigger("click");
    await button(view, "Continue").trigger("click");

    expect(start.submit).toHaveBeenCalledWith(
      { url: "/accounts/sign-ins", method: "post" },
      expect.anything(),
    );
    expect(start.sent()).toMatchObject({
      driver: "claude-code",
      method: "api_key",
    });
    expect(view.text()).toContain("Starting the sign-in…");
    expect(view.findAll('[data-step-bar][data-done="true"]')).toHaveLength(2);

    await view.setProps({ attempts: [attempt("waiting")] });
    await flushPromises();

    expect(view.text()).toContain("Where to get it.");
    expect(view.text()).toContain(
      "Kept on the host only and never shown again.",
    );

    await view.find('input[type="password"]').setValue("sk-ant-key");
    await view.find("form").trigger("submit");

    expect(answer.submit).toHaveBeenCalledWith(
      { url: "/accounts/sign-ins/attempt-1/code", method: "post" },
      expect.anything(),
    );
    expect(answer.code).toBe("sk-ant-key");

    await view.setProps({ attempts: [attempt("checking")] });
    expect(view.text()).toContain("Checking the sign-in with Claude Code…");
    expect(view.findAll('[data-step-bar][data-done="true"]')).toHaveLength(3);

    await view.setProps({
      attempts: [attempt("complete", { resultAccountId: "account-1" })],
      rows: [accountRow("account-1", "Claude Code API key 2")],
    });
    await flushPromises();

    expect(view.text()).toContain("Name this account");
    const field = view.find<HTMLInputElement>("#new-account-name-account-1");
    expect(field.element.value).toBe("Claude Code API key 2");

    await field.setValue("Work key");
    await view.find("form").trigger("submit");
    const naming = forms.find((form) => form.label === "Work key")!;
    expect(naming.submit).toHaveBeenCalledWith(
      { url: "/accounts/account-1/name", method: "put" },
      expect.anything(),
    );

    naming.submit.mock.calls[0][1].onSuccess();
    await view.setProps({ rows: [accountRow("account-1", "Work key")] });
    expect(view.text()).toContain("Account added");
    expect(view.text()).toContain("Work key");
    expect(view.find('[data-mark="done"]').exists()).toBe(true);

    await button(view, "Done").trigger("click");
    expect(view.emitted("close")).toHaveLength(1);
    view.unmount();
  });

  it("shows a refused key sign-in with the provider's reason and starts it again", async () => {
    const view = openWizard();
    await flushPromises();
    const [start] = forms;

    await view
      .findAll('[role="radio"]')
      .find((card) => card.text().includes("API key"))!
      .trigger("click");
    await button(view, "Continue").trigger("click");
    await view.setProps({ attempts: [attempt("waiting")] });
    await view.setProps({
      attempts: [
        attempt("failed", {
          refusal:
            "The provider did not accept the key or login. Check it and try again.",
        }),
      ],
    });

    expect(view.text()).toContain(
      "The provider did not accept the key or login. Check it and try again.",
    );
    expect(view.find('[data-mark="grey"]').exists()).toBe(true);

    await button(view, "Start again").trigger("click");
    expect(start.submit).toHaveBeenCalledTimes(2);
    expect(start.sent()).toMatchObject({
      driver: "claude-code",
      method: "api_key",
    });

    await button(view, "Back").trigger("click");
    expect(view.findAll('[data-step-bar][data-done="true"]')).toHaveLength(1);
    expect(button(view, "Continue").attributes("disabled")).toBeUndefined();
    view.unmount();
  });

  it("asks before closing while the sign-in waits, and keeps the field error under the field", async () => {
    const view = openWizard();
    await flushPromises();
    const [, , cancelling, answer] = forms;

    await view
      .findAll('[role="radio"]')
      .find((card) => card.text().includes("API key"))!
      .trigger("click");
    await button(view, "Continue").trigger("click");
    await view.setProps({ attempts: [attempt("waiting")] });
    answer.errors.code = "This is not a key.";
    await flushPromises();
    expect(view.text()).toContain("This is not a key.");

    await view.find('button[aria-label="Close"]').trigger("click");
    expect(view.text()).toContain("Keep the sign-in waiting?");
    expect(view.emitted("close")).toBeUndefined();

    await button(view, "Cancel sign-in").trigger("click");
    expect(cancelling.submit).toHaveBeenCalledWith(
      { url: "/accounts/sign-ins/attempt-1", method: "delete" },
      expect.anything(),
    );
    expect(view.emitted("close")).toHaveLength(1);
    view.unmount();
  });
});

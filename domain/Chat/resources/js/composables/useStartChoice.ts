import { useAppContext } from "@kit/appContext";
import { useHostProp } from "@kit/hostProp";
import { keyedPost } from "@kit/keyedPost";
import { newRequestId } from "@kit/requestId";
import { startMain } from "@kit/sessionStarts";
import type { EligibleAccountData } from "@kit/sessionStarts";
import { computed, ref } from "vue";
import type { AgentOptionData } from "@generated/types/chat";
import { keepNewChatChoice, readNewChatChoice, type NewChatChoice } from "../newChatChoice";

/**
 * One driver a chat may start on: its family and words, the signed-in accounts it may run on, the default account
 * first, its default model and the models and efforts a start may choose.
 */
export type StartDriver = {
  family: string;
  label: string;
  accounts: EligibleAccountData[];
  defaultModel: string;
  models: string[];
  efforts: string[];
  defaultEffort: string;
};

/**
 * The start picker's choices, from the app context so they show on its first paint: driver, account, model and effort,
 * the chat's last run or the user's last new chat preselected, and Start. A refused start keeps them to send again.
 */
export function useStartChoice(agent: () => AgentOptionData) {
  const { viewer, drivers: looks, startAccounts } = useAppContext();
  const viewerId = viewer.value.id ?? "guest";
  const hostProp = useHostProp();
  const family = ref<string | null>(null);
  const accountId = ref<string | null>(null);
  const model = ref<string | null>(null);
  const effort = ref<string | null>(null);
  // Only the post itself is this component's: whether a start is out, refused or running comes from the agent's status.
  const isSending = ref(false);
  const refusal = ref<string | null>(null);
  let requestId = newRequestId();

  // Each driver family in the catalogue's order, with its look and the accounts the app context names for it.
  const allDrivers = computed<StartDriver[]>(() =>
    looks.value.map((look) => {
      const read = startAccounts.value.find((each) => each.driver === look.family);
      const signedIn = (read?.accounts ?? []).filter((account) => account.unavailableReason === null);

      return {
        family: look.family,
        label: look.label,
        accounts: [
          ...signedIn.filter((account) => account.isDefault),
          ...signedIn.filter((account) => !account.isDefault),
        ],
        defaultModel: read?.defaultModel ?? look.models[0] ?? "default",
        models: look.models,
        efforts: look.efforts,
        defaultEffort: look.defaultEffort,
      };
    }),
  );
  const startable = computed(() => allDrivers.value.filter((driver) => driver.accounts.length > 0));
  const notSignedIn = computed(() => allDrivers.value.filter((driver) => driver.accounts.length === 0));
  const chosen = computed(() => startable.value.find((driver) => driver.family === family.value));
  // An ended chat starts as it ran last: on the driver of its newest conversation.
  const lastRun = computed(() => agent().conversations[0]?.driver);
  const isAsLastTime = computed(() => lastRun.value !== undefined && lastRun.value === family.value);

  function chooseDriver(driver: StartDriver, start: Partial<NewChatChoice> = {}): void {
    const account = driver.accounts.find((each) => each.id === start.accountId) ?? driver.accounts[0];
    family.value = driver.family;
    accountId.value = account?.id ?? null;
    model.value = start.model !== undefined && driver.models.includes(start.model) ? start.model : driver.defaultModel;
    effort.value =
      start.effort !== undefined && driver.efforts.includes(start.effort) ? start.effort : driver.defaultEffort;
    refusal.value = null;
  }

  function preselect(): void {
    const kept = lastRun.value === undefined ? readNewChatChoice(viewerId) : { family: lastRun.value };
    const first = startable.value.find((driver) => driver.family === kept?.family) ?? startable.value[0];

    if (first !== undefined) {
      chooseDriver(first, kept ?? {});
    }
  }

  // A start the server refused at once keeps every choice; Start again sends a new start.
  function refuse(reason: string): void {
    refusal.value = reason;
    requestId = newRequestId();
  }

  function start(): void {
    const driver = chosen.value;
    const account = driver?.accounts.find((each) => each.id === accountId.value);

    if (driver === undefined || account === undefined || model.value === null || effort.value === null) {
      return;
    }

    if (isSending.value) {
      return;
    }

    const key = requestId;
    const choice: NewChatChoice = {
      family: driver.family,
      accountId: account.id,
      accountRevision: account.signInRevision,
      model: model.value,
      effort: effort.value,
    };
    isSending.value = true;
    refusal.value = null;
    keyedPost(
      startMain.url(agent().profileKey),
      {
        requestId: key,
        agentId: agent().id,
        driver: choice.family,
        model: choice.model,
        effort: choice.effort,
        accountId: choice.accountId,
        accountRevision: choice.accountRevision,
      },
      key,
      {
        onAccepted: () => keepNewChatChoice(viewerId, choice),
        onRefused: (reason) => refuse(reason ?? "The session could not be started."),
        onUncertain: () => refuse("We could not confirm the session started; the chat shows where it stands."),
        onFinish: () => (isSending.value = false),
      },
      [hostProp],
    );
  }

  preselect();

  return {
    startable,
    notSignedIn,
    chosen,
    accountId,
    model,
    effort,
    isSending,
    refusal,
    isAsLastTime,
    chooseDriver,
    start,
  };
}

export type StartChoice = ReturnType<typeof useStartChoice>;

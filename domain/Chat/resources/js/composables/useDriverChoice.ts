import { computed, ref, watch } from "vue";
import { useAppContext } from "@kit/appContext";
import { accountsStartAccounts, chatStartDrivers, load, LoaderCancelled } from "@kit/loaders";
import type { EligibleAccountData } from "@kit/sessionStarts";
import type { DriverChoiceData } from "@generated/types/chat";

/**
 * A driver choice as a form keeps it: the program (a driver family), the signed-in account with the sign-in revision
 * seen, and the model.
 */
export type DriverChoice = {
  family: string;
  accountId: string | null;
  accountRevision: number | null;
  model: string;
};

/**
 * The program, account and model one form picks for an agent of the agent's profile: the programs it may start on,
 * the accounts of the chosen program (only a signed-in one can be picked) and that program's models, read again
 * whenever the program changes. It starts from the given choice, such as the one made last time.
 */
export function useDriverChoice(agentId: () => string, start: () => Partial<DriverChoice>) {
  const { drivers } = useAppContext();
  const programs = ref<DriverChoiceData[]>([]);
  const accounts = ref<EligibleAccountData[]>([]);
  const defaultModel = ref<string | null>(null);
  const family = ref<string | null>(start().family ?? null);
  const accountId = ref<string | null>(start().accountId ?? null);
  const model = ref<string | null>(start().model ?? null);
  const readFailure = ref<string | null>(null);

  // Each program once, in the catalogue's order, by the label of its first driver.
  const programOptions = computed(() =>
    [...new Map(programs.value.map((choice) => [choice.family, choice.label])).entries()].map(
      ([value, label]) => ({ value, label }),
    ),
  );
  const programLabel = computed(
    () => programOptions.value.find((option) => option.value === family.value)?.label ?? "this program",
  );
  // How the chosen program runs: the driver type of its first driver in the catalogue.
  const driverType = computed(
    () => programs.value.find((choice) => choice.family === family.value)?.driverType ?? "headless",
  );
  const modelOptions = computed(() =>
    (drivers.value.find((look) => look.family === family.value)?.models ?? []).map((choice) => ({
      value: choice,
      label: choice === defaultModel.value ? `${choice} (default)` : choice,
    })),
  );
  const accountOptions = computed(() =>
    accounts.value.map((choice) => ({
      value: choice.id,
      label: choice.unavailableReason === null ? choice.label : `${choice.label} · needs sign-in`,
      disabled: choice.unavailableReason !== null,
    })),
  );
  const signedIn = computed(() => accounts.value.filter((choice) => choice.unavailableReason === null));
  const account = computed(() => signedIn.value.find((choice) => choice.id === accountId.value));
  const choice = computed<DriverChoice | null>(() =>
    family.value === null || account.value === undefined || model.value === null
      ? null
      : {
          family: family.value,
          accountId: account.value.id,
          accountRevision: account.value.signInRevision,
          model: model.value,
        },
  );

  function readPrograms(): void {
    load(chatStartDrivers, { agent: agentId() }).then(
      (answer) => {
        if (answer.status !== "ok") {
          readFailure.value = "The programs could not be read.";

          return;
        }

        programs.value = answer.value.drivers;
        family.value = family.value ?? programs.value[0]?.family ?? null;
      },
      () => (readFailure.value = "The programs could not be read."),
    );
  }

  function readAccounts(chosen: string): void {
    load(accountsStartAccounts, { agent: agentId(), family: chosen }).then(
      (answer) => {
        if (answer.status !== "ok") {
          readFailure.value = "The accounts could not be read.";

          return;
        }

        accounts.value = answer.value.accounts;
        defaultModel.value = answer.value.defaultModel;
        const kept = signedIn.value.find((option) => option.id === accountId.value);
        accountId.value = (kept ?? signedIn.value.find((option) => option.isDefault) ?? signedIn.value[0])?.id ?? null;
        const models = modelOptions.value.map((option) => option.value);
        model.value = model.value !== null && models.includes(model.value) ? model.value : answer.value.defaultModel;
        readFailure.value = null;
      },
      (failure: Error) => {
        if (!(failure instanceof LoaderCancelled)) {
          readFailure.value = "The accounts could not be read.";
        }
      },
    );
  }

  readPrograms();
  watch(
    family,
    (chosen) => {
      if (chosen !== null) {
        readAccounts(chosen);
      }
    },
    { immediate: true },
  );

  return {
    family,
    accountId,
    model,
    programOptions,
    programLabel,
    driverType,
    accountOptions,
    modelOptions,
    signedIn,
    choice,
    readFailure,
  };
}

export type DriverChoiceState = ReturnType<typeof useDriverChoice>;

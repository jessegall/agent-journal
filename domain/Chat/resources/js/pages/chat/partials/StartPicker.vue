<script setup lang="ts">
import { Link } from "@inertiajs/vue3";
import Avatar from "@kit/Avatar";
import Button from "@kit/Button";
import Icon from "@kit/Icon";
import SegmentedControl from "@kit/SegmentedControl";
import SegmentedItem from "@kit/SegmentedItem";
import { accountsPage } from "@kit/sessionStarts";
import { computed } from "vue";
import type { AgentOptionData } from "@generated/types/chat";
import { useStartChoice, type StartDriver } from "../../../composables/useStartChoice";

/**
 * The start picker in place of the composer of a chat with no session, new or ended: the drivers with a signed-in
 * account as big cards, each naming its account, then the account when there are several, the model and the effort,
 * then Start or Enter. Arrow keys move within a group. With no account signed in it offers only Add an account.
 */
const props = defineProps<{ agent: AgentOptionData; isNew: boolean }>();

const choice = useStartChoice(() => props.agent);
// A start in progress and a failed one come from the agent's status in the props, so a reload shows them as they are.
const isStarting = computed(
  () => choice.isSending.value || ["starting", "verifying"].includes(props.agent.status.sessionState),
);
const title = computed(() => (props.isNew ? "Start a new chat" : `Start ${props.agent.name} again`));
const subtitle = computed(() =>
  choice.isAsLastTime.value
    ? "As last time. Change anything, or Start; the new session reads this chat first."
    : "Choose what runs it; your first message goes after it starts.",
);
// The reason the agent's last start was refused, or the one this picker's start was refused with.
const failure = computed(
  () =>
    choice.refusal.value ??
    (["failed", "refused"].includes(props.agent.status.sessionState) ? props.agent.status.reason : null),
);

type Group = "driver" | "account" | "model" | "effort";

function accountLabelOf(driver: StartDriver): string {
  return driver.accounts[0]?.label ?? "";
}

function pick(group: Group, value: string): void {
  const driver = choice.chosen.value;

  if (isStarting.value) {
    return;
  }

  if (group === "driver") {
    const next = choice.startable.value.find((each) => each.family === value);

    if (next !== undefined) {
      choice.chooseDriver(next);
    }

    return;
  }

  if (driver === undefined) {
    return;
  }

  ({ account: choice.accountId, model: choice.model, effort: choice.effort })[group].value = value;
}

const optionClass =
  "flex min-h-11 items-center gap-2.5 rounded-field border border-border-2 px-3 py-2 text-left text-text-2 " +
  "hover:border-border-3 hover:bg-hover hover:text-text aria-checked:border-text aria-checked:bg-sel " +
  "aria-checked:text-text aria-checked:shadow-[inset_0_0_0_1px_var(--text)] disabled:opacity-60 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";
</script>

<template>
  <div
    class="rounded-composer border border-border-3 bg-bg px-4 pt-3.5 pb-3"
    :class="isNew && 'mx-auto w-full max-w-[620px]'"
    role="group"
    aria-label="Start a session"
    data-start-picker
  >
    <template v-if="choice.startable.value.length === 0">
      <div class="flex items-center gap-2.5">
        <Icon name="users" :size="14" />
        <div>
          <b class="block text-title font-medium text-text">No account is signed in</b>
          <small class="block text-small text-text-3">A session needs a signed-in driver account.</small>
        </div>
      </div>
      <div class="mt-3.5 flex items-center gap-2.5 border-t border-line pt-3">
        <span class="flex-1 text-small text-text-3">Add one; this chat offers it here once it is signed in.</span>
        <Button variant="primary" :href="accountsPage.url()" data-add-account>Add an account</Button>
      </div>
    </template>
    <template v-else>
      <div class="flex items-center gap-2.5">
        <Avatar :participant="{ kind: 'agent', driver: choice.chosen.value?.family ?? '' }" />
        <div>
          <b class="block text-title font-medium text-text" data-start-title>{{ title }}</b>
          <small class="mt-0.5 block text-small text-text-3">{{ subtitle }}</small>
        </div>
      </div>

      <div id="start-driver-label" class="mt-3 mb-1.5 text-group tracking-[.06em] text-text-4 uppercase">Driver</div>
      <SegmentedControl
        bare
        label="Driver"
        :items="choice.startable.value.map((driver) => ({ value: driver.family, label: driver.label }))"
        :model-value="choice.chosen.value?.family ?? ''"
        class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2"
        :disabled="isStarting"
        @update:model-value="pick('driver', $event)"
        @keydown.enter.prevent="choice.start()"
      >
        <template #items>
          <SegmentedItem
            v-for="driver in choice.startable.value"
            :key="driver.family"
            :value="driver.family"
            bare
            :class="optionClass"
            :disabled="isStarting"
            :data-start-option="`driver:${driver.family}`"
          >
            <Avatar :participant="{ kind: 'agent', driver: driver.family }" />
            <span class="flex min-w-0 flex-col leading-[1.3]">
              <b class="text-card font-medium text-text" data-start-label>{{ driver.label }}</b>
              <small class="truncate text-meta text-text-3">{{ accountLabelOf(driver) }}</small>
            </span>
          </SegmentedItem>
        </template>
      </SegmentedControl>
      <template v-if="choice.notSignedIn.value.length > 0">
        <p class="mt-2 text-small text-text-3" data-not-signed-in>
          {{ choice.notSignedIn.value.map((driver) => driver.label).join(" and ") }}
          {{ choice.notSignedIn.value.length > 1 ? "are" : "is" }} not signed in.
          <Link :href="accountsPage.url()" class="underline">Add an account</Link>
        </p>
      </template>

      <template v-if="choice.chosen.value">
        <template v-if="choice.chosen.value.accounts.length > 1">
          <div id="start-account-label" class="mt-3 mb-1.5 text-group tracking-[.06em] text-text-4 uppercase">Account</div>
          <SegmentedControl
            bare
            label="Account"
            :items="choice.chosen.value.accounts.map((account) => ({ value: account.id, label: account.label }))"
            :model-value="choice.accountId.value ?? ''"
            class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2"
            :disabled="isStarting"
            @update:model-value="pick('account', $event)"
            @keydown.enter.prevent="choice.start()"
          >
            <template #items>
              <SegmentedItem
                v-for="account in choice.chosen.value.accounts"
                :key="account.id"
                :value="account.id"
                bare
                :class="optionClass"
                :disabled="isStarting"
                :data-start-option="`account:${account.id}`"
              >
                <b class="text-card font-medium text-text" data-start-label>{{ account.label }}</b>
              </SegmentedItem>
            </template>
          </SegmentedControl>
        </template>

        <div id="start-model-label" class="mt-3 mb-1.5 text-group tracking-[.06em] text-text-4 uppercase">Model</div>
        <SegmentedControl
          bare
          label="Model"
          :items="choice.chosen.value.models.map((value) => ({ value, label: value }))"
          :model-value="choice.model.value ?? ''"
          class="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2"
          :disabled="isStarting"
          @update:model-value="pick('model', $event)"
          @keydown.enter.prevent="choice.start()"
        >
          <template #items>
            <SegmentedItem
              v-for="each in choice.chosen.value.models"
              :key="each"
              :value="each"
              bare
              :class="optionClass"
              :disabled="isStarting"
              :data-start-option="`model:${each}`"
            >
              <span class="flex flex-col leading-[1.3]">
                <b class="text-card font-medium text-text" data-start-label>{{ each }}</b>
                <template v-if="each === choice.chosen.value.defaultModel">
                  <small class="text-meta text-text-3">Default</small>
                </template>
              </span>
            </SegmentedItem>
          </template>
        </SegmentedControl>

        <div id="start-effort-label" class="mt-3 mb-1.5 text-group tracking-[.06em] text-text-4 uppercase">Effort</div>
        <SegmentedControl
          bare
          label="Effort"
          :items="choice.chosen.value.efforts.map((value) => ({ value, label: value }))"
          :model-value="choice.effort.value ?? ''"
          class="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-2"
          :disabled="isStarting"
          @update:model-value="pick('effort', $event)"
          @keydown.enter.prevent="choice.start()"
        >
          <template #items>
            <SegmentedItem
              v-for="each in choice.chosen.value.efforts"
              :key="each"
              :value="each"
              bare
              :class="[optionClass, 'min-h-9 justify-center text-text capitalize']"
              :disabled="isStarting"
              :data-start-option="`effort:${each}`"
            >
              {{ each }}
            </SegmentedItem>
          </template>
        </SegmentedControl>
      </template>

      <div class="mt-3.5 flex items-center gap-2.5 border-t border-line pt-3">
        <template v-if="failure && !isStarting">
          <span class="flex flex-1 flex-wrap items-center gap-1.5 text-small text-danger" role="alert" data-start-failure>
            <Icon name="alert" :size="14" />The start failed: {{ failure }}.
            <span class="text-text-3">Nothing was lost; change a choice, or Start again.</span>
          </span>
        </template>
        <template v-else>
          <span class="flex-1 text-small text-text-3" :role="isStarting ? 'status' : undefined">{{
            isStarting
              ? "Starting the session…"
              : [choice.chosen.value?.label, choice.model.value, choice.effort.value && `${choice.effort.value} effort`]
                  .filter(Boolean)
                  .join(" · ") + " · Enter starts it"
          }}</span>
        </template>
        <Button
          variant="primary"
          :pending="isStarting"
          :disabled="!choice.chosen.value || choice.accountId.value === null"
          data-start
          @click="choice.start()"
          >{{ failure ? "Start again" : "Start" }}</Button
        >
      </div>
    </template>
  </div>
</template>

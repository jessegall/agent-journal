<script setup lang="ts">
import SegmentedControl from "@kit/SegmentedControl";
import TextLink from "@kit/TextLink";
import { ref } from "vue";
import type { WindowOfferData } from "@/generated/types/core";
import { keyedPost } from "../../framework/keyedPost";

/**
 * What a window offers for the record it shows, such as adding it to a chat: the action opens a picker of the
 * viewer's destinations, shows the one chosen before anything is sent, and cancel sends nothing. A record that can no
 * longer be added says so and keeps the choice.
 */
const props = defineProps<{ offer: WindowOfferData }>();

const answers: Record<string, string> = {
  added: "Added to the chat",
  present: "Already in the chat",
  unavailable: "This cannot be docked",
};
const choosing = ref(false);
const chosen = ref<string | null>(props.offer.destinations[0]?.value ?? null);
const answer = ref<string | null>(null);

function cancel(): void {
  choosing.value = false;
  answer.value = null;
}

/**
 * Docks through the chat page's own action; what came of it arrives as the answer's one-time flash, and a refusal as
 * its errors.
 */
function confirm(): void {
  if (chosen.value === null) {
    return;
  }

  keyedPost(
    props.offer.url,
    {
      [props.offer.destinationField]: chosen.value,
      type: props.offer.type,
      id: props.offer.id,
    },
    crypto.randomUUID(),
    {
      onAccepted: (flash) => {
        const outcome =
          typeof flash.dockOutcome === "string"
            ? flash.dockOutcome
            : "unavailable";
        answer.value = answers[outcome] ?? outcome;

        if (outcome !== "unavailable") {
          choosing.value = false;
        }
      },
      onRefused: (reason) => (answer.value = reason ?? answers.unavailable),
      onUncertain: () =>
        (answer.value = "The journal did not answer; add it again to be sure."),
    },
  );
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 text-sm">
    <TextLink :aria-expanded="choosing" @click="choosing = true">
      {{ offer.label }}
    </TextLink>
    <template v-if="choosing">
      <template v-if="chosen !== null">
        <SegmentedControl
          :model-value="chosen"
          label="Choose a chat"
          :items="offer.destinations"
          @update:model-value="chosen = $event"
        />
      </template>
      <TextLink :disabled="chosen === null" @click="confirm"> Add </TextLink>
      <TextLink @click="cancel"> Cancel </TextLink>
    </template>
    <template v-if="answer !== null">
      <span role="status">{{ answer }}</span>
    </template>
  </div>
</template>

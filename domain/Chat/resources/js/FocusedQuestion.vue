<script setup lang="ts">
import TextLink from "@kit/TextLink";
import type { FocusedQuestionData } from "@generated/types/chat";
import type { MessageView } from "@kit/CoreTypes";
import { LEASE_MILLISECONDS, useNotifications } from "@kit/notifications";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";

/**
 * The one question a notification opened, shown passively: its text, whether it still waits, was answered or was
 * dismissed, and its answer once there is one. Only after it is shown does the reader's own receipt of it become
 * read; nothing else is read, taken up or answered. A question the reader may not see offers a retry and marks
 * nothing. While the tab is visible it is read again every lease, so a question the reader lost access to leaves
 * the screen without a push.
 */
const props = defineProps<{
  focused: FocusedQuestionData | undefined;
}>();

const emit = defineEmits<{
  reply: [message: MessageView];
  retry: [];
}>();

const notifications = useNotifications();
const heading = ref<HTMLElement | null>(null);
const question = computed(() => props.focused?.question);
const isWaiting = computed(
  () => question.value?.state === "waiting_for_answer",
);

const stateLabel = computed(() => {
  switch (question.value?.state) {
    case "waiting_for_answer":
      return "Waiting for an answer";
    case "answered":
      return "Answered";
    case "dismissed":
      return "Dismissed";
    default:
      return null;
  }
});

let markedId: string | undefined;

/**
 * Focuses the question once it is on screen, then marks the reader's receipt of it read, once per question.
 */
async function acknowledgeShown(): Promise<void> {
  const shown = question.value;

  if (shown === undefined || markedId === shown.id) {
    return;
  }

  markedId = shown.id;
  await nextTick();
  heading.value?.focus();
  void notifications.markQuestionRead(shown.id);
}

let leaseTimer: ReturnType<typeof setInterval> | undefined;

function readAgainWhenVisible(): void {
  if (document.visibilityState === "visible") {
    emit("retry");
  }
}

onMounted(() => {
  void acknowledgeShown();
  leaseTimer = setInterval(readAgainWhenVisible, LEASE_MILLISECONDS);
});
onBeforeUnmount(() => clearInterval(leaseTimer));
watch(question, acknowledgeShown);

function goBack(): void {
  window.history.back();
}
</script>

<template>
  <section
    class="flex flex-col gap-2 rounded-bubble border border-border px-3 py-2"
    aria-labelledby="focused-question"
  >
    <template v-if="question">
      <h2
        id="focused-question"
        ref="heading"
        tabindex="-1"
        class="text-small text-text-3"
      >
        Question from {{ question.authorLabel ?? question.sourceInboxLabel }}
      </h2>
      <p class="text-body whitespace-pre-wrap text-text">{{ question.body }}</p>
      <template v-if="stateLabel !== null">
        <p class="text-small text-text-3">{{ stateLabel }}</p>
      </template>
      <template v-if="focused?.answer">
        <p class="text-small text-text-3">Answer</p>
        <p class="text-body whitespace-pre-wrap text-text">
          {{ focused.answer.body }}
        </p>
      </template>
      <span class="flex gap-2 text-small text-text-3">
        <template v-if="isWaiting">
          <TextLink @click="emit('reply', question)">Reply</TextLink>
        </template>
        <TextLink @click="goBack">Back</TextLink>
      </span>
    </template>
    <template v-else>
      <h2 id="focused-question" class="text-small text-text-3">
        This question is unavailable
      </h2>
      <p class="text-small text-text-3">
        It may have been removed, or you can no longer see it.
      </p>
      <span class="flex gap-2 text-small text-text-3">
        <TextLink @click="emit('retry')">Retry</TextLink>
        <TextLink @click="goBack">Back</TextLink>
      </span>
    </template>
  </section>
</template>

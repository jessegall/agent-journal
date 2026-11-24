<script setup lang="ts">
import { router } from "@inertiajs/vue3";
import { ref } from "vue";
import Button from "@kit/Button";
import Card from "@kit/Card";
import Icon from "@kit/Icon";
import Textarea from "@kit/Textarea";
import type { QuestionEntryData } from "@generated/types/chat";
import { answer as answerRoute } from "@generated/routes/chat";

/**
 * A question asked in the chat, as one card: its text, and for its target while it is open the choices in order or a
 * field for an open answer; once answered, the answer in the same card.
 */
const props = defineProps<{
  question: QuestionEntryData;
  // Who asked it, as the card names them.
  askedBy: string;
  time: string;
  conversationProp: string;
}>();

const answer = ref("");
const isSending = ref(false);

function send(text: string): void {
  if (text.trim() === "" || isSending.value) {
    return;
  }

  isSending.value = true;
  router.post(
    answerRoute().url,
    { questionId: props.question.id, answer: text },
    {
      preserveScroll: true,
      preserveState: true,
      only: [props.conversationProp],
      onFinish: () => (isSending.value = false),
    },
  );
}
</script>

<template>
  <Card
    padding="sm"
    class="flex w-full max-w-[92%] flex-col gap-2 self-start"
    :aria-label="`Question from ${askedBy}`"
  >
    <span class="flex items-start gap-2.5">
      <Icon name="question" :size="16" class="mt-0.5 flex-none text-text-3" />
      <span class="min-w-0 flex-1">
        <span class="block text-body whitespace-pre-wrap text-text">{{ question.text }}</span>
        <small class="block text-badge text-text-3">Question from {{ askedBy }} · {{ time }}</small>
      </span>
    </span>
    <template v-if="question.answer !== null">
      <p class="text-body whitespace-pre-wrap text-text-2">
        <b class="font-medium">Answer:</b> {{ question.answer }}
      </p>
    </template>
    <template v-else-if="question.canAnswer && question.type === 'choice'">
      <div class="flex flex-wrap gap-1.5" role="group" aria-label="Choices">
        <template v-for="option in question.options" :key="option">
          <Button size="small" variant="bordered" :disabled="isSending" @click="send(option)">
            {{ option }}
          </Button>
        </template>
      </div>
    </template>
    <template v-else-if="question.canAnswer">
      <form class="flex flex-col gap-1.5" @submit.prevent="send(answer)">
        <Textarea v-model="answer" :rows="2" aria-label="Your answer" />
        <Button
          size="small"
          variant="bordered"
          type="submit"
          class="self-end"
          :disabled="isSending || answer.trim() === ''"
        >
          Answer
        </Button>
      </form>
    </template>
    <template v-else>
      <span class="text-small text-text-3">Waiting for an answer</span>
    </template>
  </Card>
</template>

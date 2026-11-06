<script setup>
import { computed, unref } from "vue";
import { Btn, Icon, useDockCard, useWindow } from "@journal/window-kit";

// the card above the chat while questions wait: how many the agent asked, and the way to the questions window
const QUESTIONS_WINDOW = "questions.questions";
const window = useWindow();
const card = useDockCard();
const head = window.option("head");
const actions = window.option("actions");
const count = computed(() => card.data.value?.rows.length ?? 0);
const words = computed(
  () =>
    `Agent asked ${count.value} ${count.value === 1 ? "question" : "questions"}`,
);

window.follow(["question.*"], card.reload);
</script>

<template>
  <template v-if="head?.value ?? head">
    <Teleport :to="head?.value ?? head">
      <Icon name="questions" :size="14" class="open-questions-icon" />
      <span class="open-questions-text" data-open-questions :title="words">{{
        words
      }}</span>
    </Teleport>
  </template>
  <template v-if="unref(actions)"
    ><Teleport :to="unref(actions)"
      ><Btn
        small
        bordered
        data-open-questions-window
        @click="window.open(QUESTIONS_WINDOW)"
        >Open</Btn
      ></Teleport
    ></template
  >
</template>

<style scoped>
.open-questions-icon {
  flex: none;
  color: var(--text-3);
}

.open-questions-text {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.open-questions-space {
  flex: 1;
}
</style>

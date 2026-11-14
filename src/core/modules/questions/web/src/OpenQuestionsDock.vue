<script setup>
import { computed, unref } from "vue";
import { Btn, Icon, useDockCard, useWindow } from "@journal/window-kit";

// the card above the chat while questions wait: how many the agent asked, and the way to the questions window
const QUESTIONS_WINDOW = "questions.questions";
const view = useWindow();
const card = useDockCard();
const head = view.option("head");
const actions = view.option("actions");
const foot = view.option("foot");
const TITLES_SHOWN = 2;
const count = computed(() => card.data.value?.rows.length ?? 0);
const words = computed(
  () =>
    `Agent asked ${count.value} ${count.value === 1 ? "question" : "questions"}`,
);
// the second line names the waiting questions by their titles, the first ones when there are several
const titles = computed(() => {
  const rows = card.data.value?.rows ?? [];
  const shown = rows.slice(0, TITLES_SHOWN).map((row) => row.text).join(" · ");
  return rows.length > TITLES_SHOWN ? `${shown} · ${rows.length - TITLES_SHOWN} more` : shown;
});

view.follow(["question.*"], card.reload);
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
  <template v-if="unref(foot) && titles"
    ><Teleport :to="unref(foot)"
      ><span class="open-questions-titles" data-open-questions-titles :title="titles">{{
        titles
      }}</span></Teleport
    ></template
  >
  <template v-if="unref(actions)"
    ><Teleport :to="unref(actions)"
      ><Btn
        small
        bordered
        data-open-questions-window
        @click="view.open(QUESTIONS_WINDOW)"
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

.open-questions-titles {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.open-questions-space {
  flex: 1;
}
</style>

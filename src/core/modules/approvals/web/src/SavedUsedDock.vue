<script setup>
import {computed} from "vue";
import {useDockCard, useWindow} from "@journal/window-kit";

// the card of an approval a saved yes accepted: the question that was asked, and the yes the user kept for it
const card = useDockCard();
const item = useWindow().option("row");
const question = computed(() => item.value.text);
const reason = computed(() =>
    card.data.value?.scope === "same"
        ? "You accepted this request before and chose to always accept it."
        : "You accepted requests like this before and chose to always accept them."
);
</script>

<template>
  <p class="saved-question" data-saved-question>{{ question }}</p>
  <p class="saved-reason" data-saved-reason>{{ reason }}</p>
</template>

<style scoped>
.saved-question {
  margin: 4px 14px 2px 36px;
  color: var(--text);
  font-size: 13.5px;
  font-weight: 600;
}
.saved-reason {
  margin: 0 14px 8px 36px;
  color: var(--text-3);
  font-size: 12px;
  font-weight: 400;
}
</style>

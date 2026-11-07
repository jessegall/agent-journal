<script setup>
import {computed} from "vue";
import {useDockCard, useWindow} from "@journal/window-kit";

const card = useDockCard();
const item = useWindow().option("row");
const request = computed(() => card.data.value?.rows?.find((row) => row.id === item.value.target_id));
// the first line of the request is its question, the card's title; the rest describes what would happen
const lines = computed(() => String(request.value?.text ?? "").split("\n"));
const title = computed(() => lines.value[0]);
const description = computed(() => lines.value.slice(1).join("\n").trim());
</script>

<template>
  <p class="approval-question" data-approval-question>{{ title }}</p>
  <template v-if="description">
    <p class="approval-description" data-approval-description>{{ description }}</p>
  </template>
  <details class="approval-details">
    <summary>Action details</summary>
    <pre>{{ request?.arguments?.join(" ") }}</pre>
    <template v-if="request?.continued_arguments?.length">
      <pre>{{ request.continued_arguments.join(" ") }}</pre>
    </template>
  </details>
</template>

<style scoped>
.approval-question {
  margin: 4px 14px 2px 36px;
  color: var(--text);
  font-size: 13.5px;
  font-weight: 600;
}
.approval-description {
  margin: 0 14px 8px 36px;
  color: var(--text-3);
  font-size: 12px;
  font-weight: 400;
  white-space: pre-wrap;
}
.approval-details {
  margin: 4px 14px 8px 36px;
}
.approval-details pre {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>

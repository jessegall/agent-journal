<script setup>
import { useDockRow } from "@journal/window-kit";

const request = useDockRow("approval");
</script>

<template>
  <p class="approval-question" data-approval-question>{{ request?.text }}</p>
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
  margin: 4px 14px 8px 36px;
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

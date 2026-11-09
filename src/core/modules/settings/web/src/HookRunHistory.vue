<script setup>
import { computed } from "vue";
import { TimeAgo } from "@journal/window-kit";
const props = defineProps({ history: { type: Object, required: true } });
const run = computed(() => props.history.last);
const OUTCOMES = {
  allowed: "Allowed",
  refused: "Refused",
  rewritten: "Rewrote input",
  timed_out: "Timed out",
  failed: "Failed",
};
</script>

<template>
  <div class="hook-history">
    <template v-if="run">
      <strong>{{ OUTCOMES[history.last_outcome] }}</strong>
      <TimeAgo :at="history.last_at" />
      <span>Ended with code {{ run.exit_code }} after {{ run.milliseconds }} ms</span>
    </template>
    <template v-else><span>No runs yet</span></template>
    <span>Refusals: {{ history.refused }} / {{ history.runs }}</span>
    <template v-if="history.failed || history.timed_out"
      ><span
        >Failed: {{ history.failed }} · Timed out: {{ history.timed_out }}</span
      ></template
    >
  </div>
</template>

<style scoped>
.hook-history {
  display: flex;
  flex: 0 1 210px;
  flex-direction: column;
  gap: 3px;
  color: var(--text-3);
  font-size: 11px;
  overflow-wrap: anywhere;
}
.hook-history strong {
  color: var(--text-2);
  font-weight: 500;
}
</style>

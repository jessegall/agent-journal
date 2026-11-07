<script setup>
import { useDockRow } from "@journal/window-kit";

// the whole text of a rule an agent proposed, on an orange card so a person sees that it waits on them; the docked item keeps only the start of it
const rule = useDockRow("rule");
</script>

<template>
  <p class="rule-dock" data-rule-dock>{{ rule?.text }}</p>
</template>

<style scoped>
.rule-dock {
  margin: 3px 0 6px;
  border-block: 1px solid var(--border-inner);
  padding: 7px 14px 8px 36px;
  color: var(--text);
  font-size: 13px;
  line-height: 1.5;
}
</style>

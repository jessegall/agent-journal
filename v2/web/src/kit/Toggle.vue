<script setup>
defineProps({ on: Boolean, text: String });
const emit = defineEmits(["change"]);
</script>

<template>
  <button type="button" :class="['toggle', { on }]" @click="emit('change', !on)">
    <span class="knob" />
    <span v-if="text" class="text">{{ text }}</span>
  </button>
</template>

<style scoped>
.toggle { display: inline-flex; align-items: center; gap: 7px; padding: 3px 9px 3px 3px; border: 1px solid var(--border-2); border-radius: 999px; background: var(--raised); color: var(--text-2); cursor: pointer; font-size: 12px; }
.knob { width: 14px; height: 14px; border-radius: 50%; background: var(--text-3); transition: background .15s; }
.toggle.on { border-color: var(--accent); color: var(--text); }
.toggle.on .knob { background: var(--accent-text); }
</style>

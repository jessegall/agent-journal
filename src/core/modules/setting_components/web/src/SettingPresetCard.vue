<script setup>
// one preset in short: its name and a line about it, and a button that fills the form with it when asked for
defineProps({name: {type: String, required: true}, line: {type: String, required: true}, canFill: {type: Boolean, default: false}, disabled: {type: Boolean, default: false}});
const emit = defineEmits(["fill"]);
</script>

<template>
    <article class="setting-preset-card">
        <div class="text">
            <strong>{{ name }}</strong>
            <span class="line">{{ line }}</span>
        </div>
        <template v-if="canFill">
            <button type="button" :disabled="disabled" data-preset-fill @click="emit('fill')">Fill in {{ name }}</button>
        </template>
    </article>
</template>

<style scoped>
.setting-preset-card { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border: 1px solid var(--border-2); border-radius: 8px; background: var(--bg); }
.text { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }
strong { color: var(--text); font-size: 12.8px; font-weight: 600; }
.line { color: var(--text-3); font-size: 12px; line-height: 1.45; text-wrap: pretty; }
button { flex: none; height: 26px; padding: 0 10px; border: 1px solid var(--border-2); border-radius: 7px; background: var(--bg); color: var(--text); font: inherit; font-size: 12px; cursor: pointer; }
button:hover:not([disabled]) { background: var(--hover); }
button[disabled] { cursor: default; opacity: 0.45; }
</style>

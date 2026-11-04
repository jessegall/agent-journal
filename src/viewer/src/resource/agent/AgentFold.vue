<script setup>
import Icon from "../../kit/Icon.vue";

// a band that opens and closes the rows under it; it starts closed, and the open state is the parent's to read
defineProps({icon: {type: String, required: true}, label: {type: String, required: true}, count: {type: Number, required: true}});
const open = defineModel("open", {type: Boolean, default: false});
</script>

<template>
    <button type="button" :class="['fold', {shut: !open}]" :aria-expanded="open" data-agent-fold @click="open = !open">
        <Icon :name="icon" :size="12" />{{ label }}<span class="count">{{ count }}</span><Icon class="arrow" name="caret" :size="11" />
    </button>
    <template v-if="open">
        <div data-agent-fold-body><slot /></div>
    </template>
</template>

<style scoped>
.fold { display: flex; align-items: center; gap: 7px; width: 100%; height: 28px; padding: 0 14px; border: 0; border-bottom: 1px solid var(--border-inner); background: var(--side); color: var(--text-2); font: inherit; font-size: 11.5px; font-weight: 500; letter-spacing: .03em; text-align: left; cursor: pointer; }
.fold svg { color: var(--text-3); }
.count { margin-left: auto; color: var(--text-3); font-size: 11px; font-variant-numeric: tabular-nums; }
.arrow { transition: transform 160ms; }
.shut .arrow { transform: rotate(-90deg); }
@media (prefers-reduced-motion: reduce) { .arrow { transition: none; } }
</style>

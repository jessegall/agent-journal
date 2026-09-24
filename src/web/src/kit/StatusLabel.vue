<script setup>
import Dot from "./Dot.vue";

const LIT = ["working", "busy", "compacting", "waiting"];

defineProps({
    state: {type: String, required: true},
    note: {type: String, default: ""},
    size: {type: Number, default: 7},
});
</script>

<template>
    <span :class="['status-label', state, {lit: LIT.includes(state)}]">
        <template v-if="state === 'stopped'">
            <Dot kind="struck" :size="size" />
        </template>
        <template v-else>
            <Dot :kind="state" :size="size" solid :pulsing="state === 'working'" />
        </template>
        <span class="status-word"><slot /></span>
        <template v-if="note">
            <span class="status-note">{{ note }}</span>
        </template>
    </span>
</template>

<style scoped>
.status-label {
    --tone: var(--text-4);
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
    white-space: nowrap;
}

.status-label.lit {
    --tone: var(--accent);
}

.status-word {
    color: var(--text-2);
}

.status-label.lit .status-word {
    color: var(--text);
    font-weight: 500;
}

.status-note {
    overflow: hidden;
    color: var(--text-3);
    text-overflow: ellipsis;
    font-variant-numeric: tabular-nums;
}
</style>

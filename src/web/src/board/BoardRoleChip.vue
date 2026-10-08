<script setup>
import {ui} from "../state/ui.js";
import {go} from "../route.js";

defineProps({
    title: {type: String, required: true},
    n: {type: Number, default: 0},
    task: {type: String, default: ""},
    env: {type: String, default: ""},
});
const light = (n) => (ui.litCard = n);
</script>

<template>
    <button
        type="button"
        :class="['board-role', {idle: !n}]"
        :disabled="!n"
        :title="n ? `${title}: #${n} ${task}, opens its chat` : `${title}: idle`"
        @mouseenter="light(n)"
        @mouseleave="light(0)"
        @click="go(env)"
    >
        {{ title }}
        <span class="board-role-card">{{ n ? `#${n}` : "idle" }}</span>
    </button>
</template>

<style scoped>
.board-role {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 7px;
    height: 26px;
    padding: 0 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 12px;
    white-space: nowrap;
    cursor: pointer;
}

.board-role:hover {
    border-color: var(--border-3);
    background: var(--hover);
}

.board-role.idle {
    color: var(--text-3);
    cursor: default;
}

.board-role.idle:hover {
    border-color: var(--border-2);
    background: none;
}

.board-role-card {
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}
</style>

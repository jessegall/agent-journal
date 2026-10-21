<script setup>
import MenuLabel from "../kit/MenuLabel.vue";

const KEYS = [
    ["↑ ↓", "Move through the list"],
    ["Enter", "Open the task"],
    ["Space", "Open or close the task beside the list"],
    ["C", "New task"],
    ["S", "Change the status"],
    ["V", "List or graph"],
    ["/", "Search"],
    ["Esc", "Close"],
];
</script>

<template>
    <MenuLabel>Keys</MenuLabel>
    <template v-for="[keys, what] in KEYS" :key="keys">
        <span class="key-line">
            {{ what }}
            <kbd>{{ keys }}</kbd>
        </span>
    </template>
</template>

<style scoped>
.key-line {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 8px;
    color: var(--text-2);
    font-size: 12px;
}

kbd {
    margin-left: auto;
    padding: 0 4px;
    border: 1px solid var(--border-2);
    border-radius: 4px;
    color: var(--text-3);
    font: 500 10px var(--mono);
}
</style>

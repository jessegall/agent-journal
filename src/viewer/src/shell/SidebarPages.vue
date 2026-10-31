<script setup>
import Icon from "../kit/Icon.vue";
import MarkIcon from "../kit/MarkIcon.vue";

// the left sidebar as version 4 drew it: the environment's Home and the windows the suite offers, each opening where a click on it says,
// then the environments with the current one marked
defineProps({windows: {type: Array, default: () => []}, environments: {type: Array, default: () => []}, current: {type: String, default: ""}});
const emit = defineEmits(["open"]);
</script>

<template>
    <aside class="sidebar" data-sidebar>
        <p class="heading">Environment</p>
        <a class="item active" :href="`?environment=${current}`"><Icon name="home" :size="14" />Home</a>
        <template v-for="window in windows" :key="window.name">
            <button type="button" class="item" :data-sidebar-window="window.name" :disabled="Boolean(window.unavailable_reason)" @click="emit('open', window.name)">
                <MarkIcon :name="window.icon || 'window'" />{{ window.title }}
            </button>
        </template>
        <p class="heading">Environments</p>
        <template v-for="environment in environments" :key="environment.id">
            <a :class="['item', {active: environment.name === current}]" :data-environment="environment.name" :href="`?environment=${environment.name}`">
                <span class="dot" />{{ environment.name }}
            </a>
        </template>
    </aside>
</template>

<style scoped>
.sidebar {
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 2px;
    width: 220px;
    padding: 12px 10px;
    overflow-y: auto;
    border-right: 1px solid var(--border);
    background: var(--side);
}

.heading {
    margin: 12px 8px 4px;
    color: var(--text-3);
    font-size: 12px;
}

.item {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 6px 8px;
    border: 0;
    border-radius: 7px;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
}

.item:hover,
.item.active {
    background: var(--raised);
}

.dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
}
</style>

<script setup>
import Icon from "./Icon.vue";

defineProps({
    href: {type: String, required: true},
    icon: {type: String, required: true},
    title: {type: String, required: true},
    text: {type: String, default: ""},
    count: {type: Number, default: 0},
    hot: Boolean,
});
</script>

<template>
    <a class="nav-tile" :href="href">
        <span class="nav-tile-icon"><Icon :name="icon" :size="16" /></span>
        <span class="nav-tile-body">
            <span class="nav-tile-title">{{ title }}</span>
            <span class="nav-tile-text">{{ text }}</span>
        </span>
        <template v-if="count">
            <span :class="['nav-tile-count', {hot}]">{{ count }}</span>
        </template>
    </a>
</template>

<style scoped>
.nav-tile {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    min-width: 0;
    padding: 14px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
    color: inherit;
    text-decoration: none;
    transition:
        background 0.15s,
        border-color 0.15s;
}

.nav-tile:hover {
    border-color: var(--border-3);
    background: var(--hover);
}

.nav-tile-icon {
    flex: none;
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--bg);
    color: var(--text-2);
}

.nav-tile-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.nav-tile-title {
    color: var(--text);
    font-size: 13px;
    font-weight: 500;
}

.nav-tile-text {
    display: -webkit-box;
    overflow: hidden;
    color: var(--text-3);
    font-size: 12px;
    line-height: 1.4;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.nav-tile-count {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
}

.nav-tile-count.hot {
    color: var(--accent-text);
}
</style>

<script setup>
import MarkIcon from "../kit/MarkIcon.vue";

// the bar at the foot of a phone: one button per window of its layout, the open one marked, a window's count beside its title
defineProps({
    windows: {type: Array, required: true},
    current: {type: String, default: null},
    counts: {type: Object, default: () => ({})},
});
defineEmits(["pick"]);
</script>

<template>
    <nav class="phone-bar" aria-label="Windows">
        <template v-for="window in windows" :key="window.name">
            <button
                type="button"
                class="phone-bar-button"
                :data-phone-window="window.name"
                :aria-current="window.name === current ? 'page' : undefined"
                @click="$emit('pick', window.name)"
            >
                <MarkIcon :name="window.icon || 'window'" />
                <span class="phone-bar-title">{{ window.title }}</span>
                <template v-if="counts[window.name]">
                    <span class="phone-bar-count">{{ counts[window.name] }}</span>
                </template>
            </button>
        </template>
    </nav>
</template>

<style scoped>
.phone-bar {
    display: flex;
    gap: 2px;
    overflow-x: auto;
    padding: 6px 8px;
    border-top: 1px solid var(--line);
    background: var(--bg);
}

.phone-bar-button {
    display: flex;
    flex: 1 0 64px;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-height: 44px;
    padding: 4px;
    border: 0;
    border-radius: 6px;
    color: var(--text-3);
    background: transparent;
    font-size: 11px;
}

.phone-bar-button[aria-current="page"] {
    color: var(--text);
    background: var(--bg-2);
}

.phone-bar-title {
    white-space: nowrap;
}

.phone-bar-count {
    color: var(--accent);
    font-size: 10px;
}
</style>

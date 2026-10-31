<script setup>
import Icon from "../kit/Icon.vue";

defineProps({title: {type: String, required: true}, meta: {type: String, required: true}, drop: {type: Boolean, default: false}});
</script>

<template>
    <component :is="drop ? 'div' : 'label'" :class="drop ? 'dump-drop-lane' : 'dump-lane'">
        <Icon name="file" :size="20" />
        <span class="dump-lane-title">{{ title }}</span>
        <span class="dump-lane-meta">{{ meta }}</span>
        <slot />
    </component>
</template>

<style scoped>
.dump-lane,
.dump-drop-lane {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 118px;
    border: 1px dashed var(--border-3);
    border-radius: 12px;
    color: var(--text-3);
    cursor: pointer;
    transition:
        border-color 0.2s,
        background 0.2s;
}

.dump-lane:hover {
    border-color: var(--text-4);
    background: color-mix(in srgb, var(--text) 2%, transparent);
}

.dump-lane-title {
    font-size: 13px;
    color: var(--text-2);
}

.dump-lane-meta {
    font: 11px var(--mono);
    color: var(--text-4);
}

.dump-drop-lane {
    width: min(560px, 86%);
    height: 160px;
    border: 1.5px dashed var(--accent);
    background: color-mix(in srgb, var(--accent) 9%, transparent);
    color: var(--accent-text);
}

.dump-drop-lane .dump-lane-title {
    color: var(--text);
}

.dump-drop-lane .dump-lane-meta {
    color: var(--accent-text);
}
</style>

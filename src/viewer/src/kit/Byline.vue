<script setup>
import Icon from "./Icon.vue";

defineProps({side: {type: String, default: ""}, name: {type: String, required: true}, when: {type: String, default: ""}, small: Boolean});
</script>

<template>
    <header class="byline">
        <span :class="['mark', side, {small}]">
            <template v-if="side === 'agent'">
                <Icon name="agents" :size="small ? 9 : 11" />
            </template>
            <template v-else>{{ name.slice(0, 1) }}</template>
        </span>
        <span class="name">{{ name }}</span>
        <span class="when">{{ when }}</span>
        <slot />
    </header>
</template>

<style scoped>
.byline {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
    font-size: 12px;
}

.mark {
    flex: none;
    display: inline-grid;
    place-items: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--accent) 22%, transparent);
    color: var(--accent-text);
    font-size: 10.5px;
    font-weight: 600;
}

.mark.agent {
    background: var(--hover);
    color: var(--text-2);
}

.mark.small {
    width: 16px;
    height: 16px;
    font-size: 9px;
}

.name {
    color: var(--text);
    font-weight: 500;
}

.when {
    color: var(--text-4);
    font-size: 11.5px;
}
</style>

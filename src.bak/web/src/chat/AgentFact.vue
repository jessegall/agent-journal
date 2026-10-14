<script setup>
import Icon from "../kit/Icon.vue";

defineProps({icon: {type: String, required: true}, tag: {type: String, default: "button"}});
</script>

<template>
    <component :is="tag" :type="tag === 'button' ? 'button' : undefined">
        <Icon :name="icon" />
        <slot />
    </component>
</template>

<style scoped>
.agent-fact,
.agent-fact-lead {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
}

.agent-fact .ico,
.agent-fact-lead .ico,
.agent-fact :slotted(.ico),
.agent-fact-lead :slotted(.ico) {
    width: 12px;
    height: 12px;
    opacity: 0.65;
}

.agent-fact-lead {
    padding: 2px 6px;
    margin: 0 -6px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
}

.agent-fact-lead:hover {
    background: var(--hover);
    color: var(--text);
}

.agent-count {
    padding: 0 4px;
    margin: 0 -4px;
    line-height: inherit;
    border: 0;
    border-radius: 6px;
    background: none;
    color: inherit;
    cursor: pointer;
}

.agent-count:hover,
.agent-count.open {
    background: var(--hover);
    color: var(--text);
}

.agent-count:hover .ico,
.agent-count.open .ico,
.agent-count:hover :slotted(.ico),
.agent-count.open :slotted(.ico) {
    opacity: 1;
}

.agent-count.none {
    color: var(--text-3);
}

.agent-fact.waiting {
    color: var(--progress);
}
</style>

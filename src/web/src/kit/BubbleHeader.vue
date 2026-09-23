<script setup>
import Icon from "./Icon.vue";

const props = defineProps({
    icon: {type: String, required: true},
    label: {type: String, required: true},
    tone: {type: String, default: "agent"},
    clickable: {type: Boolean, default: false},
});
const emit = defineEmits(["click"]);
</script>

<template>
    <component
        :is="props.clickable ? 'button' : 'div'"
        :type="props.clickable ? 'button' : undefined"
        :class="['bubble-header', props.tone, {clickable: props.clickable}]"
        @click.stop="props.clickable && emit('click')"
    >
        <Icon :name="props.icon" :size="12" />
        <span>{{ props.label }}</span>
    </component>
</template>

<style scoped>
.bubble-header {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 0 0 6px;
    margin: 0 0 6px;
    border: 0;
    border-bottom: 1px solid var(--border-2);
    background: none;
    font: inherit;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.bubble-header.clickable {
    border-bottom: 0;
    padding: 0;
    cursor: pointer;
}

.bubble-header.agent {
    color: var(--accent-text);
}

.bubble-header.blocking {
    color: var(--blocking);
}
</style>

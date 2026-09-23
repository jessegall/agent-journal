<script setup>
import Icon from "./Icon.vue";

defineProps({
    icon: {type: String, required: true},
    count: {type: [Number, String], default: ""},
    label: {type: String, default: ""},
    title: {type: String, default: ""},
    href: {type: String, default: ""},
    hot: Boolean,
});
</script>

<template>
    <component :is="href ? 'a' : 'span'" :href="href || undefined" :class="['icon-count', {hot, link: href}]" :title="title || undefined">
        <Icon :name="icon" :size="12" />
        <template v-if="count !== ''">
            <span class="icon-count-n">{{ count }}</span>
        </template>
        <template v-if="label">
            <span class="icon-count-label">{{ label }}</span>
        </template>
    </component>
</template>

<style scoped>
.icon-count {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-width: 0;
    color: var(--text-3);
    font-size: 12px;
    white-space: nowrap;
}

.icon-count.hot {
    color: var(--tone-warn);
}

.icon-count.link:hover {
    color: var(--text);
}

.icon-count-n {
    font-variant-numeric: tabular-nums;
    font-weight: 500;
}

.icon-count-label {
    overflow: hidden;
    color: var(--text-2);
    text-overflow: ellipsis;
}

.icon-count.link:hover .icon-count-label {
    color: var(--text);
}
</style>

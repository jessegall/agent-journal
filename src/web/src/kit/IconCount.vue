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
    white-space: nowrap;
}

.icon-count .ico {
    opacity: 0.65;
}

.icon-count-n {
    font-variant-numeric: tabular-nums;
}

.icon-count.hot .icon-count-n {
    color: var(--accent-text);
    font-weight: 500;
}

.icon-count-label {
    overflow: hidden;
    text-overflow: ellipsis;
}

.icon-count.link:hover,
.icon-count.link:hover .icon-count-label {
    color: var(--text);
}

.icon-count.link:hover .ico {
    opacity: 1;
}
</style>

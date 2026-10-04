<script setup>
import Icon from "./Icon.vue";

defineProps({
    tone: {type: String, default: "muted"},
    icon: {type: String, default: ""},
});
</script>

<template>
    <p class="notice" :class="`notice-${tone}`">
        <template v-if="icon">
            <Icon :name="icon" :size="18" />
        </template>
        <slot />
    </p>
</template>

<style scoped>
.notice {
    margin: 0;
}

.notice-muted {
    color: var(--text-2);
}

.notice-good {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 50px;
    padding: 0 16px;
    border-radius: 12px;
    background: color-mix(in oklab, var(--tone-good) 16%, transparent);
    color: var(--text);
    font-weight: 600;
}

.notice-good :deep(.ico) {
    color: var(--tone-good);
}
</style>

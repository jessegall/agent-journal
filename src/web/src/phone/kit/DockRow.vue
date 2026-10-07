<script setup>
import Icon from "../../kit/Icon.vue";

defineProps({
    title: {type: String, required: true},
    label: {type: String, default: ""},
    tone: {type: String, default: "plain"},
    spoken: {type: String, default: ""},
    closeLabel: {type: String, default: ""},
});
const emit = defineEmits(["open", "close"]);
</script>

<template>
    <div :class="['notice', tone]">
        <button type="button" class="notice-open" :aria-label="spoken || title" @click="emit('open')">
            <span class="notice-mark" aria-hidden="true" />
            <span class="notice-title">{{ title }}</span>
            <template v-if="label">
                <span class="notice-label">{{ label }}</span>
            </template>
        </button>
        <template v-if="closeLabel">
            <button type="button" class="notice-close" :aria-label="closeLabel" @click="emit('close')">
                <Icon name="close" :size="14" />
            </button>
        </template>
    </div>
</template>

<style scoped>
.notice {
    display: flex;
    align-items: center;
    min-height: 44px;
    border: 1px solid var(--border-2);
    border-radius: 14px;
    background: var(--raised);
}

.notice-open {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 10px;
    min-width: 0;
    min-height: 44px;
    padding: 0 4px 0 14px;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 0.882rem;
    text-align: left;
}

.notice-mark {
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
}

.good .notice-mark {
    background: var(--tone-good);
}

.warn .notice-mark {
    background: var(--tone-warn);
}

.danger .notice-mark {
    background: var(--danger);
}

.notice-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.notice-label {
    flex: none;
    color: var(--accent-text);
    font-weight: 600;
}

.notice-close {
    display: flex;
    flex: none;
    margin-left: 10px;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-2);
}
</style>

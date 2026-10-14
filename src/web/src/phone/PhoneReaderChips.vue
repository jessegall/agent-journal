<script setup>
defineProps({options: {type: Array, required: true}});
const emit = defineEmits(["pick"]);
</script>

<template>
    <div class="reader-changes">
        <template v-for="option in options" :key="option.key">
            <button type="button" :class="['reader-change', {on: option.on}]" @click="emit('pick', option.key)">{{ option.label }}</button>
        </template>
    </div>
</template>

<style scoped>
.reader-changes {
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
    max-width: none;
    margin: 0 calc(-1 * var(--side));
    padding: 0 var(--side);
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
}

.reader-changes::-webkit-scrollbar {
    display: none;
}

.reader-change.on {
    background: var(--accent-dim);
    color: var(--text);
}

.reader-change {
    flex: none;
    min-height: 32px;
    padding: 0 14px;
    border: 0;
    border-radius: 16px;
    background: var(--hover);
    color: var(--text-2);
    font: inherit;
    white-space: nowrap;
    font-size: 0.794rem;
}
</style>

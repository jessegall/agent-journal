<script setup>
defineProps({name: {type: String, required: true}, state: {type: String, default: ""}, word: {type: String, default: ""}, closed: Boolean});
const emit = defineEmits(["open"]);
</script>

<template>
    <button type="button" :class="['holder', {closed}]" :title="`Open ${name}'s inspector`" @click="emit('open')">
        <template v-if="!closed">
            <span :class="['holder-dot', state]" />
        </template>
        <span class="holder-name">{{ name }}</span>
        <template v-if="word && !closed">
            <span class="holder-word">{{ word }}</span>
        </template>
    </button>
</template>

<style scoped>
.holder {
    flex: 0 1 auto;
    min-width: 0;
    max-width: 100%;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 1px 8px;
    border: 1px solid var(--border-2);
    border-radius: 999px;
    background: transparent;
    color: var(--text-2);
    font-size: 11px;
    cursor: pointer;
}

.holder:hover {
    color: var(--text);
    border-color: var(--text-3);
}

.holder-dot {
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-4);
}

.holder-dot.working,
.holder-dot.running {
    background: var(--progress);
}

.holder-dot.reported {
    background: var(--tone-good);
}

.holder-dot.needs {
    background: var(--tone-warn);
}

.holder-name {
    min-width: 0;
    overflow: hidden;
    color: var(--text);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.holder.closed .holder-name {
    color: var(--text-2);
}

.holder-word {
    flex: none;
    color: var(--text-3);
    white-space: nowrap;
}
</style>

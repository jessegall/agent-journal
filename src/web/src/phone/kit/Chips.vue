<script setup>
defineProps({options: {type: Array, required: true}, value: {type: String, default: ""}, label: {type: String, required: true}});
const emit = defineEmits(["pick"]);
</script>

<template>
    <div class="chips" role="tablist" :aria-label="label">
        <template v-for="option in options" :key="option.key">
            <button
                type="button"
                role="tab"
                :aria-selected="option.key === value"
                :class="['chip', {on: option.key === value}]"
                @click="emit('pick', option.key)"
            >
                {{ option.label }}
                <template v-if="option.count !== undefined">
                    <em class="chip-count">{{ option.count }}</em>
                </template>
            </button>
        </template>
    </div>
</template>

<style scoped>
.chips {
    display: flex;
    gap: 8px;
    margin: 4px calc(-1 * var(--side)) 8px;
    padding: 2px var(--side);
    overflow-x: auto;
    scrollbar-width: none;
}

.chips::-webkit-scrollbar {
    display: none;
}

.chip {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 6px;
    min-height: 36px;
    padding: 0 14px;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 0.875rem;
}

.chip.on {
    border-color: var(--accent);
    background: var(--accent);
    color: #fff;
}

.chip-count {
    color: inherit;
    font-style: normal;
    opacity: 0.7;
}
</style>

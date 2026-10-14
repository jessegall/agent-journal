<script setup>
defineProps({options: {type: Array, required: true}, value: {type: String, required: true}, label: {type: String, required: true}});
const emit = defineEmits(["pick"]);
</script>

<template>
    <div class="segment" role="tablist" :aria-label="label">
        <template v-for="option in options" :key="option.key">
            <button
                type="button"
                role="tab"
                :aria-selected="value === option.key"
                :class="{on: value === option.key}"
                @click="emit('pick', option.key)"
            >
                {{ option.label }}
            </button>
        </template>
    </div>
</template>

<style scoped>
.segment {
    display: flex;
    gap: 4px;
    margin-bottom: 12px;
    padding: 3px;
    border-radius: 10px;
    background: var(--raised);
}

.segment button {
    flex: 1;
    min-height: 38px;
    border: 0;
    border-radius: 8px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 0.875rem;
}

.segment button.on {
    background: var(--sel);
    color: var(--text);
    font-weight: 600;
}
</style>

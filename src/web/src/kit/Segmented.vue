<script setup>
defineProps({options: {type: Array, required: true}, value: {type: String, default: ""}});
const emit = defineEmits(["pick"]);
</script>

<template>
    <span class="segmented" role="radiogroup">
        <template v-for="o in options" :key="o.key">
            <button
                type="button"
                role="radio"
                :aria-checked="o.key === value"
                :class="['segmented-option', {on: o.key === value}]"
                @click="emit('pick', o.key)"
            >
                {{ o.label }}
            </button>
        </template>
    </span>
</template>

<style scoped>
.segmented {
    display: inline-flex;
    gap: 2px;
    padding: 2px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
}

.segmented-option {
    padding: 3px 10px;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.segmented-option:hover {
    color: var(--text);
}

.segmented-option.on {
    background: var(--sel);
    color: var(--text);
}
</style>

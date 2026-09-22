<script setup>
import Icon from "./Icon.vue";
import Spinner from "./Spinner.vue";

defineProps({
    choices: {type: Array, default: () => []},
    busy: {type: Function, default: () => false},
    disabled: {type: Boolean, default: false},
});
const emit = defineEmits(["pick"]);
</script>

<template>
    <div class="choices" role="listbox">
        <template v-for="choice in choices" :key="choice.value">
            <button
                type="button"
                role="option"
                :aria-selected="Boolean(choice.current)"
                :class="['choice', {current: choice.current}]"
                :disabled="disabled"
                @click="emit('pick', choice.value)"
            >
                <template v-if="busy(choice.value)">
                    <Spinner />
                </template>
                <template v-else-if="choice.current">
                    <Icon name="check" :size="11" />
                </template>
                {{ choice.label }}
            </button>
        </template>
    </div>
</template>

<style scoped>
.choices {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 2px 6px 5px;
}

.choice {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 11.5px;
    cursor: pointer;
}

.choice:hover:not(:disabled) {
    border-color: var(--border-2);
    background: var(--hover);
    color: var(--text);
}

.choice.current {
    border-color: color-mix(in srgb, var(--accent) 60%, transparent);
    background: var(--accent-dim);
    color: var(--text);
}

.choice:disabled {
    cursor: default;
}
</style>

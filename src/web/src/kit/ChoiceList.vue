<script setup>
import {computed} from "vue";
import Icon from "./Icon.vue";
import Spinner from "./Spinner.vue";

const props = defineProps({
    choices: {type: Array, default: () => []},
    busy: {type: Function, default: () => false},
    disabled: {type: Boolean, default: false},
    stacked: Boolean,
});
const emit = defineEmits(["pick"]);
const described = computed(() => props.stacked && props.choices.some((c) => c.hint));
</script>

<template>
    <div :class="['choices', {stacked, described}]" role="listbox">
        <template v-for="choice in choices" :key="choice.value">
            <button
                type="button"
                role="option"
                :aria-selected="Boolean(choice.current)"
                :class="['choice', {current: choice.current}]"
                :disabled="disabled || Boolean(choice.unavailable)"
                @click="emit('pick', choice.value)"
            >
                <template v-if="described">
                    <span class="choice-dot" />
                    <span class="choice-words">
                        <span class="choice-label">{{ choice.label }}</span>
                        <span class="choice-hint">{{ choice.unavailable || choice.hint }}</span>
                    </span>
                </template>
                <template v-else>
                    <template v-if="busy(choice.value)">
                        <Spinner />
                    </template>
                    <template v-else-if="choice.current">
                        <Icon name="check" :size="11" />
                    </template>
                    {{ choice.label }}
                </template>
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

.choices.stacked {
    flex-direction: column;
    padding: 0;
}

.choices.stacked .choice {
    padding: 7px 10px;
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

.choices.described {
    gap: 0;
    overflow: hidden;
    border: 1px solid var(--border-2);
    border-radius: 8px;
}

.choices.described .choice {
    align-items: flex-start;
    gap: 10px;
    padding: 9px 12px;
    border: 0;
    border-top: 1px solid var(--line);
    border-radius: 0;
    color: var(--text);
    font-size: 13px;
    text-align: left;
}

.choices.described .choice:first-child {
    border-top: 0;
}

.choices.described .choice.current {
    background: var(--accent-dim);
    box-shadow: inset 3px 0 0 var(--accent);
}

.choices.described .choice:disabled {
    opacity: 0.5;
}

.choice-dot {
    position: relative;
    flex: none;
    width: 14px;
    height: 14px;
    margin-top: 2px;
    border: 1.5px solid var(--border-3);
    border-radius: 50%;
}

.current .choice-dot {
    border-color: var(--accent-text);
}

.current .choice-dot::after {
    content: "";
    position: absolute;
    inset: 2.5px;
    border-radius: 50%;
    background: var(--accent-text);
}

.choice-words {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.current .choice-label {
    font-weight: 500;
}

.choice-hint {
    color: var(--text-3);
    font-size: 12px;
}
</style>

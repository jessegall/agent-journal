<script setup>
import {computed} from "vue";
import {DOES, doesOf, sentence} from "./triggerWords.js";
import WatchedWords from "./WatchedWords.vue";

const props = defineProps({trigger: {type: Object, required: true}});
const emit = defineEmits(["change"]);
const does = computed(() => doesOf(props.trigger.action));
const scheduled = computed(() => Boolean(props.trigger.next_at));
</script>

<template>
    <div class="trigger-editor">
        <template v-if="!scheduled">
            <div class="summary">
                <span class="summary-label">What it does</span>
                <p class="summary-text">{{ sentence(trigger) }}</p>
            </div>
            <div class="field">
                <span class="field-label">When these words appear</span>
                <WatchedWords :words="trigger.phrases" @words="emit('change', {phrases: $event})" />
            </div>
            <div class="field">
                <span class="field-label">What this trigger does</span>
                <div class="choices">
                    <template v-for="option in DOES" :key="option.value">
                        <button type="button" :class="['choice', {chosen: option.value === trigger.action}]" :data-action="option.value" @click="emit('change', {action: option.value})">
                            <span class="choice-label">{{ option.label }}</span>
                            <span class="choice-hint">{{ option.hint }}</span>
                        </button>
                    </template>
                </div>
            </div>
        </template>
        <label class="field">
            <span class="field-label">{{ scheduled ? "What to tell the agent" : does.ask }}</span>
            <textarea :value="trigger.text" rows="3" :placeholder="does.example" data-trigger-text @change="emit('change', {text: $event.target.value})" />
        </label>
    </div>
</template>

<style scoped>
.trigger-editor {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.summary {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px 14px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
}

.summary-label,
.field-label {
    color: var(--text-3);
    font-size: 12px;
}

.summary-text {
    margin: 0;
    font-size: 14px;
    line-height: 1.55;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.choices {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.choice {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: none;
    color: inherit;
    text-align: left;
    cursor: pointer;
}

.choice.chosen {
    border-color: var(--accent);
    background: var(--accent-dim);
}

.choice-label {
    font-size: 13px;
    font-weight: 500;
}

.choice-hint {
    color: var(--text-3);
    font-size: 12px;
}

textarea {
    box-sizing: border-box;
    width: 100%;
    padding: 7px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 13px;
    resize: vertical;
}
</style>

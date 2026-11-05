<script setup>
import {Btn, Icon} from "@journal/window-kit";

const props = defineProps({steps: {type: Array, required: true}});
const emit = defineEmits(["steps"]);

function changed(at, text) {
    emit("steps", props.steps.map((step, index) => (index === at ? text : step)));
}

function moved(at, by) {
    const steps = [...props.steps];
    const [step] = steps.splice(at, 1);
    steps.splice(at + by, 0, step);
    emit("steps", steps);
}

const removed = (at) => emit("steps", props.steps.filter((_, index) => index !== at));
</script>

<template>
    <ol class="step-cards">
        <template v-for="(step, index) in steps" :key="index">
            <li class="step-card">
                <span class="step-number">{{ index + 1 }}</span>
                <textarea :value="step" rows="2" :aria-label="`Step ${index + 1}`" placeholder="What the agent does in this step" data-step-text @input="changed(index, $event.target.value)" />
                <div class="step-moves">
                    <Btn small :disabled="index === 0" :aria-label="`Move step ${index + 1} up`" data-step-up @click="moved(index, -1)"><Icon name="up" :size="12" /></Btn>
                    <Btn small :disabled="index === steps.length - 1" :aria-label="`Move step ${index + 1} down`" data-step-down @click="moved(index, 1)"><Icon name="down" :size="12" /></Btn>
                    <Btn small :disabled="steps.length === 1" :aria-label="`Remove step ${index + 1}`" data-step-remove @click="removed(index)"><Icon name="trash" :size="12" /></Btn>
                </div>
            </li>
        </template>
    </ol>
    <Btn small bordered data-step-add @click="emit('steps', [...steps, ''])">Add a step</Btn>
</template>

<style scoped>
.step-cards {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0 0 8px;
    padding: 0;
    list-style: none;
}

.step-card {
    display: flex;
    gap: 8px;
    align-items: flex-start;
}

.step-number {
    flex: none;
    width: 18px;
    padding-top: 8px;
    color: var(--text-3);
    font-size: 12px;
    text-align: right;
    font-variant-numeric: tabular-nums;
}

.step-moves {
    display: flex;
    flex: none;
    gap: 2px;
}

textarea {
    flex: 1;
    box-sizing: border-box;
    min-width: 0;
    padding: 6px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 13px;
    resize: vertical;
}
</style>

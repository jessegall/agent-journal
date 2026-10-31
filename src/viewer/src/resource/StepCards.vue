<script setup>
import {nextTick, ref} from "vue";
import Icon from "../kit/Icon.vue";
import {blankStep, stepCard} from "../domain/sequenceSteps.js";

const props = defineProps({cards: {type: Array, required: true}});
const fields = ref([]);
let made = 1000;

async function add() {
    props.cards.push(stepCard(blankStep(), ++made));
    await nextTick();
    fields.value.at(-1)?.focus();
}

function move(i, by) {
    const [card] = props.cards.splice(i, 1);
    props.cards.splice(i + by, 0, card);
}
</script>

<template>
    <TransitionGroup tag="ol" name="step" class="editor">
        <template v-for="(s, i) in cards" :key="s.key">
            <li class="step-card">
                <div class="step-row">
                    <span class="node">{{ i + 1 }}</span>
                    <span class="grow" />
                    <span class="step-tools">
                        <button type="button" class="step-tool" title="Move up" :disabled="i === 0" @click="move(i, -1)">
                            <Icon name="up" :size="12" />
                        </button>
                        <button type="button" class="step-tool" title="Move down" :disabled="i === cards.length - 1" @click="move(i, 1)">
                            <Icon name="down" :size="12" />
                        </button>
                        <button type="button" class="step-tool" aria-label="Remove this step" @click="cards.splice(i, 1)">
                            <Icon name="close" :size="12" />
                        </button>
                    </span>
                </div>
                <input v-model="s.title" class="step-title-input" placeholder="Title of this step" />
                <textarea ref="fields" v-model="s.instructions" rows="3" placeholder="What to do in this step. Markdown works here." />
                <div class="guard-row">
                    <button
                        type="button"
                        :class="['edits-switch', {held: !s.file_edits_allowed}]"
                        :aria-pressed="!s.file_edits_allowed"
                        @click="s.file_edits_allowed = !s.file_edits_allowed"
                    >
                        {{ s.file_edits_allowed ? "File edits allowed" : "File edits wait" }}
                    </button>
                    <input v-model="s.commands" class="commands-input" placeholder="Commands it lets through, such as git status, comma separated" />
                </div>
            </li>
        </template>
    </TransitionGroup>
    <button type="button" class="add-step" @click="add">
        <Icon name="plus" :size="12" />
        Add a step
    </button>
</template>

<style scoped>
.editor {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.step-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 10px 10px 12px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
}

.step-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.grow {
    flex: 1;
}

.node {
    flex: none;
    display: inline-grid;
    place-items: center;
    width: 24px;
    height: 24px;
    box-sizing: border-box;
    border: 1px solid var(--border-2);
    border-radius: 50%;
    background: var(--bg);
    color: var(--text-2);
    font-size: 11.5px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

.step-title-input,
.commands-input {
    flex: 1;
    min-width: 0;
    box-sizing: border-box;
    padding: 6px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 13px;
}

.step-title-input {
    font-weight: 600;
}

.guard-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.edits-switch {
    padding: 5px 10px;
    border: 1px solid var(--border-2);
    border-radius: 99px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.edits-switch.held {
    border-color: var(--tone-warn);
    color: var(--tone-warn);
}

.step-tools {
    display: flex;
    gap: 2px;
}

.step-tool {
    display: inline-grid;
    place-items: center;
    width: 26px;
    height: 26px;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.step-tool:hover:enabled {
    background: var(--hover);
    color: var(--text);
}

.step-tool:disabled {
    opacity: 0.35;
    cursor: default;
}

textarea {
    width: 100%;
    box-sizing: border-box;
    min-height: 76px;
    padding: 8px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 13px;
    line-height: 1.5;
    resize: vertical;
}

textarea:focus {
    border-color: var(--accent);
    outline: none;
}

.add-step {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    margin-top: 10px;
    padding: 9px;
    border: 1px dashed var(--border-2);
    border-radius: 10px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12.5px;
    cursor: pointer;
}

.add-step:hover {
    border-color: var(--accent);
    color: var(--accent-text);
}

.step-move {
    transition: transform 0.2s var(--ease, ease);
}

.step-enter-active,
.step-leave-active {
    transition:
        opacity 0.18s ease,
        transform 0.18s ease;
}

.step-enter-from,
.step-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>

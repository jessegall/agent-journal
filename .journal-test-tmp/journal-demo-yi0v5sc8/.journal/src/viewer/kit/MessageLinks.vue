<script setup>
import {computed, inject, ref} from "vue";
import {WINDOW_CONTEXT} from "./windowContextKey.js";
import FoldSign from "../src/kit/FoldSign.vue";
import MarkIcon from "../src/kit/MarkIcon.vue";
import TextDisplay from "../src/kit/TextDisplay.vue";
import {useOutside} from "../src/composables/outside.js";
import {tableOfWord} from "../src/domain/tables.js";
import {peekRef} from "../src/route.js";

// The quiet line under a person's message naming the rows linked to it, as version 4 drew it: up to three as chips,
// and from four (three on a phone) a count that opens a list of them in place
const props = defineProps({links: {type: Array, required: true}});
const CHIPS_UP_TO = 3;
const TASK = "task";
const context = inject(WINDOW_CONTEXT, null);
const count = computed(() => props.links.length);
const noun = computed(() => (props.links.every((link) => link.model === TASK) ? "tasks" : "items"));
const chipsLine = computed(() => `Linked: ${props.links.map((link) => `${link.model} ${link.id}`).join(" ")}`);
const open = ref(false);
const titles = ref({});
const line = ref(null);
useOutside(line, () => (open.value = false));

async function readTitles() {
    const tasks = props.links.filter((link) => link.model === TASK && !(link.id in titles.value));
    const answers = await Promise.all(tasks.map((link) => context.read(`task show ${link.id}`)));
    titles.value = {...titles.value, ...Object.fromEntries(answers.filter((answer) => answer.ok).map((answer) => [answer.value.id, answer.value.title]))};
}

function toggle() {
    open.value = !open.value;
    if (open.value) readTitles();
}

function go(link) {
    open.value = false;
    peekRef(`${tableOfWord(link.model)}:${link.id}`);
}
</script>

<template>
    <div ref="line" :class="['message-links', {many: count > CHIPS_UP_TO, three: count === CHIPS_UP_TO, open}]" data-message-links>
        <MarkIcon class="message-links-icon" name="linked" />
        <span class="message-links-few" data-message-links-rows><TextDisplay :text="chipsLine" inline /></span>
        <template v-if="count >= CHIPS_UP_TO">
            <span class="message-links-many">
                <button type="button" class="message-links-count" data-message-links-count :aria-expanded="open" @click="toggle">
                    {{ count }} linked {{ noun }}
                    <FoldSign :open="open" />
                </button>
            </span>
        </template>
        <template v-if="open">
            <div class="message-links-list" data-message-links-list aria-label="Items linked to this message">
                <template v-for="link in links" :key="`${link.model}:${link.id}`">
                    <button type="button" class="message-links-row" @click="go(link)">
                        <span class="row-pill message-links-chip">{{ link.model }} {{ link.id }}</span>
                        <span class="message-links-title">{{ titles[link.id] }}</span>
                    </button>
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.message-links {
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;
    padding: 2px 6px;
    color: var(--text-3);
    font-size: 11.5px;
    line-height: 1.45;
}

.message-links :deep(p) {
    margin: 0;
}

.message-links-icon {
    color: var(--group-work);
}

.message-links-many {
    display: none;
}

.message-links.many .message-links-few {
    display: none;
}

.message-links.many .message-links-many {
    display: inline;
}

:global(html.phone .message-links.three .message-links-few) {
    display: none;
}

:global(html.phone .message-links.three .message-links-many) {
    display: inline;
}

@media (max-width: 640px) {
    .message-links.three .message-links-few {
        display: none;
    }

    .message-links.three .message-links-many {
        display: inline;
    }
}

.message-links-count {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0.05em 0.35em 0.05em 0.45em;
    border: 0;
    border-radius: 4px;
    background: var(--chip);
    color: var(--text-2);
    font: inherit;
    font-size: 0.93em;
    line-height: 1.35;
    vertical-align: baseline;
    cursor: pointer;
}

.message-links-count:hover,
.message-links.open .message-links-count {
    color: var(--text);
}

.message-links-count:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--accent-text) 70%, transparent);
    outline-offset: 1px;
}

.message-links-count .fold {
    width: 9px;
    height: 9px;
    margin-left: 0;
}

.message-links-count .fold :deep(svg) {
    width: 9px;
    height: 9px;
}

.message-links-list {
    flex-basis: 100%;
    width: 100%;
    padding: 4px 0 2px;
    text-align: left;
    white-space: normal;
}

.message-links-row {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 4px 6px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    text-align: left;
    cursor: pointer;
}

.message-links-row:hover {
    background: var(--hover);
    color: var(--text-2);
}

.message-links-chip {
    flex: none;
}

.message-links-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

:global(html.phone .message-links .message-links-row) {
    min-height: 40px;
}
</style>

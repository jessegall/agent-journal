<script setup>
import {computed, ref} from "vue";
import FoldSign from "../kit/FoldSign.vue";
import MarkIcon from "../kit/MarkIcon.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {useTurnLinks} from "./turnLinks.js";
import {useOutside} from "../composables/outside.js";
import {partLabel, receiptCount, receiptLine, receiptParts, receiptWords} from "../domain/receipt.js";

// The quiet line under the user's message naming the tasks linked to it: up to three as chips, and from four
// (three on a phone) a count that opens a list of them in place
const props = defineProps({receipt: {type: String, required: true}});
const CHIPS_UP_TO = 3;
const {scope, openRef} = useTurnLinks();
const parts = computed(() => receiptParts(props.receipt));
const count = computed(() => receiptCount(parts.value));
const listed = computed(() => count.value >= CHIPS_UP_TO);
const open = ref(false);
const line = ref(null);
useOutside(line, () => (open.value = false));
const titleOf = (row) => (scope.rows(row.table) || []).find((r) => r.id === row.id)?.title || "";

function go(row) {
    open.value = false;
    openRef(`${row.table}:${row.id}`);
}
</script>

<template>
    <div ref="line" :class="['task-line', {many: count > CHIPS_UP_TO, three: count === CHIPS_UP_TO, open}]">
        <MarkIcon class="task-line-icon" name="linked" />
        <template v-if="parts.length">
            <TextDisplay class="task-line-few" :text="receiptLine(parts)" inline />
        </template>
        <template v-else>
            <TextDisplay :text="receipt" inline />
        </template>
        <template v-if="listed">
            <span class="task-line-many">
                <button type="button" class="task-line-count" :aria-expanded="open" @click="open = !open">
                    {{ receiptWords(parts) }}
                    <FoldSign :open="open" />
                </button>
            </span>
        </template>
        <template v-if="open">
            <div class="task-line-list" aria-label="Tasks from your message">
                <template v-for="part in parts" :key="part.verb">
                    <div class="task-line-part">
                        <p class="task-line-label">{{ partLabel(part) }}</p>
                        <template v-for="row in part.rows" :key="row.named">
                            <button type="button" class="task-line-row" @click="go(row)">
                                <span class="row-pill task-line-chip">{{ row.named }}</span>
                                <span class="task-line-title">{{ titleOf(row) }}</span>
                            </button>
                        </template>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.task-line {
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 7px;
    padding: 2px 6px;
    color: var(--text-3);
    font-size: 11.5px;
    line-height: 1.45;
}

.task-line-icon {
    color: var(--group-work);
}

/* up to three tasks are chips; from four, three on a phone, a count stands in their place */
.task-line-many {
    display: none;
}

.task-line.many .task-line-few {
    display: none;
}

.task-line.many .task-line-many {
    display: inline;
}

:global(html.phone .task-line.three .task-line-few) {
    display: none;
}

:global(html.phone .task-line.three .task-line-many) {
    display: inline;
}

@media (max-width: 640px) {
    .task-line.three .task-line-few {
        display: none;
    }

    .task-line.three .task-line-many {
        display: inline;
    }
}

.task-line-count {
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

.task-line-count:hover,
.task-line.open .task-line-count {
    color: var(--text);
}

.task-line-count:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--accent-text) 70%, transparent);
    outline-offset: 1px;
}

.task-line-count .fold {
    width: 9px;
    height: 9px;
    margin-left: 0;
}

.task-line-count .fold :deep(svg) {
    width: 9px;
    height: 9px;
}

/* the list the count opens, in place under the line, pushing the chat down */
.task-line-list {
    flex-basis: 100%;
    width: 100%;
    padding: 4px 0 2px;
    text-align: left;
    white-space: normal;
    animation: list-in 0.16s var(--ease);
}

@keyframes list-in {
    from {
        opacity: 0;
        transform: translateY(-3px);
    }
}

.task-line-part + .task-line-part {
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid var(--border);
}

.task-line-label {
    margin: 0;
    padding: 0 6px 3px;
    color: var(--text-4);
    font-size: 10.5px;
}

.task-line-row {
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

.task-line-row:hover {
    background: var(--hover);
    color: var(--text-2);
}

.task-line-chip {
    flex: none;
}

.task-line-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

:global(html.phone .task-line .task-line-row) {
    min-height: 40px;
}

@media (prefers-reduced-motion: reduce) {
    .task-line-list {
        animation: none;
    }
}
</style>

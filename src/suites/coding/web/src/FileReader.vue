<script setup>
import {computed} from "vue";
import {CommentCard} from "@journal/window-kit";
import {tint} from "./codeTint.js";

// a file's text as code: the colour of what it says and a number on each line; a click on a number picks the line and Shift and a click stretches the pick to a range.
// A file shown cut and a moved file say so above the code.
const props = defineProps({file: {type: Object, required: true}, target: {type: Number, default: 0}, selection: {type: Object, default: null}, comments: {type: Array, default: () => []}, hot: {type: Number, default: 0}});
const emit = defineEmits(["pick", "show"]);
const lines = computed(() => props.file.text.split("\n"));
// a comment's thread stands under the last line of its range
const endingAt = (number) => props.comments.filter((comment) => comment.to === number);
const noted = (number) => props.comments.some((comment) => comment.from != null && number >= comment.from && number <= comment.to);
const picked = (number) => Boolean(props.selection) && number >= props.selection.from && number <= props.selection.to;

function scrolledTo(element, number) {
    if (element && number === props.target) element.scrollIntoView?.({block: "center"});
}
</script>

<template>
    <div class="file-reader" data-file-reader>
        <template v-if="file.cut">
            <p class="reader-notice warn" role="note" data-big-file>This file is long, so only its start is shown. Open it in an editor to read all of it.</p>
        </template>
        <template v-if="file.moved_from">
            <p class="reader-notice" role="note" data-moved-file>Moved from <span class="reader-mono">{{ file.moved_from }}</span></p>
        </template>
        <div class="code" data-file-text>
            <template v-for="(line, index) in lines" :key="index">
                <div :ref="(element) => scrolledTo(element, index + 1)" :class="['files-line', {target: index + 1 === target, picked: picked(index + 1), noted: noted(index + 1)}]" :data-file-line="index + 1">
                    <span class="files-number" role="button" :aria-label="`Pick line ${index + 1}`" data-line-number @click="emit('pick', index + 1, $event.shiftKey)">{{ index + 1 }}</span>
                    <span class="files-code" v-html="tint(line) || ' '" />
                </div>
                <template v-for="comment in endingAt(index + 1)" :key="comment.id">
                    <div class="files-thread" data-comment-thread>
                        <CommentCard :comment="{...comment, quote: null}" :hot="hot === comment.id" @show="emit('show', comment.id)" />
                    </div>
                </template>
            </template>
        </div>
    </div>
</template>

<style scoped>
.file-reader {
    flex: 1;
    min-width: 0;
    padding: 8px 0 14px;
    overflow: auto;
}

.reader-notice {
    margin: 0 16px 8px;
    padding: 6px 10px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    color: var(--text-2);
    font-size: 12.5px;
}

.reader-notice.warn {
    border-color: var(--warn);
}

.reader-mono {
    font-family: var(--mono, monospace);
}

.code {
    font-family: var(--mono, monospace);
    font-size: 12.5px;
    line-height: 1.5;
}

.files-line {
    display: flex;
    white-space: pre;
}

.files-line.target {
    background: var(--hover);
}

.files-line.noted .files-number {
    color: var(--accent-text);
}

.files-thread {
    max-width: 640px;
    margin: 4px 16px 8px 56px;
    white-space: normal;
}

.files-line.picked {
    background: color-mix(in srgb, var(--accent) 14%, transparent);
}

.files-number {
    flex: none;
    width: 44px;
    margin-right: 12px;
    color: var(--text-3);
    text-align: right;
    cursor: pointer;
    user-select: none;
}

.files-number:hover {
    color: var(--text);
}

.files-code :deep(.tk-c) {
    color: var(--text-4);
}

.files-code :deep(.tk-s) {
    color: var(--good);
}

.files-code :deep(.tk-k) {
    color: var(--accent-text);
}

.files-code :deep(.tk-f) {
    color: var(--warn);
}
</style>

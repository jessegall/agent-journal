<script setup>
import {computed} from "vue";
import {Icon, useWindow, vContext} from "@journal/window-kit";
import {rowItems} from "./fileMenus.js";
import {GIT_WORDS} from "./gitWords.js";

// one row of the project tree and, under an open folder, its own rows: a folder shows a chevron and its name, a file its name,
// the number of comments on it when it has some, and its git letter
const props = defineProps({row: {type: Object, required: true}, depth: {type: Number, default: 0}, browser: {type: Object, required: true}});
const view = useWindow();
// the menu of a right click on the row; Show changes in Git opens the Git page of this environment
const gitAddress = () => `${location.pathname}?${new URLSearchParams({environment: view.environment, page: "coding.git"})}`;
const place = () => ({head: props.row.id, items: rowItems(props.browser, props.row, gitAddress)});
const flashing = computed(() => props.browser.flash.value === props.row.id);
const isOpen = computed(() => props.browser.opened.value.has(props.row.id));
const children = computed(() => (isOpen.value ? props.browser.rowsOf(props.row.id) : null));
const failure = computed(() => (isOpen.value ? props.browser.failureOf(props.row.id) : ""));
const current = computed(() => props.browser.current.value === props.row.id);
const pad = computed(() => ({paddingLeft: `${8 + props.depth * 14}px`}));
const commentWords = computed(() => `${props.row.comments} comment${props.row.comments === 1 ? "" : "s"}`);
</script>

<template>
    <template v-if="row.folder">
        <button v-context="place" type="button" class="tree-row" :style="pad" :aria-expanded="isOpen" :data-folder="row.id" @click="browser.toggle(row.id)">
            <Icon name="chevronRight" :facing="isOpen ? 'down' : 'right'" :size="9" />
            <span class="tree-name">{{ row.name }}</span>
        </button>
        <template v-if="isOpen">
            <template v-if="failure">
                <p class="tree-note" role="alert" :style="pad">{{ failure }}</p>
            </template>
            <template v-else-if="children === null">
                <p class="tree-note" :style="pad">Reading the folder</p>
            </template>
            <template v-for="child in children ?? []" :key="child.id">
                <FileTreeNode :row="child" :depth="depth + 1" :browser="browser" />
            </template>
        </template>
    </template>
    <template v-else>
        <button v-context="place" type="button" :class="['tree-row', {on: current, flash: flashing}]" :style="pad" :aria-current="current" :title="row.id" :data-file="row.id" @click="browser.open(row.id)">
            <span class="tree-gap" aria-hidden="true" />
            <span class="tree-name">{{ row.name }}</span>
            <template v-if="row.comments">
                <span class="tree-count" data-tree-comments :title="commentWords">{{ row.comments }}</span>
            </template>
            <span :class="['tree-git', `git-${row.git}`]" data-tree-git :title="GIT_WORDS[row.git]">{{ row.git }}</span>
        </button>
    </template>
</template>

<style scoped>
.tree-row {
    display: flex;
    gap: 6px;
    align-items: center;
    width: 100%;
    height: 24px;
    padding-right: 10px;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    white-space: nowrap;
    cursor: pointer;
}

.tree-row:hover {
    background: var(--hover);
}

.tree-row.flash {
    background: color-mix(in srgb, var(--accent) 30%, transparent);
}

.tree-row.on {
    background: var(--sel);
    color: var(--text);
}

.tree-name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
}

.tree-gap {
    flex: none;
    width: 9px;
}

.tree-count {
    color: var(--text-3);
    font-size: 11px;
}

.tree-git {
    min-width: 1ch;
    font: 10px var(--mono, monospace);
}

.git-M {
    color: var(--warn);
}

.git-A {
    color: var(--good);
}

.git-D {
    color: var(--danger);
}

.tree-note {
    margin: 0;
    padding: 2px 8px;
    color: var(--text-3);
    font-size: 12px;
}
</style>

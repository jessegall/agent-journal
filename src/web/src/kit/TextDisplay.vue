<script setup>
import {computed} from "vue";
import {render} from "../text/index.js";
import {peekChip, route} from "../route.js";
import {types} from "../state/store.js";
import "../text/all.js";

const props = defineProps({text: {type: String, default: ""}, inline: {type: Boolean, default: false}});
const html = computed(() => {
    const said = props.inline
        ? String(props.text || "")
              .split("\n")
              .find((line) => line.trim()) || ""
        : props.text;
    const made = render(said, {types: types.value, env: route.value.env});
    return props.inline ? made.replace(/^<p>|<\/p>\s*$/g, "") : made;
});
</script>

<template>
    <template v-if="inline">
        <span class="md inline" @click="peekChip" v-html="html" />
    </template>
    <template v-else>
        <div class="md" @click="peekChip" v-html="html" />
    </template>
</template>

<style scoped>
.md {
    color: var(--text-2);
    line-height: 1.55;
}

.md :deep(p) {
    margin: 0 0 10px;
}

.md :deep(h3),
.md :deep(h4),
.md :deep(h5),
.md :deep(h6) {
    margin: 16px 0 6px;
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text);
}

.md :deep(ul),
.md :deep(ol) {
    margin: 0 0 10px;
    padding-left: 22px;
}

.md :deep(li) {
    margin: 2px 0;
}

.md :deep(code) {
    padding: 1px 5px;
    border-radius: 4px;
    background: var(--raised);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 0.92em;
}

.md :deep(:not(pre) > code) {
    white-space: nowrap;
}

.md :deep(pre) {
    margin: 0 0 10px;
    padding: 10px 12px;
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--code-bg);
}

.md :deep(pre code) {
    padding: 0;
    background: none;
}

.md :deep(table) {
    width: 100%;
    margin: 0 0 12px;
    border-collapse: collapse;
    font-size: 12.5px;
}

.md :deep(th),
.md :deep(td) {
    padding: 5px 8px;
    border: 1px solid var(--border);
    text-align: left;
    vertical-align: top;
}

.md :deep(th) {
    color: var(--text);
    background: var(--raised);
    font-weight: 600;
}

.md :deep(blockquote) {
    margin: 0 0 10px;
    padding: 2px 12px;
    border-left: 2px solid var(--border-2);
    color: var(--text-3);
}

.md :deep(hr) {
    margin: 14px 0;
    border: none;
    border-top: 1px solid var(--border);
}

.md :deep(a) {
    color: var(--accent-text);
}

.md :deep(.row-pill) {
    padding: 0 4px;
    border: 1px solid var(--border-2);
    border-radius: 5px;
    color: var(--text-2);
    text-decoration: none;
    white-space: nowrap;
}

.md :deep(.file-pill) {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 12px;
}

.md :deep(.file-pill .ico) {
    width: 11px;
    height: 11px;
}
</style>

<script setup>
import {computed} from "vue";
import FileName from "../kit/FileName.vue";
import Icon from "../kit/Icon.vue";
import PageThumb from "../kit/PageThumb.vue";
import FileTags from "./FileTags.vue";
import FileSource from "./FileSource.vue";
import {age} from "../format/time.js";

const props = defineProps({file: Object});
const KB = 1024;
const MB = KB * KB;
const size = computed(() => {
    const n = props.file.size;
    return n < KB ? `${n} B` : n < MB ? `${Math.round(n / KB)} KB` : `${(n / MB).toFixed(1)} MB`;
});
const extension = computed(() => {
    const dot = props.file.name.lastIndexOf(".");
    return dot > 0 ? props.file.name.slice(dot + 1) : "";
});
</script>

<template>
    <div class="file-row">
        <a class="file-row-thumb" :href="file.url" target="_blank" :title="`Open ${file.name}`">
            <PageThumb :lines="4" :label="extension" />
        </a>
        <span class="file-row-main">
            <a class="file-row-name" :href="file.url" target="_blank">
                <FileName :name="file.name" />
            </a>
            <FileTags class="file-row-about" :file="file" />
            <span class="file-row-facts">
                <FileSource :file="file" />
                <span class="file-row-dot" aria-hidden="true">·</span>
                <span class="file-row-size">{{ size }}</span>
            </span>
        </span>
        <span class="file-row-end">
            <span class="file-row-age">{{ age(file.at) }}</span>
            <a class="file-row-act" :href="file.url" target="_blank" :title="`Open ${file.name} in a new tab`">
                <Icon name="open" :size="13" />
            </a>
            <a class="file-row-act" :href="file.url" :download="file.name" :title="`Download ${file.name}`">
                <Icon name="download" :size="13" />
            </a>
        </span>
    </div>
</template>

<style scoped>
.file-row {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: start;
    gap: 14px;
    padding: 12px 14px;
    border: 1px solid transparent;
    border-radius: 10px;
    transition:
        background 0.15s,
        border-color 0.15s;
}

.file-row:hover {
    border-color: var(--border);
    background: var(--hover);
}

.file-row:hover :deep(.page-thumb-sheet) {
    stroke: var(--accent);
}

.file-row-thumb {
    display: block;
}

.file-row-main {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
}

.file-row-name {
    display: flex;
    min-width: 0;
    color: var(--text);
    font-size: 14px;
    font-weight: 550;
}

.file-row-name:hover {
    color: var(--accent-text);
}

.file-row-main .file-row-about {
    color: var(--text-3);
    font-size: 12.5px;
}

.file-row-facts {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    color: var(--text-4);
    font-size: 11.5px;
}

.file-row-size {
    flex: none;
}

.file-row-end {
    display: flex;
    align-items: center;
    gap: 2px;
}

.file-row-age {
    margin-right: 8px;
    color: var(--text-3);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
}

.file-row-act {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 7px;
    color: var(--text-3);
}

.file-row-act:hover {
    background: var(--sel);
    color: var(--text);
}
</style>

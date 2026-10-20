<script setup>
import EmptyState from "../kit/EmptyState.vue";
import Icon from "../kit/Icon.vue";
import FilePage from "./FilePage.vue";
import ProjectTree from "../resource/ProjectTree.vue";
import {computed, ref, watch} from "vue";
import {href, route} from "../route.js";
import {kept, remembered} from "../platform/storage.js";
import {closed, opened, shownAfterClosing, tabName} from "../domain/openFiles.js";

const path = computed(() => route.value.q || "");
const tabs = ref(remembered("files.tabs", []));
kept("files.tabs", tabs);

const show = (file) => (window.location.hash = href.page("files", 0, file).slice(1));

function close(file) {
    const next = shownAfterClosing(tabs.value, file, path.value);
    tabs.value = closed(tabs.value, file);
    if (next !== path.value) show(next);
}

watch(path, (file) => (tabs.value = opened(tabs.value, file)), {immediate: true});
</script>

<template>
    <section class="ide">
        <aside class="ide-tree">
            <h2 class="ide-heading">Files</h2>
            <ProjectTree :open="path" @pick="(entry) => show(entry.path)" />
        </aside>
        <div class="ide-main">
            <template v-if="tabs.length">
                <nav class="ide-tabs" aria-label="Open files">
                    <template v-for="file in tabs" :key="file">
                        <div :class="['ide-tab', {shown: file === path}]">
                            <a class="ide-tab-name" :href="href.page('files', 0, file)" :title="file">
                                <Icon name="file" :size="12" />
                                {{ tabName(file) }}
                            </a>
                            <button type="button" class="ide-tab-close" :title="`Close ${tabName(file)}`" @click="close(file)">
                                <Icon name="x" :size="11" />
                            </button>
                        </div>
                    </template>
                </nav>
            </template>
            <div class="ide-file">
                <template v-if="path">
                    <FilePage :key="path" />
                </template>
                <template v-else>
                    <EmptyState>Choose a file on the left to open it.</EmptyState>
                </template>
            </div>
        </div>
    </section>
</template>

<style scoped>
.ide {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    height: 100%;
    min-height: 0;
    border-top: 1px solid var(--border);
}

.ide-tree {
    overflow-y: auto;
    padding: 10px 6px 24px;
    border-right: 1px solid var(--border);
    background: var(--raised);
}

.ide-heading {
    margin: 0 0 6px;
    padding: 0 8px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.ide-main {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
}

.ide-tabs {
    display: flex;
    flex: none;
    overflow-x: auto;
    border-bottom: 1px solid var(--border);
    background: var(--raised);
}

.ide-tab {
    display: flex;
    flex: none;
    align-items: center;
    border-right: 1px solid var(--border);
    color: var(--text-2);
    font-size: 12.5px;
}

.ide-tab.shown {
    background: var(--bg);
    box-shadow: inset 0 2px 0 var(--accent);
    color: var(--text);
}

.ide-tab-name {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 4px 8px 12px;
    color: inherit;
    text-decoration: none;
}

.ide-tab-close {
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    margin-right: 6px;
    padding: 0;
    border: 0;
    border-radius: 4px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.ide-tab-close:hover {
    background: var(--hover);
    color: var(--text);
}

.ide-file {
    flex: 1;
    overflow: auto;
    min-height: 0;
}

.ide-file :deep(.filepage) {
    max-width: none;
    padding: 0 0 48px;
}

.ide-file :deep(.filepage .head) {
    padding: 8px 16px;
    border-bottom: 1px solid var(--border);
}

.ide-file :deep(.filepage .text) {
    margin: 0;
    border: 0;
    border-radius: 0;
}

@media (max-width: 760px) {
    .ide {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: auto minmax(0, 1fr);
    }

    .ide-tree {
        max-height: 40vh;
        border-right: 0;
        border-bottom: 1px solid var(--border);
    }
}
</style>

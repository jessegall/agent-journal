<script setup>
import {computed} from "vue";
import {Btn, Icon} from "@journal/window-kit";

// the bar over the file: back and forward, the one path of the file as crumbs, and the button that opens the search palette
const props = defineProps({browser: {type: Object, required: true}, project: {type: String, default: "Project"}});
const browser = props.browser;
const crumbs = computed(() => (browser.current.value ? browser.current.value.split("/") : []));
const pathTo = (at) => crumbs.value.slice(0, at + 1).join("/");
// a crumb opens its folder in the tree; the project crumb leaves the file
const showFolder = (at) => at < crumbs.value.length - 1 && browser.reveal(`${pathTo(at)}/x`);
</script>

<template>
    <div class="files-bar" data-files-bar>
        <Btn small title="Back ( [ )" aria-label="Back" data-files-back :disabled="!browser.history.back.length" @click="browser.back"><Icon name="back" :size="13" /></Btn>
        <Btn small title="Forward ( ] )" aria-label="Forward" data-files-forward :disabled="!browser.history.forward.length" @click="browser.forward"><Icon name="arrow" :size="13" /></Btn>
        <div class="files-path" data-files-path>
            <button type="button" data-files-root @click="browser.leaveFile">{{ project }}</button>
            <template v-for="(crumb, at) in crumbs" :key="at">
                <Icon name="chevronRight" :size="9" />
                <button type="button" :data-files-crumb="pathTo(at)" @click="showFolder(at)">{{ crumb }}</button>
            </template>
        </div>
        <button type="button" class="files-search" data-files-search-open @click="browser.openPalette('files')">
            <Icon name="search" :size="12" />
            <span class="files-search-words">Search</span>
            <kbd>T</kbd>
        </button>
    </div>
</template>

<style scoped>
.files-bar {
    display: flex;
    flex: none;
    gap: 6px;
    align-items: center;
    height: 40px;
    padding: 0 var(--s3) 0 var(--s2);
    border-bottom: 1px solid var(--border);
}

.files-path {
    display: flex;
    flex: 1;
    gap: 2px;
    align-items: center;
    min-width: 0;
    overflow: hidden;
    color: var(--text-3);
    font-size: 12px;
}

.files-path button {
    padding: 2px 5px;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text-3);
    font: inherit;
    white-space: nowrap;
    cursor: pointer;
}

.files-path button:hover {
    background: var(--hover);
    color: var(--text);
}

.files-path button:last-child {
    color: var(--text);
}

.files-search {
    display: flex;
    gap: 6px;
    align-items: center;
    width: 220px;
    height: 24px;
    padding: 0 8px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.files-search-words {
    flex: 1;
    text-align: left;
}

kbd {
    font: 11px var(--mono, monospace);
    color: var(--text-4);
}
</style>

<script setup>
import {computed, onMounted, ref} from "vue";
import {Icon, Segmented} from "@journal/window-kit";

// the one search palette: file names or text in files. Up and Down choose a hit, Enter opens it (at its line for a text hit), Escape closes the palette.
const props = defineProps({browser: {type: Object, required: true}});
const browser = props.browser;
const field = ref(null);
const MODES = [{key: "files", label: "Files"}, {key: "text", label: "Text"}];
const text = computed(() => browser.palette.value === "text");
const typed = computed(() => browser.query.value.trim());
// text hits stand under their file, each file once
const groups = computed(() => {
    const byFile = new Map();
    browser.shownHits.value.forEach((hit, at) => byFile.set(hit.id, [...(byFile.get(hit.id) ?? []), {...hit, at}]));
    return [...byFile].map(([id, lines]) => ({id, name: lines[0].name, lines}));
});
const folderOf = (path) => path.split("/").slice(0, -1).join("/");
const parts = (hit) => {
    const at = hit.text.toLowerCase().indexOf(typed.value.toLowerCase());
    return at < 0 ? [hit.text, "", ""] : [hit.text.slice(0, at).trimStart(), hit.text.slice(at, at + typed.value.length), hit.text.slice(at + typed.value.length)];
};
const KEYS = {ArrowDown: () => browser.choose(1), ArrowUp: () => browser.choose(-1), Enter: () => browser.openChosen(), Escape: () => (browser.palette.value = null)};
const onKey = (event) => KEYS[event.key] && (event.preventDefault(), event.stopPropagation(), KEYS[event.key]());
onMounted(() => field.value?.focus());
</script>

<template>
    <div class="palette-veil" data-files-palette @mousedown.self="browser.palette.value = null">
        <div class="palette" role="dialog" aria-label="Search" aria-modal="true" @keydown="onKey">
            <div class="palette-head">
                <input ref="field" v-model="browser.query.value" class="palette-field" placeholder="File name or words" aria-label="Find a file" data-palette-field autocomplete="off">
                <Segmented :options="MODES" :value="browser.palette.value" @pick="browser.palette.value = $event" />
            </div>
            <div class="palette-list">
                <template v-if="text && typed.length < 2">
                    <p class="palette-note" data-palette-note>Two letters or more</p>
                </template>
                <template v-else-if="!groups.length">
                    <p class="palette-note" data-palette-note>{{ typed ? "No match" : "Open a file and it shows here" }}</p>
                </template>
                <template v-else>
                    <template v-if="!typed">
                        <p class="palette-label">Opened files</p>
                    </template>
                    <template v-for="group in groups" :key="group.id">
                        <template v-if="text">
                            <div class="hitfile" data-hit-file>
                                <Icon name="file" :size="12" />{{ group.name }}<span class="faint">{{ group.id }}</span><span class="grow" /><span class="faint">{{ group.lines.length }}</span>
                            </div>
                            <template v-for="hit in group.lines" :key="hit.at">
                                <button type="button" :class="['hitline', {on: hit.at === browser.chosen.value}]" data-hit-line :data-hit="`${hit.id}:${hit.line}`" @click="browser.open(hit.id, hit.line)">
                                    <span class="faint">{{ hit.line }}</span><span>{{ parts(hit)[0] }}<em>{{ parts(hit)[1] }}</em>{{ parts(hit)[2] }}</span>
                                </button>
                            </template>
                        </template>
                        <template v-else>
                            <button type="button" :class="['palette-file', {on: group.lines[0].at === browser.chosen.value}]" data-hit-file-row :data-hit="group.id" @click="browser.open(group.id)">
                                <Icon name="file" :size="13" /><span>{{ group.name }}</span><span class="faint">{{ folderOf(group.id) }}</span>
                            </button>
                        </template>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.palette-veil {
    position: fixed;
    z-index: 70;
    inset: 0;
    display: grid;
    place-items: start center;
    padding-top: 80px;
    background: rgb(0 0 0 / 0.3);
}

.palette {
    width: min(620px, 92vw);
    overflow: hidden;
    border: 1px solid var(--border-3);
    border-radius: 12px;
    background: var(--sel);
    box-shadow: var(--tip-shadow);
}

.palette-head {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 0 var(--s3);
    border-bottom: 1px solid var(--border-2);
}

.palette-field {
    flex: 1;
    height: 44px;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    outline: none;
}

.palette-list {
    max-height: 360px;
    overflow: auto;
    padding: 6px;
}

.palette-note,
.palette-label {
    margin: 0;
    padding: 12px;
    color: var(--text-3);
    font-size: 12px;
}

.palette-label {
    padding: 4px 8px;
    color: var(--text-4);
}

.palette-file {
    display: flex;
    gap: 8px;
    align-items: center;
    width: 100%;
    padding: 6px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
}

.palette-file:hover,
.palette-file.on {
    background: var(--hover);
}

.faint {
    color: var(--text-4);
    font-size: 11px;
}

.grow {
    flex: 1;
}

.hitfile {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 8px var(--s3) 2px;
    color: var(--text);
    font-size: 12px;
}

.hitline {
    display: flex;
    gap: 10px;
    width: 100%;
    padding: 3px var(--s3) 3px 34px;
    overflow: hidden;
    border: 0;
    background: none;
    color: var(--text-2);
    font: 12px/18px var(--mono, monospace);
    text-align: left;
    white-space: pre;
    cursor: pointer;
}

.hitline:hover,
.hitline.on {
    background: var(--hover);
}

.hitline em {
    border-radius: 2px;
    background: color-mix(in srgb, var(--warn) 30%, transparent);
    color: var(--text);
    font-style: normal;
}
</style>

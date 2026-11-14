<script setup>
import {ref} from "vue";
import {Btn, Icon, copying, peekRef} from "@journal/window-kit";
import {GIT_WORDS} from "./gitWords.js";

// the bar under the file: its git state, who edited it last, how many lines it has, its language and the button that copies its path; the path itself is in the bar above
const props = defineProps({path: {type: String, required: true}, git: {type: String, default: ""}, agent: {type: Number, default: 0}, lines: {type: Number, required: true}, language: {type: String, required: true}});
const said = ref("");
let timer = 0;
const COPIED_MS = 1500;

async function copyPath() {
    await copying(props.path, "the path", (text) => (said.value = text));
    clearTimeout(timer);
    timer = setTimeout(() => (said.value = ""), COPIED_MS);
}
</script>

<template>
    <div class="status-bar" data-file-status>
        <template v-if="git">
            <span :class="['status-git', `git-${git}`]" data-status-git>{{ GIT_WORDS[git] }}</span>
        </template>
        <template v-if="agent">
            <button type="button" class="status-agent" data-status-agent @click="peekRef(`agents:${agent}`)">Edited by agent {{ agent }}</button>
        </template>
        <span class="status-grow" />
        <template v-if="said">
            <span role="status" data-status-said>{{ said }}</span>
        </template>
        <span data-status-lines>{{ lines }} {{ lines === 1 ? "line" : "lines" }}</span>
        <span data-status-language>{{ language }}</span>
        <Btn small title="Copy the path" aria-label="Copy the path" data-status-copy @click="copyPath"><Icon name="copy" :size="13" /></Btn>
    </div>
</template>

<style scoped>
.status-bar {
    display: flex;
    flex: none;
    gap: 14px;
    align-items: center;
    height: 26px;
    padding: 0 var(--s3);
    border-top: 1px solid var(--border);
    background: var(--bg-2);
    color: var(--text-3);
    font-size: 11px;
}

.status-grow {
    flex: 1;
}

.status-agent {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    cursor: pointer;
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
</style>

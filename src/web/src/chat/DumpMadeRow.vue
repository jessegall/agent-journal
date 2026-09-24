<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import InlineName from "../kit/InlineName.vue";
import TextDisplay from "../kit/TextDisplay.vue";

const props = defineProps({
    made: {type: Object, required: true},
    open: Boolean,
    lit: Boolean,
    selecting: Boolean,
    selected: Boolean,
});
const emit = defineEmits(["toggle", "peek", "rename", "merge", "select"]);
const renaming = ref(false);
const forming = computed(() => props.made.writing || !props.made.row);
const title = computed(() => props.made.row?.title || props.made.making || props.made.ref);
const gist = computed(() => props.made.row?.abstract || "");
const text = computed(() => props.made.row?.brief || "");

function clicked() {
    if (renaming.value || forming.value) return;
    emit(props.selecting ? "select" : "toggle");
}

function renamed(name) {
    renaming.value = false;
    if (name !== title.value) emit("rename", name);
}
</script>

<template>
    <div :class="['dump-doc', {forming, open, lit, selecting, selected}]" @click="clicked">
        <template v-if="selecting">
            <span class="dump-doc-box">
                <template v-if="selected">
                    <Icon name="check" :size="10" />
                </template>
            </span>
        </template>
        <span class="dump-doc-sheet" />
        <div class="dump-doc-main">
            <p class="dump-doc-name">
                <template v-if="renaming">
                    <InlineName :value="title" @done="renamed" @cancel="renaming = false" />
                </template>
                <template v-else>
                    {{ title }}
                    <template v-if="forming">
                        <span class="dump-doc-caret" />
                    </template>
                </template>
            </p>
            <template v-if="gist">
                <p class="dump-doc-gist">{{ gist }}</p>
            </template>
            <template v-if="!forming">
                <div class="dump-doc-meta">
                    <template v-if="made.from.length">
                        <span class="dump-doc-label">From</span>
                        <template v-for="from in made.from" :key="from">
                            <span class="dump-doc-chip">
                                <Icon name="file" :size="10" />
                                <span class="dump-doc-chip-name">{{ from }}</span>
                            </span>
                        </template>
                    </template>
                    <span class="dump-doc-in">
                        <span class="dump-doc-sep" />
                        <span class="dump-doc-label">Filed in</span>
                        <span class="dump-doc-place">{{ made.place }}</span>
                    </span>
                </div>
            </template>
            <template v-if="open && text">
                <TextDisplay class="dump-doc-text" :text="text" />
            </template>
        </div>
        <div class="dump-doc-side">
            <span :class="['dump-doc-pill', {live: forming}]">{{ forming ? "Writing" : made.kind }}</span>
            <template v-if="made.added">
                <span class="dump-doc-added" title="You did not ask for this one; the agent wrote it because it helps">
                    Added by the agent
                </span>
            </template>
            <template v-if="!forming && !selecting && !renaming">
                <div class="dump-doc-acts" @click.stop>
                    <Btn small @click="emit('peek')">Open</Btn>
                    <Btn small @click="renaming = true">Rename</Btn>
                    <Btn small @click="emit('merge')">Merge</Btn>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.dump-doc {
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr) auto;
    gap: 12px;
    padding: 12px 14px 11px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
    cursor: pointer;
    animation: dump-doc-arrive 0.5s var(--ease) both;
    transition:
        border-color 0.25s,
        background 0.25s,
        box-shadow 0.25s;
}

.dump-doc:hover {
    border-color: var(--border-3);
}

.dump-doc.forming {
    border-color: color-mix(in srgb, var(--accent) 45%, var(--border-2));
    cursor: default;
}

.dump-doc.lit {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 16%, transparent);
}

.dump-doc.selecting {
    grid-template-columns: 16px 24px minmax(0, 1fr) auto;
}

.dump-doc.selected {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 9%, var(--raised));
}

.dump-doc-box {
    display: grid;
    place-items: center;
    width: 16px;
    height: 16px;
    margin-top: 4px;
    border: 1.5px solid var(--border-3);
    border-radius: 4px;
    color: #fff;
}

.selected .dump-doc-box {
    border-color: var(--accent);
    background: var(--accent);
}

.dump-doc-sheet {
    width: 24px;
    height: 30px;
    margin-top: 2px;
    border-radius: 3px;
    background-color: color-mix(in srgb, var(--tone-good) 20%, var(--sel));
    background-image: repeating-linear-gradient(to bottom, transparent 0 4px, var(--border-3) 4px 5px);
    background-size: calc(100% - 8px) calc(100% - 13px);
    background-position: 4px 8px;
    background-repeat: no-repeat;
    clip-path: polygon(0 0, 70% 0, 100% 20%, 100% 100%, 0 100%);
}

.forming .dump-doc-sheet {
    background-color: var(--sel);
}

.lit .dump-doc-sheet,
.selected .dump-doc-sheet {
    background-color: var(--accent-dim);
}

.dump-doc-main {
    min-width: 0;
}

.dump-doc-name {
    display: flex;
    align-items: center;
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
}

.dump-doc-caret {
    display: inline-block;
    width: 1.5px;
    height: 1em;
    margin-left: 2px;
    background: var(--accent-text);
    animation: dump-doc-blink 1.05s steps(1) infinite;
}

.dump-doc-gist {
    margin: 2px 0 0;
    font-size: 12.5px;
    color: var(--text-3);
    text-wrap: pretty;
}

.dump-doc-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
}

.dump-doc-label {
    font-size: 11.5px;
    color: var(--text-4);
}

.dump-doc-chip {
    display: inline-flex;
    max-width: 260px;
    align-items: center;
    gap: 5px;
    padding: 3px 8px 3px 6px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--bg);
    font: 11px var(--mono);
    color: var(--text-2);
}

.dump-doc-chip-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dump-doc-chip :deep(.ico) {
    color: var(--accent-text);
}

.dump-doc-in {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
}

.dump-doc-sep {
    width: 1px;
    height: 14px;
    margin: 0 4px;
    background: var(--border-2);
}

.dump-doc-place {
    font: 11.5px var(--mono);
    color: var(--text-2);
}

.dump-doc-text {
    max-height: 240px;
    margin-top: 10px;
    padding-top: 10px;
    overflow-y: auto;
    border-top: 1px solid var(--border);
    font-size: 13px;
    color: var(--text-2);
}

.dump-doc-side {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 7px;
}

.dump-doc-pill {
    height: 20px;
    padding: 0 8px;
    border-radius: 10px;
    background: var(--sel);
    font-size: 11px;
    line-height: 20px;
    color: var(--text-2);
    white-space: nowrap;
}

.dump-doc-pill.live {
    background: var(--accent-dim);
    color: var(--accent-text);
}

.dump-doc-added {
    font-size: 11px;
    color: var(--accent-text);
    white-space: nowrap;
}

.dump-doc-acts {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s;
}

.dump-doc:hover .dump-doc-acts,
.dump-doc:focus-within .dump-doc-acts {
    opacity: 1;
}

@keyframes dump-doc-arrive {
    from {
        opacity: 0;
        translate: 0 8px;
    }
}

@keyframes dump-doc-blink {
    50% {
        opacity: 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .dump-doc,
    .dump-doc-caret {
        animation: none;
    }
}
</style>

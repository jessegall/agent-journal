<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../../api/client.js";
import {fileSize} from "../../format/files.js";
import {aboutLines, linesWord} from "../../format/quote.js";
import Diff from "../../kit/Diff.vue";
import {highlight, languageOf} from "../../text/highlight.js";
import EmptyList from "../kit/EmptyList.vue";
import FormSheet from "../kit/FormSheet.vue";
import PlaceScreen from "../kit/PlaceScreen.vue";
import Segment from "../kit/Segment.vue";
import {toast} from "../kit/toast.js";
import {askAgent} from "./askAgent.js";

const MODES = [
    {key: "whole", label: "Whole file"},
    {key: "changes", label: "Changes"},
];

const props = defineProps({target: {type: String, required: true}, back: {type: String, default: ""}});
const emit = defineEmits(["back"]);
const file = ref(null);
const diff = ref(null);
const failed = ref("");
const changes = ref(false);
const picked = ref(null);
const asking = ref(false);
const name = computed(() => props.target.split("/").at(-1));
const lines = computed(() => (file.value?.text ? highlight(file.value.text, languageOf(file.value.path)) : []));
const about = computed(() =>
    file.value
        ? [props.target, file.value.lines ? `${file.value.lines} lines` : "", fileSize(file.value.size)].filter(Boolean).join(" · ")
        : props.target
);
const chosen = (n) => picked.value && n >= picked.value.first && n <= picked.value.last;

onMounted(async () => {
    try {
        file.value = await api.projectFile(props.target);
    } catch (error) {
        failed.value = error.message;
    }
});

async function show(mode) {
    changes.value = mode === "changes";
    if (!changes.value || diff.value !== null) return;
    diff.value = (await api.fileDiff(props.target).catch(() => ({diff: ""}))).diff;
}

function pick(n) {
    const at = picked.value;
    if (at && at.first === at.last && n !== at.first)
        return (picked.value = {first: Math.min(n, at.first), last: Math.max(n, at.first), text: ""});
    picked.value = at && at.first === n && at.last === n ? null : {first: n, last: n, text: ""};
}

async function ask({words}) {
    try {
        await askAgent(aboutLines(file.value, picked.value, words));
        toast("Sent to the agent; the file itself is unchanged");
        picked.value = null;
    } catch (error) {
        toast(error.message);
    }
}
</script>

<template>
    <PlaceScreen :title="name" :sub="about" :back="back" @back="emit('back')">
        <template v-if="failed">
            <EmptyList icon="warn" title="The file did not load" :reason="failed" />
        </template>
        <template v-else-if="file">
            <template v-if="!file.project">
                <Segment label="Show" :options="MODES" :value="changes ? 'changes' : 'whole'" @pick="show" />
            </template>
            <template v-if="changes">
                <template v-if="diff">
                    <Diff class="file-diff" :text="diff" />
                </template>
                <template v-else-if="diff === ''">
                    <EmptyList icon="check" title="No changes" reason="Nothing in this file changed since the last commit to git." />
                </template>
            </template>
            <template v-else-if="file.kind.startsWith('image/')">
                <EmptyList icon="camera" title="This is a picture" reason="Open pictures from Attached files." />
            </template>
            <template v-else>
                <p class="file-hint">Tap a line to ask the agent about it; tap a second line for a range.</p>
                <pre
                    class="file-text"
                ><template v-for="(line, i) in lines" :key="i"><button type="button" :class="['file-line', {on: chosen(i + 1)}]" :aria-label="`Line ${i + 1}`" @click="pick(i + 1)"><span class="file-n">{{ i + 1 }}</span><span v-html="line" /></button></template></pre>
            </template>
        </template>
        <template v-if="picked" #foot>
            <button type="button" class="file-ask" @click="asking = true">Ask the agent about {{ linesWord(picked) }}</button>
        </template>
    </PlaceScreen>
    <template v-if="asking">
        <FormSheet
            :title="`Ask about ${linesWord(picked)}`"
            :sub="`Of ${target}. The agent reads the lines with your words.`"
            :fields="[{key: 'words', label: 'Your comment', area: true, required: true}]"
            button="Send to the agent"
            @close="asking = false"
            @submit="ask"
        />
    </template>
</template>

<style scoped>
.file-hint {
    margin: 0 4px 8px;
    color: var(--text-3);
    font-size: 0.8125rem;
}

.file-text,
.file-diff {
    margin: 0;
    overflow-x: auto;
    border-radius: 12px;
    background: var(--raised);
    font-size: 0.75rem;
    line-height: 1.5;
}

.file-text {
    padding: 8px 0;
}

.file-line {
    display: block;
    width: 100%;
    min-width: max-content;
    padding: 0 12px 0 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    white-space: pre;
}

.file-line.on {
    background: var(--sel);
}

.file-n {
    display: inline-block;
    width: 3.2em;
    padding-right: 10px;
    color: var(--text-3);
    text-align: right;
    user-select: none;
}

.file-ask {
    width: 100%;
    min-height: 44px;
    border: 0;
    border-radius: 12px;
    background: var(--accent);
    color: #fff;
    font: inherit;
    font-weight: 600;
}
</style>

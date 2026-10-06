<script setup>
import Btn from "../kit/Btn.vue";
import FileSlip from "../kit/FileSlip.vue";
import ProgressBar from "../kit/ProgressBar.vue";
import DumpAddFiles from "./DumpAddFiles.vue";
import DumpAnswer from "./DumpAnswer.vue";
import DumpEyebrow from "./DumpEyebrow.vue";
import DumpNarration from "./DumpNarration.vue";
import {fileKind} from "./dumpPile.js";
import {counted} from "../format/number.js";

defineProps({
    items: {type: Array, required: true},
    adding: {type: Array, required: true},
    working: {type: Boolean, default: false},
    moreError: {type: String, default: ""},
    settled: {type: Number, default: 0},
    timeline: {type: Array, required: true},
    current: {type: Object, default: null},
    thinking: {type: String, default: ""},
    question: {type: String, default: ""},
    guesses: {type: Array, required: true},
    removed: {type: Boolean, default: false},
    litRef: {type: String, default: ""},
    answer: {type: Function, required: true},
    say: {type: Function, required: true},
});
const litItem = defineModel("litItem", {type: String, default: ""});
const emit = defineEmits(["more", "paste-more"]);
const READ = {waiting: -1, read: 0.6, filed: 1, failed: 1};

function slipMeta(item) {
    if (item.state === "filed") return `→ ${counted(item.refs.filter((r) => !r.startsWith("collection:")).length, "thing", "things")}`;
    return item.state === "failed" ? "not filed" : item.state;
}
</script>

<template>
    <aside class="dump-rail">
        <DumpEyebrow>The pile</DumpEyebrow>
        <div class="dump-pile" @mouseleave="litItem = ''">
            <template v-for="item in items" :key="item.name">
                <FileSlip
                    :file="{name: item.label}"
                    :kind="fileKind(item.name)"
                    :state="item.state"
                    :read="READ[item.state]"
                    :meta="slipMeta(item)"
                    :lit="litItem === item.name || item.refs.includes(litRef)"
                    :title="item.note"
                    @mouseenter="litItem = item.name"
                />
            </template>
            <template v-for="name in adding" :key="`adding-${name}`">
                <FileSlip :file="{name}" :kind="fileKind(name)" state="waiting" meta="adding…" />
            </template>
        </div>
        <template v-if="working">
            <DumpAddFiles class="dump-add-more" @files="(list) => emit('more', list)">Add more files</DumpAddFiles>
        </template>
        <template v-if="moreError">
            <span class="dump-error">{{ moreError }}</span>
        </template>
        <ProgressBar thin :value="settled" :max="Math.max(1, items.length)" />
        <DumpEyebrow>What the agent is doing</DumpEyebrow>
        <DumpNarration :timeline="timeline" :current="current" :thinking="thinking" />
        <template v-if="question">
            <div class="dump-ask">
                <p class="dump-ask-q">{{ question }}</p>
                <template v-if="guesses.length">
                    <div class="dump-guesses">
                        <template v-for="g in guesses" :key="g">
                            <Btn small @click="answer(g)">{{ g }}</Btn>
                        </template>
                    </div>
                </template>
                <DumpAnswer :placeholder="guesses.length ? 'Or say it in your own words' : 'Your answer'" :send="answer" />
            </div>
        </template>
        <template v-else-if="!removed">
            <DumpAnswer
                :placeholder="working ? 'Ask, or paste more files' : 'Ask about what was filed'"
                action="Send"
                :send="say"
                @paste="emit('paste-more', $event)"
            />
        </template>
    </aside>
</template>

<style scoped>
.dump-add-more {
    align-self: flex-start;
    margin: -2px 0 0 -6px;
}

.dump-rail {
    display: flex;
    flex-direction: column;
    gap: 9px;
    min-height: 0;
    padding: 16px 16px 14px 18px;
    overflow: hidden;
    border-right: 1px solid var(--border);
}

.dump-pile {
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 7px;
    max-height: 45%;
    overflow-y: auto;
}

.dump-ask {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px;
    border: 1px solid color-mix(in srgb, var(--tone-warn) 35%, transparent);
    border-radius: 10px;
    background: color-mix(in srgb, var(--tone-warn) 6%, transparent);
}

.dump-ask-q {
    margin: 0;
    font-size: 13px;
    color: var(--text);
}

.dump-guesses {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

@container (max-width: 640px) {
    .dump-rail {
        max-height: 42cqh;
        border-right: 0;
        border-bottom: 1px solid var(--border);
    }

    .dump-pile {
        flex-direction: row;
        max-height: none;
        overflow-x: auto;
    }

    .dump-pile > * {
        flex: 0 0 200px;
    }
}

.dump-error {
    font-size: 12px;
    color: var(--danger);
}
</style>

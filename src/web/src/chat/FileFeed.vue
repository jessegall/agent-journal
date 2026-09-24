<script setup>
import {computed, nextTick, ref} from "vue";
import {api} from "../api/client.js";
import FeedBar from "./FeedBar.vue";
import DiffCard from "../kit/DiffCard.vue";
import EmptyState from "../kit/EmptyState.vue";
import JumpPill from "../kit/JumpPill.vue";
import {useFileFeed} from "../composables/fileFeed.js";
import {useFollow} from "../composables/follow.js";
import {useNow} from "../composables/now.js";
import {fresh} from "../format/time.js";

const props = defineProps({agent: {type: Number, required: true}, flush: Boolean, options: {type: Object, default: null}});
const emit = defineEmits(["options"]);
const DEFAULTS = {flush: false, headers: false, collapse: true, editsOnly: false, removals: true, capped: false, columns: false, size: 0};
const BIG = 40;
const TOP = 80;
const SIZES = {"-1": ["10.5px", "17px"], 0: ["11.5px", "19px"], 1: ["13px", "21px"]};

const scroller = ref(null);
const follow = useFollow(scroller);
const {following, unseen, jump, scrolled, wheeled} = follow;
const {cards, ready, latest, older, loadOlder} = useFileFeed(props.agent, follow);
const now = useNow();
const empty = computed(() => ready.value && !cards.value.length);
const view = computed(() => ({...DEFAULTS, ...(props.options || {})}));
const flushed = computed(() => props.flush || view.value.flush);
const filter = ref("");
const folds = ref({});
const wholes = ref({});
const listed = computed(() => {
    const needle = filter.value.trim().toLowerCase();
    return needle ? cards.value.filter((c) => c.path.toLowerCase().includes(needle)) : cards.value;
});
const sizing = computed(() => ({"--diff-size": SIZES[view.value.size][0], "--diff-line": SIZES[view.value.size][1]}));

const foldedOf = (c) => folds.value[c.id] ?? (view.value.headers || (view.value.collapse && c.added + c.removed > BIG));
const fold = (c) => (folds.value = {...folds.value, [c.id]: !foldedOf(c)});
const expand = () => (folds.value = Object.fromEntries(cards.value.map((c) => [c.id, false])));

async function whole(c) {
    if (wholes.value[c.id]) {
        const rest = {...wholes.value};
        delete rest[c.id];
        return (wholes.value = rest);
    }
    wholes.value = {...wholes.value, [c.id]: {}};
    folds.value = {...folds.value, [c.id]: false};
    try {
        const got = await api.editedFile(props.agent, c.latest, "after");
        wholes.value = {...wholes.value, [c.id]: {text: got.text}};
    } catch (e) {
        wholes.value = {...wholes.value, [c.id]: {error: "This version of the file is no longer kept."}};
    }
}

async function reachedTop() {
    const box = scroller.value;
    if (!box || box.scrollTop > TOP || !older.value) return;
    const from = box.scrollHeight;
    if (!(await loadOlder())) return;
    await nextTick();
    box.scrollTop += box.scrollHeight - from;
}

function onScroll(e) {
    scrolled(e);
    reachedTop();
}
</script>

<template>
    <div :class="['file-feed', {flush: flushed}]" :style="sizing">
        <FeedBar :options="view" :filter="filter" @options="emit('options', $event)" @filter="filter = $event" @expand="expand" />
        <div ref="scroller" class="file-feed-scroll" @scroll.passive="onScroll" @wheel.passive="wheeled">
            <div class="file-feed-flow">
                <template v-for="c in listed" :key="c.id">
                    <DiffCard
                        :flush="flushed"
                        :folded="foldedOf(c)"
                        :edits-only="view.editsOnly"
                        :hide-removals="!view.removals"
                        :capped="view.capped"
                        :whole="wholes[c.id] || null"
                        @fold="fold(c)"
                        @whole="whole(c)"
                        :path="c.path"
                        :kind="c.kind"
                        :added="c.added"
                        :removed="c.removed"
                        :ago="fresh(c.at, now)"
                        :rows="c.rows"
                        :half="view.columns || c.half"
                        :entering="c.id === latest"
                        :fresh="latest"
                    />
                </template>
            </div>
        </div>
        <template v-if="empty">
            <EmptyState title="No edits yet">The agent's file edits appear here as it makes them.</EmptyState>
        </template>
        <template v-if="!following && cards.length">
            <JumpPill :count="unseen" @jump="jump" />
        </template>
    </div>
</template>

<style scoped>
.file-feed {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    container-type: inline-size;
}

.file-feed-scroll {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--border-3) transparent;
}

.file-feed-flow {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 10px;
    padding: 16px 14px;
}

.file-feed.flush .file-feed-flow {
    gap: 0;
    padding: 0;
}
</style>

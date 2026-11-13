<script setup>
import {computed, ref, watch} from "vue";
import {AutoScrollPane, Btn, DiffCard, EmptyState, FeedPaginator, Skeleton, useWindow} from "@journal/window-kit";
import FeedBar from "./FeedBar.vue";
import {cardsOf} from "./fileCards.js";

// each edit as a diff card, as version 4's file feed drew it, oldest above and newest below, held at the end while the view is there
const DEFAULTS = {lines: 0, flush: false, headers: false, collapse: false, editsOnly: false, removals: true, capped: false, columns: false, size: 0};
const BIG_LINE_COUNT = 40;
const SIZES = {"-1": ["10.5px", "17px"], 0: ["11.5px", "19px"], 1: ["13px", "21px"]};
const SETTING_KEY = "view";
// on an agent's page and a worker's, the feed starts as five lines flush, the way version 4's inspector drew it
const AGENT_PAGE = "agent";
const AGENT_VIEW = {lines: 5, flush: true};

const view = useWindow();
if (view.agent != null) view.state["edits.agent"] = String(view.agent);
const {rows, failure, loaded, more} = view.props.edits;
const paginator = FeedPaginator.ofRows("file-feed", view.props.edits);
const {data: savedView} = view.props.view;
const kept = view.option(SETTING_KEY);
const startView = (own) => ({...DEFAULTS, ...(view.page === AGENT_PAGE ? AGENT_VIEW : {}), ...own});
const options = ref(startView({}));
const filter = ref("");
const folds = ref({});
const wholes = ref({});

const cards = computed(() => cardsOf([...rows.value].sort((one, two) => one.id - two.id)));
const listed = computed(() => {
    const words = filter.value.trim().toLowerCase();
    return words ? cards.value.filter((card) => card.path.toLowerCase().includes(words)) : cards.value;
});
const sizing = computed(() => ({"--diff-size": SIZES[options.value.size][0], "--diff-line": SIZES[options.value.size][1]}));
const foldedOf = (card) => folds.value[card.id] ?? (!card.rows.length || options.value.headers || (options.value.collapse && !Number(options.value.lines) && card.added + card.removed > BIG_LINE_COUNT));
const fold = (card) => (folds.value = {...folds.value, [card.id]: !foldedOf(card)});
const expand = () => (folds.value = Object.fromEntries(cards.value.map((card) => [card.id, false])));

function setOptions(chosen) {
    options.value = chosen;
    view.setOption(SETTING_KEY, chosen);
}

async function whole(card) {
    if (wholes.value[card.id]) {
        const rest = {...wholes.value};
        delete rest[card.id];
        wholes.value = rest;
        return;
    }
    const file = view.props[`file.${card.id}`];
    const reloaded = await view.reload(`file.${card.id}`);
    folds.value = {...folds.value, [card.id]: false};
    wholes.value = {...wholes.value, [card.id]: !reloaded || file.failure.value ? {error: "The text of this file could not be read."} : {text: file.data.value.text}};
}

// this pane's own view, else the one version 5 first kept for every feed
watch([kept, savedView], () => { options.value = startView(kept.value ?? savedView.value?.value ?? {}); }, {immediate: true});
</script>

<template>
    <div :class="['file-feed', {flush: options.flush}]" :style="sizing" data-file-feed>
        <FeedBar :options="options" :filter="filter" @options="setOptions" @filter="filter = $event" @expand="expand" />
        <AutoScrollPane :row-count="rows.length" :feed="paginator">
            <template v-if="failure">
                <p class="file-feed-failure" role="alert">{{ failure }}</p>
            </template>
            <template v-else-if="!loaded">
                <Skeleton shape="rows" />
            </template>
            <template v-else-if="!cards.length">
                <EmptyState title="No edits by this agent yet" />
            </template>
            <template v-else>
            <div class="file-feed-flow">
                <template v-if="more && !filter">
                    <Btn small data-feed-older @click="paginator.scrollUp()">Show older edits</Btn>
                </template>
                <template v-for="card in listed" :key="card.id">
                    <DiffCard
                        :flush="options.flush"
                        :folded="foldedOf(card)"
                        :edits-only="options.editsOnly"
                        :hide-removals="!options.removals"
                        :capped="options.capped"
                        :lines="Number(options.lines) || 0"
                        :whole="wholes[card.id] || null"
                        :path="card.path"
                        :change="card.edit_type"
                        :from="card.moved_from"
                        :added="card.added"
                        :removed="card.removed"
                        :at="card.created_at"
                        :rows="card.rows"
                        :half="options.columns || card.half"
                        @fold="fold(card)"
                        @whole="whole(card)"
                    />
                </template>
            </div>
            </template>
        </AutoScrollPane>
    </div>
</template>

<style scoped>
.file-feed {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    container-type: inline-size;
}

.file-feed-flow {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: flex-start;
    padding: 12px;
}

.file-feed.flush .file-feed-flow {
    gap: 0;
    padding: 0;
}

.file-feed-failure {
    padding: 8px 12px;
    color: var(--danger);
}
</style>

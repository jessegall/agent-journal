<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import Segmented from "../kit/Segmented.vue";
import SectionHeading from "../kit/SectionHeading.vue";
import DocumentRow from "../resource/DocumentRow.vue";
import {found, standing, words} from "../domain/documents.js";
import {rows} from "../sync/rows.js";

const props = defineProps({docs: Array, query: {type: String, default: ""}, order: {type: String, default: "recent"}});
const emit = defineEmits(["open", "clear"]);
const LOOSE = "loose";
const DAY = 86400;
const AGES = [
    {title: "Last 7 days", within: 7 * DAY},
    {title: "Last 30 days", within: 30 * DAY},
    {title: "Older", within: Infinity},
];
const NAME_AT_MOST = 34;
const shelf = ref("");
const refs = computed(() => new Set(props.docs.map((d) => d.ref)));
const collections = computed(() =>
    rows("collection")
        .filter((c) => !c.deleted)
        .map((c) => ({ref: c.ref, title: c.title, holds: c.refs.filter((r) => refs.value.has(r))}))
        .filter((c) => c.holds.length)
);
const homeOf = computed(() => {
    const home = {};
    for (const c of collections.value) for (const r of c.holds) home[r] ||= c.title;
    return home;
});
const loose = computed(() => props.docs.filter((d) => !homeOf.value[d.ref]));
const short = (title) => (title.length > NAME_AT_MOST ? `${title.slice(0, NAME_AT_MOST - 1)}…` : title);
const shelves = computed(() => [
    {key: "", label: `All ${props.docs.length}`},
    ...collections.value.map((c) => ({key: c.ref, label: `${short(c.title)} ${c.holds.length}`})),
    {key: LOOSE, label: `Not in a collection ${loose.value.length}`},
]);
const onShelf = computed(() => {
    if (!shelf.value) return props.docs;
    if (shelf.value === LOOSE) return loose.value;
    const held = new Set(collections.value.find((c) => c.ref === shelf.value)?.holds || []);
    return props.docs.filter((d) => held.has(d.ref));
});
const changed = (d) => d.updated || d.created;
const replaced = (d) => Number(standing(d).key === "replaced");
const replacedLast = (a, b) => replaced(a) - replaced(b);
const sorted = computed(() =>
    [...onShelf.value].sort((a, b) =>
        props.order === "title" ? a.title.localeCompare(b.title) : replacedLast(a, b) || changed(b) - changed(a)
    )
);
const searched = computed(() => words(props.query));
const hits = computed(() =>
    sorted.value
        .map((doc) => ({doc, hit: found(doc, searched.value)}))
        .filter((h) => h.hit)
        .sort((a, b) => b.hit.score - a.hit.score)
);
const groups = computed(() => {
    if (props.order === "title") return [{title: "", list: sorted.value}];
    const now = Date.now() / 1000;
    return AGES.map((g, i) => ({
        title: g.title,
        list: sorted.value.filter((d) => now - changed(d) < g.within && (i === 0 || now - changed(d) >= AGES[i - 1].within)),
    })).filter((g) => g.list.length);
});
const shelfName = (d) => (shelf.value ? "" : homeOf.value[d.ref] || "");
</script>

<template>
    <div class="library">
        <template v-if="collections.length">
            <nav class="shelves" aria-label="Collections">
                <Segmented :options="shelves" :value="shelf" @pick="shelf = $event" />
            </nav>
        </template>
        <template v-if="searched.length">
            <section class="group">
                <SectionHeading class="group-head">
                    {{ hits.length }} of {{ onShelf.length }} {{ onShelf.length === 1 ? "document" : "documents" }} match
                </SectionHeading>
                <template v-if="hits.length">
                    <template v-for="h in hits" :key="h.doc.ref">
                        <DocumentRow :doc="h.doc" :hit="h.hit" :words="searched" :shelf="shelfName(h.doc)" @open="emit('open', $event)" />
                    </template>
                </template>
                <template v-else>
                    <EmptyState class="none">
                        Nothing in {{ shelf ? "this collection" : "the documents" }} mentions “{{ query.trim() }}”.
                        <Btn small @click="emit('clear')">Clear the search</Btn>
                    </EmptyState>
                </template>
            </section>
        </template>
        <template v-else>
            <template v-for="g in groups" :key="g.title">
                <section class="group">
                    <template v-if="g.title">
                        <SectionHeading class="group-head">{{ g.title }}</SectionHeading>
                    </template>
                    <template v-for="d in g.list" :key="d.ref">
                        <DocumentRow :doc="d" :shelf="shelfName(d)" @open="emit('open', $event)" />
                    </template>
                </section>
            </template>
        </template>
    </div>
</template>

<style scoped>
.library {
    max-width: 920px;
    padding: 6px 22px 40px 8px;
}

.shelves {
    overflow-x: auto;
    padding: 12px 0 4px 14px;
    scrollbar-width: none;
}

.shelves :deep(.segmented) {
    white-space: nowrap;
}

.group {
    margin-top: 14px;
}

.group-head {
    position: sticky;
    top: var(--sticky-top, 0);
    z-index: 1;
    margin: 0;
    padding: 8px 14px 6px;
    background: var(--bg);
}

.none {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin: 8px 14px;
}

@media (max-width: 640px) {
    .library {
        padding: 4px 6px 32px 0;
    }

    .shelves {
        padding-left: 10px;
    }

    .group-head {
        padding-left: 10px;
    }
}
</style>

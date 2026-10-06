<script setup>
import {found, searchTerms, standing} from "../domain/documents.js";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import Segmented from "../kit/Segmented.vue";
import DocumentRow from "../resource/DocumentRow.vue";
import RowGroups from "../resource/RowGroups.vue";
import {rows} from "../sync/rows.js";
import {ageGroups} from "../format/time.js";
import DocumentPreview from "../resource/DocumentPreview.vue";

const props = defineProps({docs: Array, query: {type: String, default: ""}, order: {type: String, default: "recent"}});
const emit = defineEmits(["open", "clear", "new"]);
const selected = ref(0);
const root = ref(null);
const answeredHere = ref(0);
const wide = ref(window.innerWidth >= 900);
const resize = () => (wide.value = window.innerWidth >= 900);
onMounted(() => window.addEventListener("resize", resize));
onUnmounted(() => window.removeEventListener("resize", resize));
const LOOSE = "loose";
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
const searched = computed(() => searchTerms(props.query));
const hits = computed(() =>
    sorted.value
        .map((doc) => ({doc, hit: found(doc, searched.value)}))
        .filter((h) => h.hit)
        .sort((a, b) => b.hit.score - a.hit.score)
);
const waiting = (doc) => ["answer", "approve"].includes(standing(doc).key) || answeredHere.value === doc.n;
const shown = computed(() => (searched.value.length ? hits.value.map((hit) => hit.doc) : sorted.value));
const waitingDocs = computed(() => shown.value.filter(waiting));
const otherDocs = computed(() => shown.value.filter((doc) => !waiting(doc)));
const groups = computed(() =>
    [
        ...(waitingDocs.value.length
            ? [
                  {
                      key: "waiting",
                      title: "Needs you",
                      count: waitingDocs.value.length,
                      why: searched.value.length ? "" : "Your answer or approval is needed for these documents.",
                      list: waitingDocs.value,
                  },
              ]
            : []),
        ...(props.order === "title"
            ? [
                  {
                      key: "alphabetical",
                      title: waitingDocs.value.length ? "Other documents, A to Z" : "Documents, A to Z",
                      count: null,
                      list: otherDocs.value,
                  },
              ]
            : ageGroups(otherDocs.value, changed).map((group) => ({...group, key: group.title, count: null}))),
    ].filter((group) => group.list.length)
);
const shelfName = (d) => (shelf.value ? "" : homeOf.value[d.ref] || "");
const selectedDoc = computed(() => shown.value.find((doc) => doc.n === selected.value) || null);
watch(shown, (docs) => {
    if (!docs.some((doc) => doc.n === selected.value)) selected.value = 0;
});
watch(
    () => props.docs.map((doc) => `${doc.n}:${(doc.data.pressed || []).join(",")}:${doc.data.answered_own || ""}`),
    () => {
        const doc = props.docs.find((item) => item.n === selected.value);
        if (doc && standing(doc).key === "answered") answeredHere.value = selected.value;
    }
);
function choose(doc) {
    if (answeredHere.value && answeredHere.value !== doc.n) answeredHere.value = 0;
    selected.value = doc.n;
    if (!wide.value) emit("open", doc);
}
function focusFirst() {
    const first = root.value?.querySelector(".doc-row");
    first?.focus();
    if (first && wide.value) selected.value = Number(first.dataset.doc);
}
defineExpose({focusFirst});
function move(event, direction) {
    if (!event.target.matches(".doc-row")) return;
    event.preventDefault();
    const buttons = [...event.currentTarget.querySelectorAll(".doc-row")];
    const at = buttons.indexOf(event.target);
    const next = buttons[Math.max(0, Math.min(buttons.length - 1, at + direction))];
    if (!next) return;
    next.focus();
    if (wide.value) selected.value = Number(next.dataset.doc) || 0;
}
</script>

<template>
    <div ref="root" :class="['library', {wide}]">
        <div class="document-list" @keydown.down="move($event, 1)" @keydown.up="move($event, -1)" @keydown.esc="selected = 0">
            <template v-if="!docs.length">
                <EmptyState class="no-documents" title="No documents yet">Documents written here will appear in this list.</EmptyState>
                <Btn kind="primary" class="make-document" @click="emit('new')">New document</Btn>
            </template>
            <template v-else>
                <template v-if="collections.length">
                    <nav class="shelves" aria-label="Collections">
                        <Segmented wrap :options="shelves" :value="shelf" @pick="shelf = $event" />
                    </nav>
                </template>
                <template v-if="searched.length">
                    <p class="match-count">
                        {{ hits.length }} of {{ onShelf.length }} {{ onShelf.length === 1 ? "document" : "documents" }} match “{{
                            query.trim()
                        }}”
                    </p>
                    <template v-if="!hits.length">
                        <EmptyState class="none">
                            Nothing in {{ shelf ? "this collection" : "the documents" }} mentions “{{ query.trim() }}”.
                            <Btn small @click="emit('clear')">Clear the search</Btn>
                            <template v-if="shelf"><Btn small @click="shelf = ''">Search every document</Btn></template>
                        </EmptyState>
                    </template>
                </template>
                <RowGroups :groups="groups" type="doc">
                    <template #row="{resource: d}">
                        <DocumentRow
                            :doc="d"
                            :selected="wide && selected === d.n"
                            :hit="hits.find((item) => item.doc.ref === d.ref)?.hit"
                            :words="searched"
                            :shelf="shelfName(d)"
                            @open="choose"
                        />
                    </template>
                </RowGroups>
            </template>
        </div>
        <template v-if="wide && docs.length">
            <DocumentPreview
                :doc="selectedDoc"
                :words="searched"
                :searching="!!searched.length"
                @open="emit('open', $event)"
                @hide="selected = 0"
            />
        </template>
    </div>
</template>

<style scoped>
.library {
    min-height: calc(100vh - 110px);
}
.library.wide {
    display: grid;
    grid-template-columns: minmax(350px, 40%) minmax(0, 1fr);
    height: calc(100dvh - 100px);
    min-height: 420px;
    overflow: hidden;
}
.library.wide .document-list {
    overflow-y: auto;
}
.document-list {
    min-width: 0;
    padding: 6px 8px 40px;
}
.no-documents {
    position: relative !important;
    min-height: 260px;
}
.make-document {
    display: block;
    margin: 0 auto;
}
.match-count {
    margin: 14px 14px 6px;
    color: var(--text-3);
    font-size: 12px;
}
.shelves {
    padding: 12px 0 4px 14px;
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
}
</style>

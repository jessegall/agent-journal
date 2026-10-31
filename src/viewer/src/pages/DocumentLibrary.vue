<script setup>
import {searchTerms} from "../domain/documents.js";
import {api} from "../api/client.js";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import DocumentRow from "../resource/DocumentRow.vue";
import RowGroups from "../resource/RowGroups.vue";
import {hasLoaded} from "../sync/rows.js";
import {titleOf, updatedAt} from "../domain/row.js";
import {ageGroups} from "../format/time.js";
import DocumentPreview from "../resource/DocumentPreview.vue";

const props = defineProps({docs: Array, query: {type: String, default: ""}, order: {type: String, default: "recent"}});
const emit = defineEmits(["open", "clear", "new"]);
const selected = ref(0);
const root = ref(null);
const wide = ref(window.innerWidth >= 900);
const resize = () => (wide.value = window.innerWidth >= 900);
onMounted(() => window.addEventListener("resize", resize));
onUnmounted(() => window.removeEventListener("resize", resize));
const sorted = computed(() =>
    [...props.docs].sort((a, b) => (props.order === "title" ? titleOf(a).localeCompare(titleOf(b)) : updatedAt(b) - updatedAt(a)))
);
const searched = computed(() => searchTerms(props.query));
const located = ref(new Map());
let askedLast = 0;

async function locate() {
    const words = props.query.trim();
    const mine = (askedLast += 1);
    if (!words) {
        located.value = new Map();
        return;
    }
    const got = await api.locateDocs(words);
    if (mine === askedLast) located.value = new Map(got.map((hit) => [hit.id, hit]));
}

const shelfSignature = computed(() => props.docs.map((doc) => `${doc.id}:${doc.updated_at}`).join(","));
watch([() => props.query, shelfSignature], () => locate().catch((error) => console.error(error)), {immediate: true});
const hits = computed(() =>
    sorted.value
        .map((doc) => ({doc, hit: located.value.get(doc.id)}))
        .filter((h) => h.hit)
        .sort((a, b) => b.hit.score - a.hit.score)
);
const shown = computed(() => (searched.value.length ? hits.value.map((hit) => hit.doc) : sorted.value));
const groups = computed(() =>
    (props.order === "title"
        ? [{key: "alphabetical", title: "Documents, A to Z", count: null, list: shown.value}]
        : ageGroups(shown.value, updatedAt).map((group) => ({...group, key: group.title, count: null}))
    ).filter((group) => group.list.length)
);
const selectedDoc = computed(() => shown.value.find((doc) => doc.id === selected.value) || null);
watch(shown, (docs) => {
    if (!docs.some((doc) => doc.id === selected.value)) selected.value = 0;
});
function choose(doc) {
    selected.value = doc.id;
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
                <EmptyState class="no-documents" :loading="!hasLoaded('docs')" title="No documents yet">
                    Documents written here will appear in this list.
                </EmptyState>
                <Btn kind="primary" class="make-document" @click="emit('new')">New document</Btn>
            </template>
            <template v-else>
                <template v-if="searched.length">
                    <p class="match-count">
                        {{ hits.length }} of {{ docs.length }} {{ docs.length === 1 ? "document" : "documents" }} match “{{ query.trim() }}”
                    </p>
                    <template v-if="!hits.length">
                        <EmptyState class="none">
                            Nothing in the documents mentions “{{ query.trim() }}”.
                            <Btn small @click="emit('clear')">Clear the search</Btn>
                        </EmptyState>
                    </template>
                </template>
                <RowGroups :groups="groups" table="docs">
                    <template #row="{resource: d}">
                        <DocumentRow
                            :doc="d"
                            :selected="wide && selected === d.id"
                            :hit="located.get(d.id)"
                            :words="searched"
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
    --sticky-top: 0;
    min-width: 0;
    padding: 0 8px 40px;
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

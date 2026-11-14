<script setup>
import {computed, ref, watch} from "vue";
import Segmented from "../src/kit/Segmented.vue";
import MoreItems from "./MoreItems.vue";
import ResourceLinkGroup from "./ResourceLinkGroup.vue";

const props = defineProps({model: {type: String, required: true}, id: {type: Number, required: true}, read: {type: Function, required: true},
    documentId: {type: Number, default: 0}, pageSize: {type: Number, default: 10}, changes: {type: Number, default: 0}, outsidePlan: Boolean,
    grouped: Boolean, pinned: Boolean, onlyKinds: {type: Array, default: () => []}, linkAttribute: {type: String, default: "data-resource-link"}, empty: {type: String, default: ""}});
const emit = defineEmits(["open"]);
const rows = ref([]);
const categories = ref({});
const total = ref(0);
const kind = ref("");
const nextPage = ref(null);
const loading = ref(false);
const failure = ref("");
let reading = 0;
const labels = {doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases"};
const kindLabel = (value) => labels[value] || `${value.replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase())}s`;
const options = computed(() => [{key: "", label: "All", count: Object.values(categories.value).reduce((sum, count) => sum + count, 0)},
    ...Object.entries(categories.value).filter(([key]) => !props.onlyKinds.length || props.onlyKinds.includes(key)).map(([key, count]) => ({key, label: kindLabel(key), count}))]);
const groups = computed(() => {
    const counts = Object.keys(categories.value).length ? categories.value : Object.fromEntries([...new Set(rows.value.map((row) => row.endpoint.model))].map((model) => [model, rows.value.filter((row) => row.endpoint.model === model).length]));
    const order = {doc: 0, task: 1, message: 2};
    return Object.entries(counts).sort(([left], [right]) => (order[left] ?? 3) - (order[right] ?? 3)).map(([model, count]) => ({model, count, rows: rows.value.filter((row) => row.endpoint.model === model)}));
});
const unavailable = (row) => row.endpoint.unavailable || !row.endpoint.open_ref;
const attributes = (row) => ({[props.linkAttribute]: true, "data-link-model": row.endpoint.model, "data-link-id": row.endpoint.id});
const description = (row) => `${row.endpoint.model === "doc" && row.endpoint.id === props.documentId ? "Design document" : row.endpoint.model.replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase())} ${row.endpoint.id}, ${row.relations.map((relation) => relation.replaceAll("_", " ")).join(", ")}`;

async function load(page = 1) {
    const turn = ++reading;
    loading.value = true;
    failure.value = "";
    const line = ["link", "list", "--row", `${props.model}:${props.id}`, "--group-counterparts", "--page", String(page), "--page-size", String(props.pageSize)];
    if (props.outsidePlan) line.push("--outside-plan");
    if (props.documentId) line.push("--first-counterpart", `doc:${props.documentId}`);
    if (kind.value) line.push("--kind", kind.value);
    try {
        const answer = await props.read(line);
        if (turn !== reading) return;
        if (!answer.ok) {
            failure.value = answer.error;
            return;
        }
        const incoming = answer.value.counterparts ?? [];
        const combined = page === 1 ? incoming : [...rows.value, ...incoming];
        rows.value = [...new Map(combined.map((row) => [`${row.endpoint.model}:${row.endpoint.id}`, row])).values()];
        categories.value = answer.value.categories ?? {};
        total.value = answer.value.total;
        nextPage.value = answer.value.next_page ?? null;
    } catch (error) {
        if (turn === reading) failure.value = error.message;
    } finally {
        if (turn === reading) loading.value = false;
    }
}

function open(row) {
    if (unavailable(row)) return;
    const [table, id] = row.endpoint.open_ref.split(":");
    emit("open", {table, id: Number(id)});
}
function pick(value) {
    kind.value = value;
    load();
}
const more = () => !loading.value && nextPage.value && load(nextPage.value);
const moreLabel = computed(() => `Show ${Math.min(props.pageSize, Math.max(0, total.value - rows.value.length))} more`);
watch(() => `${props.model}:${props.id}:${props.documentId}:${props.changes}:${props.outsidePlan}`, () => {
    rows.value = [];
    nextPage.value = null;
    kind.value = "";
    load();
}, {immediate: true});
</script>

<template>
    <template v-if="rows.length || loading || failure || empty">
        <section :class="['resource-links', {grouped, pinned}]" :data-loaded="rows.length" data-resource-links>
            <template v-if="options.length > 2"><Segmented :options="options" :value="kind" wrap @pick="pick" /></template>
            <div class="rows">
            <template v-if="grouped"><template v-for="group in groups" :key="group.model"><ResourceLinkGroup :model="group.model" :count="group.count" :rows="group.rows" :link-attribute="linkAttribute" :document-id="documentId" @open="open" /></template></template>
            <template v-else>
            <template v-for="row in rows" :key="`${row.endpoint.model}:${row.endpoint.id}`">
                <button type="button" class="resource-link" v-bind="attributes(row)" :disabled="unavailable(row)" @click="open(row)">
                    <span class="title">{{ row.endpoint.title }}</span>
                    <span class="relations">{{ description(row) }}<template v-if="unavailable(row)"> · Unavailable</template></span>
                </button>
            </template>
            </template>
            <template v-if="!rows.length && !loading && !failure && empty"><p>{{ empty }}</p></template>
            <MoreItems :more="Boolean(nextPage)" :loading="loading" :failure="failure" :label="moreLabel" @more="more" />
            </div>
        </section>
    </template>
</template>

<style scoped>
.resource-links {display: flex; flex-direction: column; gap: 6px;}
.resource-links.grouped {max-height: 280px; overflow-y: auto;}
.rows {display: contents;}
.resource-links.pinned {height: 100%; overflow: hidden;}
.resource-links.pinned .rows {display: flex; flex: 1; flex-direction: column; gap: 6px; min-height: 0; overflow-y: auto;}
.resource-link {display: flex; flex-direction: column; gap: 2px; padding: 5px 0; border: 0; background: none; color: var(--text-2); font: inherit; text-align: left; cursor: pointer;}
.resource-link:disabled {cursor: default; opacity: .65;}
.title {overflow: hidden; max-width: 100%; text-overflow: ellipsis; white-space: nowrap;}
.relations, p {color: var(--text-3); font-size: 12px;}
</style>

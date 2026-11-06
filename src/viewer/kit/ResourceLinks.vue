<script setup>
import {computed, ref, watch} from "vue";
import MoreItems from "./MoreItems.vue";

const props = defineProps({model: {type: String, required: true}, id: {type: Number, required: true}, read: {type: Function, required: true},
    documentId: {type: Number, default: 0}, pageSize: {type: Number, default: 10}, shownPerKind: {type: Number, default: 3}, changes: {type: Number, default: 0},
    linkAttribute: {type: String, default: "data-resource-link"}, empty: {type: String, default: ""}});
const emit = defineEmits(["open"]);
const counterparts = ref([]);
const nextPage = ref(null);
const loading = ref(false);
const failure = ref("");
let reading = 0;
const design = (row) => row.endpoint.model === "doc" && row.endpoint.id === props.documentId;
const rows = computed(() => [...counterparts.value].sort((a, b) => Number(design(b)) - Number(design(a))));
const expanded = ref(new Set());
const kindOf = (row) => (design(row) ? "design" : row.endpoint.model);
const kindLabel = (kind) => (kind === "design" ? "Design document" : kind.replaceAll("_", " "));
const groups = computed(() => {
    const byKind = new Map();
    for (const row of rows.value) byKind.set(kindOf(row), [...(byKind.get(kindOf(row)) ?? []), row]);
    return [...byKind].map(([kind, items]) => ({kind, items, shown: expanded.value.has(kind) ? items : items.slice(0, props.shownPerKind)}));
});
const expand = (kind) => (expanded.value = new Set([...expanded.value, kind]));
const unavailable = (row) => row.endpoint.unavailable || !row.endpoint.open_ref;
const attributes = (row) => ({[props.linkAttribute]: true, "data-link-model": row.endpoint.model, "data-link-id": row.endpoint.id});

async function load(page = 1) {
    const turn = ++reading;
    loading.value = true;
    failure.value = "";
    const line = ["link", "list", "--row", `${props.model}:${props.id}`, "--group-counterparts", "--page", String(page), "--page-size", String(props.pageSize)];
    if (props.documentId) line.push("--first-counterpart", `doc:${props.documentId}`);
    try {
        const answer = await props.read(line);
        if (turn !== reading) return;
        if (!answer.ok) {
            failure.value = answer.error;
            return;
        }
        const incoming = answer.value.counterparts ?? [];
        const combined = page === 1 ? incoming : [...counterparts.value, ...incoming];
        counterparts.value = [...new Map(combined.map((row) => [`${row.endpoint.model}:${row.endpoint.id}`, row])).values()];
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

const more = () => !loading.value && nextPage.value && load(nextPage.value);
watch(() => `${props.model}:${props.id}:${props.documentId}:${props.changes}`, () => {
    counterparts.value = [];
    nextPage.value = null;
    expanded.value = new Set();
    load();
}, {immediate: true});
</script>

<template>
    <template v-if="rows.length || loading || failure || empty">
        <section class="resource-links" data-resource-links>
            <template v-for="group in groups" :key="group.kind">
                <h4 class="kind" data-link-kind :data-kind="group.kind">{{ kindLabel(group.kind) }} <span class="count">{{ group.items.length }}{{ nextPage ? "+" : "" }}</span></h4>
                <template v-for="row in group.shown" :key="`${row.endpoint.model}:${row.endpoint.id}`">
                    <button type="button" class="resource-link" v-bind="attributes(row)" :disabled="unavailable(row)" @click="open(row)">
                        <span class="type">{{ design(row) ? "Design document" : row.endpoint.model.replaceAll("_", " ") }} {{ row.endpoint.id }}</span>
                        <span class="title">{{ row.endpoint.title }}</span>
                        <span class="relations">{{ row.relations.join(", ") }}</span>
                        <template v-if="unavailable(row)"><span class="unavailable">Unavailable</span></template>
                    </button>
                </template>
                <template v-if="group.shown.length < group.items.length">
                    <button type="button" class="show-more" data-link-show-more :data-kind="group.kind" @click="expand(group.kind)">Show {{ group.items.length - group.shown.length }} more</button>
                </template>
            </template>
            <template v-if="!rows.length && !loading && !failure && empty"><p>{{ empty }}</p></template>
            <MoreItems :more="Boolean(nextPage)" :loading="loading" :failure="failure" label="More linked items" @more="more" />
        </section>
    </template>
</template>

<style scoped>
.resource-links {display: flex; flex-direction: column; gap: 6px; max-height: 280px; overflow-y: auto;}
.kind {margin: 6px 0 0; font-size: 12px; font-weight: 600; text-transform: capitalize; color: var(--text-2);}
.count {color: var(--text-3); font-weight: 400;}
.show-more {align-self: flex-start; padding: 2px 0; border: 0; background: none; color: var(--accent-text); font: inherit; font-size: 12px; cursor: pointer;}
.resource-link {display: flex; align-items: baseline; flex-wrap: wrap; gap: 8px; padding: 4px 0; border: 0; background: none; color: var(--text-2); font: inherit; text-align: left; cursor: pointer;}
.resource-link:disabled {cursor: default; opacity: .65;}
.type {color: var(--accent-text); font-size: 12px;}
.title {overflow-wrap: anywhere;}
.relations, .unavailable, p {color: var(--text-3); font-size: 12px;}
</style>

<script setup>
import {computed, ref, watch} from "vue";

// the rows linked to a plan, in either direction, the design document first; a row opens as its table and number
const props = defineProps({id: {type: Number, required: true}, documentId: {type: Number, default: 0}, read: {type: Function, required: true}});
const emit = defineEmits(["open"]);
const outgoing = ref([]);
const incoming = ref([]);
const DOCUMENT_MODEL = "doc";

const linked = computed(() => {
    const rows = [
        ...incoming.value.map((link) => ({model: link.source_model, id: link.source_id, title: link.source_title, meaning: link.link_type})),
        ...outgoing.value.map((link) => ({model: link.target_model, id: link.target_id, title: link.target_title, meaning: link.link_type})),
    ];
    const unique = rows.filter((row, at) => rows.findIndex((other) => other.model === row.model && other.id === row.id) === at);
    return unique.map((row) => ({...row, design: row.model === DOCUMENT_MODEL && row.id === props.documentId})).sort((a, b) => Number(b.design) - Number(a.design));
});

async function rowsOf(flag) {
    const answer = await props.read(["link", "list", flag, `plan:${props.id}`]);
    return answer.ok ? answer.value.rows ?? [] : [];
}

async function load() {
    [incoming.value, outgoing.value] = await Promise.all([rowsOf("--target"), rowsOf("--source")]);
}

watch(() => props.id, load, {immediate: true});
</script>

<template>
    <template v-if="linked.length">
        <section class="links" data-plan-links>
            <h3 class="heading">Linked</h3>
            <ul class="list">
                <template v-for="row in linked" :key="`${row.model}:${row.id}`">
                    <li>
                        <button type="button" class="link" data-plan-link @click="emit('open', {table: `${row.model}s`, id: row.id})">
                            <span class="kind">{{ row.design ? "Design document" : row.model }} {{ row.id }}</span>
                            <span class="title">{{ row.title }}</span>
                        </button>
                    </li>
                </template>
            </ul>
        </section>
    </template>
</template>

<style scoped>
.links {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 0 0 20px;
}

.heading {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
    font-weight: 600;
}

.list {
    margin: 0;
    padding: 0;
    list-style: none;
}

.link {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
    padding: 3px 0;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.link:hover {
    color: var(--text);
}

.kind {
    flex: none;
    color: var(--accent-text);
    font-size: 12px;
}

.title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

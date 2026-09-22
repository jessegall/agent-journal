<script setup>
import {computed, reactive, watchEffect} from "vue";
import {api} from "../api/client.js";
import Icon from "../kit/Icon.vue";
import {peek} from "../route.js";
import {meta} from "../state/store.js";
import {byRef} from "../domain/records.js";
import {age} from "../format/time.js";
import ResourceBody from "./ResourceBody.vue";

const props = defineProps({resource: Object});
const emit = defineEmits(["close"]);
const fetched = reactive({});
const loading = new Set();

async function load(ref) {
    if (fetched[ref] || loading.has(ref)) return;
    loading.add(ref);
    const [type, n] = ref.split(":");
    try {
        fetched[ref] = await api.show(type, Number(n));
    } catch {
        fetched[ref] = null;
    } finally {
        loading.delete(ref);
    }
}

const refs = computed(() => props.resource.refs || []);
watchEffect(() => refs.value.filter((ref) => !byRef(ref)).forEach(load));

const members = computed(() =>
    refs.value
        .map((ref) => byRef(ref) || fetched[ref])
        .filter((r) => r && !r.deleted)
        .sort((a, b) => (b.updated || b.created) - (a.updated || a.created))
);

const firstLine = (r) =>
    String(r.abstract || r.brief || "")
        .split("\n")
        .find((line) => line.trim()) || "";
const picture = (r) => Object.keys(r.data?.pictures || {})[0] || "";
</script>

<template>
    <ResourceBody :resource="resource" :comments="false" :links="false" @close="emit('close')">
        <section class="cards" aria-label="In this group">
            <template v-if="!members.length">
                <p class="empty">
                    Nothing in this group yet. Add a row from its actions, or with journal group add {{ resource.n }} &lt;ref&gt;.
                </p>
            </template>
            <template v-for="r in members" :key="r.ref">
                <button type="button" class="card" @click="peek(r.type, r.n)">
                    <template v-if="picture(r)">
                        <img class="thumb" :src="api.fileUrl(r.type, r.n, picture(r))" :alt="picture(r)" loading="lazy" />
                    </template>
                    <span class="kind">
                        <Icon :name="meta(r.type).icon" :size="12" />
                        {{ meta(r.type).title }} {{ r.n }}
                        <span class="grow" />
                        <span class="when">{{ age(r.updated || r.created) }}</span>
                    </span>
                    <span class="title">{{ r.title }}</span>
                    <template v-if="firstLine(r)">
                        <span class="line">{{ firstLine(r) }}</span>
                    </template>
                </button>
            </template>
        </section>
    </ResourceBody>
</template>

<style scoped>
.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 10px;
    padding: 4px 0 16px;
}

.empty {
    grid-column: 1 / -1;
    color: var(--text-3);
    font-size: 13px;
}

.card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.card:hover {
    border-color: var(--border-2);
    background: #1b1c20;
}

.thumb {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 6px;
    background: var(--border);
}

.kind {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-3);
    font-size: 11px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
}

.grow {
    flex: 1;
}

.when {
    text-transform: none;
    letter-spacing: 0;
}

.title {
    font-size: 13.5px;
    font-weight: 500;
    line-height: 1.35;
}

.line {
    overflow: hidden;
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.45;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
</style>

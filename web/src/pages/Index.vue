<script setup>
import {computed, ref} from "vue";
import {create} from "../api.js";
import Btn from "../kit/Btn.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {go, route} from "../route.js";
import {load, meta, open, rows, word} from "../store.js";
import RowGroups from "../resource/RowGroups.vue";
import ResourceCard from "../resource/ResourceCard.vue";
import NewResource from "../resource/NewResource.vue";

const props = defineProps({type: String});
const kind = computed(() => meta(props.type));
const archive = ref(false);
const adding = ref(false);
const all = computed(() => rows(props.type));
const shown = computed(() => (archive.value ? all.value.filter((r) => r.completed) : open(props.type)));
const groups = computed(() => {
    const named = {started: "In progress", asked: "Waiting on you", blocked: "Blocked"};
    const of = (r) =>
        r.data.blocked
            ? "blocked"
            : r.data.status === "started"
              ? "started"
              : rows("question").some((q) => !q.completed && q.refs.includes(r.ref))
                ? "asked"
                : "open";
    const buckets = {};
    for (const r of shown.value) (buckets[of(r)] ||= []).push(r);
    return Object.entries(buckets).map(([k, list]) => ({
        key: k,
        title: named[k] || (archive.value ? word(props.type, "complete").replace(/^\w/, (c) => c.toUpperCase()) : "Open"),
        list,
    }));
});

async function select(n) {
    adding.value = false;
    await load(props.type);
    go(route.value.env, props.type, n);
}
</script>

<template>
    <section class="index">
        <div class="bar">
            <span class="count">{{ all.length }} {{ kind.title.toLowerCase() }}s, {{ open(type).length }} open</span>
            <span class="sep" />
            <button type="button" :class="['flat', {on: archive}]" @click="archive = !archive">Archive</button>
            <span class="grow" />
            <Btn kind="primary" @click="adding = true">New {{ kind.title.toLowerCase() }}</Btn>
        </div>
        <template v-if="adding">
            <NewResource :type="type" @made="select" @close="adding = false" />
        </template>
        <template v-if="!shown.length">
            <p class="empty">No {{ kind.title.toLowerCase() }}s {{ archive ? "archived" : "on this environment" }} yet.</p>
        </template>
        <SwitchCase :value="kind.view">
            <template #document>
                <div class="cards">
                    <template v-for="r in shown" :key="r.n">
                        <ResourceCard :resource="r" @click="go(route.env, type, r.n)" />
                    </template>
                </div>
            </template>
            <template #default>
                <RowGroups :groups="groups" :type="type" />
            </template>
        </SwitchCase>
    </section>
</template>

<style scoped>
.bar {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 44px;
    padding: 0 14px 0 22px;
    border-bottom: 1px solid var(--border);
    color: var(--text-2);
}

.sep {
    width: 1px;
    height: 16px;
    background: var(--border-2);
}

.flat {
    border: 0;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.flat.on,
.flat:hover {
    color: var(--text);
}

.grow {
    flex: 1;
}

.empty {
    margin: 18px 22px;
    color: var(--text-3);
}

.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 12px;
    padding: 18px 22px;
}
</style>

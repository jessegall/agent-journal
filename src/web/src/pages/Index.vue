<script setup>
import EmptyState from "../kit/EmptyState.vue";
import TabBar from "../kit/TabBar.vue";
import {useSighted} from "../composables/scrollback.js";
import {computed, onUnmounted, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {go, route} from "../route.js";
import {groupOf, GROUPS, open} from "../domain/records.js";
import {counted, meta, word} from "../state/store.js";
import {earlier, paging, rows} from "../sync/rows.js";
import RowGroups from "../resource/RowGroups.vue";
import ResourceCard from "../resource/ResourceCard.vue";
import CheckCard from "../resource/CheckCard.vue";
import NewResource from "../resource/NewResource.vue";

const props = defineProps({type: String});
const kind = computed(() => meta(props.type));
const filter = ref("open");
const adding = ref(false);
const all = computed(() => rows(props.type).filter((r) => !r.deleted));
const SHOWS = {open: () => open(props.type), closed: () => all.value.filter((r) => r.completed), every: () => all.value};
const COUNTS = {
    open: () => counted(props.type, "open"),
    closed: () => counted(props.type, "all") - counted(props.type, "open"),
    every: () => counted(props.type, "all"),
};
const filters = computed(() => (kind.value.filters || []).map((f) => ({...f, count: (COUNTS[f.shows] || COUNTS.every)()})));
const end = ref(null);
const scrolled = ref(false);
const moved = () => (scrolled.value = true);
useSighted(end, () => scrolled.value && paging.more[props.type] && earlier(props.type));
window.addEventListener("wheel", moved, {passive: true});
window.addEventListener("touchmove", moved, {passive: true});
onUnmounted(() => {
    window.removeEventListener("wheel", moved);
    window.removeEventListener("touchmove", moved);
});
const listed = computed(() =>
    [...(kind.value.filters?.length ? SHOWS[filter.value] || SHOWS.open : SHOWS.every)()]
        .filter((r) => !r.data?.hidden)
        .sort((a, b) => b.created - a.created || b.n - a.n)
);
const groups = computed(() => {
    const buckets = {};
    for (const r of listed.value) (buckets[groupOf(r)] ||= []).push(r);
    return Object.keys(GROUPS)
        .filter((k) => buckets[k])
        .map((k) => ({
            key: k,
            title:
                k === "open" && filter.value !== "open" ? word(props.type, "complete").replace(/^\w/, (c) => c.toUpperCase()) : GROUPS[k],
            list: buckets[k],
        }));
});

async function select(n) {
    adding.value = false;
    go(route.value.env, props.type, n);
}
</script>

<template>
    <section class="index">
        <div class="bar">
            <TabBar v-model="filter" :tabs="filters" />
            <template v-if="kind.view === 'document'">
                <span class="sep" />
                <a class="flat" :href="`#/${route.env}/files`">Files</a>
            </template>
            <span class="grow" />
            <template v-if="kind.created_in_viewer">
                <Btn kind="primary" @click="adding = true">
                    <Icon name="plus" :size="12" />
                    New {{ kind.title.toLowerCase() }}
                </Btn>
            </template>
        </div>
        <template v-if="adding">
            <NewResource :type="type" @made="select" @close="adding = false" />
        </template>
        <template v-if="!listed.length">
            <EmptyState class="empty">
                No {{ kind.title.toLowerCase() }}s
                {{
                    filter === "open"
                        ? all.length
                            ? "open"
                            : "on this environment"
                        : filters.find((f) => f.key === filter).title.toLowerCase()
                }}{{ filter !== "open" || !all.length ? " yet" : "" }}.
            </EmptyState>
        </template>
        <SwitchCase :value="kind.listed_as_cards ? 'document' : kind.view">
            <template #document>
                <div class="cards">
                    <template v-for="r in listed" :key="r.n">
                        <ResourceCard :resource="r" @click="go(route.env, type, r.n)" />
                    </template>
                </div>
            </template>
            <template #check>
                <div class="cards">
                    <template v-for="r in listed" :key="r.n">
                        <CheckCard :resource="r" @click="go(route.env, type, r.n)" />
                    </template>
                </div>
            </template>
            <template #default>
                <RowGroups :groups="groups" :type="type" />
            </template>
        </SwitchCase>
        <div ref="end" class="end" />
    </section>
</template>

<style scoped>
.bar {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 12px;
    height: 44px;
    padding: 0 14px 0 22px;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
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
}

.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 12px;
    padding: 18px 22px;
}
.index {
    --sticky-top: 44px;
}
</style>

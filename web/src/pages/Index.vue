<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {create} from "../api.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {go, route} from "../route.js";
import {counted, earlier, GROUPS, groupOf, load, meta, open, paging, rows, word} from "../store.js";
import RowGroups from "../resource/RowGroups.vue";
import ResourceCard from "../resource/ResourceCard.vue";
import NewResource from "../resource/NewResource.vue";

const props = defineProps({type: String});
const kind = computed(() => meta(props.type));
const filter = ref("open");
const adding = ref(false);
const all = computed(() => rows(props.type));
const SHOWS = {open: () => open(props.type), closed: () => all.value.filter((r) => r.completed), every: () => all.value};
const COUNTS = {
    open: () => counted(props.type, "open"),
    closed: () => counted(props.type, "all") - counted(props.type, "open"),
    every: () => counted(props.type, "all"),
};
const filters = computed(() => (kind.value.filters || []).map((f) => ({...f, count: (COUNTS[f.shows] || COUNTS.every)()})));
const end = ref(null);
let watcher = null;
watch(end, (el) => {
    if (watcher) watcher.disconnect();
    if (!el) return;
    watcher = new IntersectionObserver((seen) => seen.some((e) => e.isIntersecting) && paging.more[props.type] && earlier(props.type));
    watcher.observe(el);
});
onUnmounted(() => watcher && watcher.disconnect());
const shown = computed(() => [...(SHOWS[filter.value] || SHOWS.open)()].sort((a, b) => b.created - a.created));
const groups = computed(() => {
    const buckets = {};
    for (const r of shown.value) (buckets[groupOf(r)] ||= []).push(r);
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
    await load(props.type);
    go(route.value.env, props.type, n);
}
</script>

<template>
    <section class="index">
        <div class="bar">
            <div class="tabs" role="tablist">
                <template v-for="f in filters" :key="f.key">
                    <button
                        type="button"
                        role="tab"
                        :aria-selected="filter === f.key"
                        :class="['tab', {on: filter === f.key}]"
                        @click="filter = f.key"
                    >
                        {{ f.title }}
                        <span class="tab-n">{{ f.count }}</span>
                    </button>
                </template>
            </div>
            <template v-if="kind.view === 'document'">
                <span class="sep" />
                <a class="flat" :href="`#/${route.env}/files`">Files</a>
            </template>
            <span class="grow" />
            <Btn kind="primary" @click="adding = true">
                <Icon name="plus" :size="12" />
                New {{ kind.title.toLowerCase() }}
            </Btn>
        </div>
        <template v-if="adding">
            <NewResource :type="type" @made="select" @close="adding = false" />
        </template>
        <template v-if="!shown.length">
            <p class="empty">
                No {{ kind.title.toLowerCase() }}s
                {{
                    filter === "open"
                        ? all.length
                            ? "open"
                            : "on this environment"
                        : filters.find((f) => f.key === filter).title.toLowerCase()
                }}{{ filter !== "open" || !all.length ? " yet" : "" }}.
            </p>
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
        <div ref="end" class="end" />
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

.tabs {
    display: flex;
    align-items: stretch;
    align-self: stretch;
    gap: 14px;
}

.tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0;
    border: 0;
    border-bottom: 2px solid transparent;
    background: none;
    color: var(--text-3);
    font-size: 11.5px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    cursor: pointer;
}

.tab:hover {
    color: var(--text-2);
}

.tab.on {
    border-bottom-color: var(--accent);
    color: var(--text);
}

.tab-n {
    font-size: 11px;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

.tab.on .tab-n {
    color: var(--accent-text);
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

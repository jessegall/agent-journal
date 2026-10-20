<script setup>
import {meta} from "../domain/tables.js";
import {store} from "../state/store.js";
import EmptyState from "../kit/EmptyState.vue";
import TabBar from "../kit/TabBar.vue";
import PagedList from "../kit/PagedList.vue";
import {computed, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {go, href, peek, route} from "../route.js";
import {groupOf, GROUPS, listedOpen, recordCount} from "../domain/records.js";
import {closedAt, createdAt, isClosed} from "../domain/row.js";
import {closedEarlier, closedFirst, closedHasMore, earlier, hasLoaded, rows} from "../sync/rows.js";
import RowGroups from "../resource/RowGroups.vue";
import ResourceCard from "../resource/ResourceCard.vue";
import ResourceEnd from "../resource/ResourceEnd.vue";
import CheckCard from "../resource/CheckCard.vue";
import NewResource from "../resource/NewResource.vue";
import TextInput from "../kit/TextInput.vue";
import Segmented from "../kit/Segmented.vue";
import DocumentLibrary from "./DocumentLibrary.vue";
import {useSlashFocus} from "../composables/slashFocus.js";

const props = defineProps({table: String});
const kind = computed(() => meta(props.table));
const filter = ref("open");
const adding = ref(false);
const all = computed(() => rows(props.table));
const SHOWS = {
    open: () => listedOpen(props.table),
    closed: () => all.value.filter(isClosed),
    every: () => all.value,
};
const COUNTS = {
    open: () => recordCount(props.table, "open"),
    closed: () => recordCount(props.table, "all") - recordCount(props.table, "open"),
    every: () => recordCount(props.table, "all"),
};
const filters = computed(() => kind.value.filters.map((f) => ({...f, count: (COUNTS[f.shows] || COUNTS.every)()})));
watch(
    () => [route.value.sub, props.table],
    ([sub]) => (filter.value = filters.value.some((f) => f.key === sub) ? sub : "open"),
    {immediate: true}
);
const library = computed(() => props.table === "docs");
const query = ref("");
const order = ref("recent");
const ORDERS = [
    {key: "recent", label: "Newest"},
    {key: "title", label: "A to Z"},
];
const search = ref(null);
const libraryPane = ref(null);
watch(
    library,
    async (on) => {
        while (on && store.paging.more[props.table] && (await earlier(props.table)));
    },
    {immediate: true}
);
useSlashFocus(search, () => library.value);
const closedTab = computed(() => filter.value === "closed");
const loadMore = () => (closedTab.value ? closedEarlier(props.table) : earlier(props.table));
const moreToLoad = computed(() => (closedTab.value ? closedHasMore(props.table) : Boolean(store.paging.more[props.table])) && listed.value.length < total.value);
watch(
    [closedTab, () => props.table],
    ([on]) => on && closedFirst(props.table),
    {immediate: true}
);
const listed = computed(() =>
    [...(kind.value.filters.length ? SHOWS[filter.value] || SHOWS.open : SHOWS.every)()].sort(
        (a, b) => (closedTab.value ? closedAt(b) - closedAt(a) : 0) || createdAt(b) - createdAt(a) || b.id - a.id
    )
);

const total = computed(() => (kind.value.filters.length ? COUNTS[filter.value] || COUNTS.every : COUNTS.every)());

const groups = computed(() => {
    if (props.table !== "tasks" || closedTab.value) return [{key: "all", title: closedTab.value ? "Closed" : kind.value.title + "s", count: total.value, list: listed.value}];
    const buckets = {};
    for (const r of listed.value) (buckets[groupOf(r)] ||= []).push(r);
    return Object.keys(GROUPS)
        .filter((k) => buckets[k])
        .map((k) => ({key: k, title: GROUPS[k], count: k === "open" && Object.keys(buckets).length === 1 ? total.value : undefined, list: buckets[k]}));
});

function select(id) {
    adding.value = false;
    go(props.table, id);
}
</script>

<template>
    <section class="index">
        <div :class="['bar', {library}]">
            <template v-if="library">
                <TextInput
                    ref="search"
                    class="search"
                    icon="search"
                    type="search"
                    :value="query"
                    placeholder="Search titles and text"
                    aria-label="Find a document"
                    @input="query = $event.target.value"
                    @keydown.esc="query ? (query = '') : $event.target.blur()"
                    @keydown.down.prevent="libraryPane?.focusFirst()"
                />
                <Segmented class="order" :options="ORDERS" :value="order" @pick="order = $event" />
            </template>
            <template v-else>
                <TabBar v-model="filter" :tabs="filters" />
            </template>
            <template v-if="kind.view === 'document'">
                <span class="sep" />
                <a class="flat" :href="href.page('attachments')">Attachments</a>
            </template>
            <span class="grow" />
            <template v-if="kind.created_in_viewer">
                <Btn kind="primary" @click="adding = true">
                    <Icon name="plus" :size="12" />
                    <span class="new-word">New {{ kind.title.toLowerCase() }}</span>
                </Btn>
            </template>
        </div>
        <template v-if="adding">
            <NewResource :table="table" @made="select" @close="adding = false" />
        </template>
        <template v-if="!listed.length && !library">
            <EmptyState class="empty" :loading="!hasLoaded(table)">
                No {{ kind.title.toLowerCase() }}s
                {{ filter === "open" ? (all.length ? "open" : "on this environment") : "closed" }}{{ filter !== "open" || !all.length ? " yet" : "" }}.
            </EmptyState>
        </template>
        <PagedList :shown="listed.length" :total="total" :more="moreToLoad" :load="loadMore">
            <SwitchCase :value="library ? 'library' : kind.listed_as_cards ? 'document' : kind.view">
                <template #library>
                    <DocumentLibrary
                        ref="libraryPane"
                        :docs="listed"
                        :query="query"
                        :order="order"
                        @open="(d) => peek('docs', d.id)"
                        @clear="query = ''"
                        @new="adding = true"
                    />
                </template>
                <template #document>
                    <div class="cards">
                        <template v-for="r in listed" :key="r.id">
                            <div class="card-wrap">
                                <ResourceCard :resource="r" @click="go(table, r.id)" />
                                <ResourceEnd :resource="r" />
                            </div>
                        </template>
                    </div>
                </template>
                <template #check>
                    <div class="cards">
                        <template v-for="r in listed" :key="r.id">
                            <CheckCard :resource="r" @click="go(table, r.id)" />
                        </template>
                    </div>
                </template>
                <template #default>
                    <RowGroups :groups="groups" :table="table" />
                </template>
            </SwitchCase>
        </PagedList>
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

.search {
    flex: 0 1 460px;
}

.order {
    flex: none;
}

@media (max-width: 640px) {
    .bar.library {
        gap: 8px;
        padding: 0 10px;
    }

    .bar.library .sep,
    .bar.library .new-word {
        display: none;
    }
}

.card-wrap {
    position: relative;
    display: flex;
}

.card-wrap > :first-child {
    flex: 1;
}

.card-wrap.shipped > :first-child {
    padding-bottom: 36px;
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

<script setup>
import EmptyState from "../kit/EmptyState.vue";
import TabBar from "../kit/TabBar.vue";
import {useSighted} from "../composables/scrollback.js";
import {computed, onUnmounted, ref, watch} from "vue";
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
import TextInput from "../kit/TextInput.vue";
import Segmented from "../kit/Segmented.vue";
import DocumentLibrary from "./DocumentLibrary.vue";

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
const library = computed(() => props.type === "doc");
const query = ref("");
const order = ref("recent");
const ORDERS = [
    {key: "recent", label: "Newest"},
    {key: "title", label: "A to Z"},
];
const search = ref(null);
watch(
    library,
    async (on) => {
        while (on && paging.more[props.type] && (await earlier(props.type)));
    },
    {immediate: true}
);
const TYPING = ["INPUT", "TEXTAREA", "SELECT"];
function slash(event) {
    if (!library.value || event.key !== "/" || TYPING.includes(event.target.tagName) || event.target.isContentEditable) return;
    event.preventDefault();
    search.value?.focus();
}
window.addEventListener("keydown", slash);
const end = ref(null);
const scrolled = ref(false);
const moved = () => (scrolled.value = true);
useSighted(end, () => scrolled.value && paging.more[props.type] && earlier(props.type));
window.addEventListener("wheel", moved, {passive: true});
window.addEventListener("touchmove", moved, {passive: true});
onUnmounted(() => {
    window.removeEventListener("wheel", moved);
    window.removeEventListener("touchmove", moved);
    window.removeEventListener("keydown", slash);
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

const startNew = () => (props.type === "board" ? go(route.value.env, "kanban", 0, "new") : (adding.value = true));
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
                    placeholder="Search titles, text and files"
                    aria-label="Find a document"
                    @input="query = $event.target.value"
                    @keydown.esc="query = ''"
                />
                <Segmented class="order" :options="ORDERS" :value="order" @pick="order = $event" />
            </template>
            <template v-else>
                <TabBar v-model="filter" :tabs="filters" />
            </template>
            <template v-if="kind.view === 'document'">
                <span class="sep" />
                <a class="flat" :href="`#/${route.env}/files`">Files</a>
            </template>
            <span class="grow" />
            <template v-if="kind.created_in_viewer">
                <Btn kind="primary" @click="startNew">
                    <Icon name="plus" :size="12" />
                    <span class="new-word">New {{ kind.title.toLowerCase() }}</span>
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
        <SwitchCase :value="library ? 'library' : kind.listed_as_cards ? 'document' : kind.view">
            <template #library>
                <DocumentLibrary :docs="listed" :query="query" :order="order" @open="(d) => select(d.n)" @clear="query = ''" />
            </template>
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

    .bar.library .order,
    .bar.library .sep,
    .bar.library .new-word {
        display: none;
    }
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

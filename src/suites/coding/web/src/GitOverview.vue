<script setup>
import {computed, ref, watch} from "vue";
import {Btn, EmptyState, FilterBar, ListReaderLayout, PageHeader, Segmented, Skeleton, TimeAgo, applyFilter, defaultFilter, optionsOf, useWindow} from "@journal/window-kit";
import GitReader from "./GitReader.vue";
import {TABS, branchItem, commitItem, gitMenu, itemFields, pullItem} from "./gitItems.js";

// the Git window: commits, branches and pull requests, each a list with a reader beside it. Show changes goes to the Files page, where the changed files are marked
const LIST_WIDTH = 460;
const view = useWindow();

function pagedList(key) {
    const prop = view.props[key];
    const rows = ref([]);
    watch(prop.data, (page) => {
        if (page) rows.value = view.state[`${key}.skip`] ? [...rows.value, ...page.rows] : page.rows;
    }, {immediate: true});
    const load = () => {
        view.state[`${key}.skip`] = String(rows.value.length);
        return view.reload(key);
    };
    return {...prop, rows, load, more: computed(() => prop.data.value?.is_last_page === false)};
}

const branches = pagedList("branches");
const commits = pagedList("commits");
const {data: pulls, failure: pullsFailure} = view.props.pulls;
const tab = ref("commits");
const chosen = ref(null);
const filter = ref(defaultFilter([]));
const words = ref("");

const LISTS = {
    commits: {title: "Commits", source: commits, items: computed(() => commits.rows.value.map(commitItem)), none: "The current branch has no commits yet.", failure: computed(() => commits.failure.value), loaded: computed(() => commits.loaded.value)},
    branches: {title: "Branches", source: branches, items: computed(() => branches.rows.value.map(branchItem)), none: "This project has no branches yet.", failure: computed(() => branches.failure.value), loaded: computed(() => branches.loaded.value)},
    pulls: {title: "Pull requests", source: null, items: computed(() => (pulls.value?.available ? pulls.value.rows.map(pullItem) : [])), none: "No pull request is open.", failure: computed(() => pullsFailure.value || (pulls.value && !pulls.value.available ? "The pull requests are read through gh, which is not installed or not signed in here." : "")), loaded: computed(() => Boolean(pulls.value))},
};
const current = computed(() => LISTS[tab.value]);
const failure = computed(() => current.value.failure.value);
const loaded = computed(() => current.value.loaded.value);
const none = computed(() => current.value.none);
const items = computed(() => current.value.items.value);
const fields = computed(() => itemFields[tab.value].map((field) => ({...field, options: field.options ?? optionsOf(items.value, (item) => [field.get(item)])})));
const shown = computed(() => applyFilter(items.value, fields.value, filter.value, words.value, ["title", "desc"]));
const tabs = computed(() => TABS.map((each) => ({...each, count: LISTS[each.key].items.value.length})));
const pick = (key) => {
    tab.value = key;
    chosen.value = null;
    filter.value = defaultFilter([]);
    words.value = "";
};
const more = computed(() => (tab.value === "pulls" ? false : current.value.source.more.value));
const loadMore = () => current.value.source.load();
const showChanges = () => location.assign(`?page=${view.links.files}`);
const menuOf = (item, open = null) => gitMenu(item, {open, showChanges});
const place = (item) => ({head: item.title, items: menuOf(item, () => (chosen.value = item.id))});
</script>

<template>
    <ListReaderLayout v-model:chosen="chosen" :items="shown" :list-width="LIST_WIDTH" :place="place" :empty-title="none" pick-line="Choose an item" data-git>
        <template #top>
            <PageHeader title="Git" />
            <Segmented :options="tabs" :value="tab" data-git-tabs @pick="pick" />
            <FilterBar v-model="filter" v-model:words="words" :fields="fields" :rows="items" :shown="shown.length" placeholder="Search" />
            <p v-if="failure" class="note" role="alert">{{ failure }}</p>
            <Btn v-if="more" small data-git-more @click="loadMore">Show more</Btn>
        </template>
        <template #empty>
            <Skeleton v-if="!loaded" shape="rows" />
            <EmptyState v-else-if="!failure">{{ none }}</EmptyState>
        </template>
        <template #meta="{item}">
            <TimeAgo v-if="item.row.time" class="age" :at="item.row.time" />
        </template>
        <template #reader="{item}">
            <GitReader :item="item" :items="menuOf(item)" @changes="showChanges" />
        </template>
    </ListReaderLayout>
</template>

<style scoped>
.note {
    margin: 0;
    padding: 6px var(--inset);
    color: var(--text-2);
    font-size: 12.5px;
}

.age {
    color: var(--text-3);
    font-size: 12px;
    white-space: nowrap;
}
</style>

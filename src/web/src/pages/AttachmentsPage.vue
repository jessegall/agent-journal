<script setup>
import {meta} from "../domain/tables.js";
import {computed, reactive, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import EmptyState from "../kit/EmptyState.vue";
import PagedList from "../kit/PagedList.vue";
import SectionHeading from "../kit/SectionHeading.vue";
import Segmented from "../kit/Segmented.vue";
import TextInput from "../kit/TextInput.vue";
import FileTile from "../resource/FileTile.vue";
import FileRow from "../resource/FileRow.vue";
import {api} from "../api/client.js";
import {href, route} from "../route.js";
import {ageGroups} from "../format/time.js";
import {openFiles} from "../platform/view.js";
import {useSlashFocus} from "../composables/slashFocus.js";

const PAGE = 60;
const SEARCH_WAIT = 250;
const query = ref("");
const kind = ref("all");
const shelf = ref("");
const search = ref(null);
useSlashFocus(search);

const counts = ref(null);
const views = reactive({});
const words = computed(() => query.value.trim());
const key = computed(() => `${kind.value}|${shelf.value}|${words.value}`);
const view = computed(() => views[key.value] || null);

// A file is served under its row, so the address names the environment for the browser to open it.
const addressed = (file) => {
    const [table, id] = file.row.split(":");
    return {...file, url: api.fileUrl(table, Number(id), file.name)};
};

async function fetchPage(at, skip) {
    const asked = {kind: kind.value, shelf: shelf.value, search: words.value, last: PAGE, skip};
    const got = await api.attachments(asked);
    const held = views[at] || {files: []};
    views[at] = {files: [...held.files, ...got.files.map(addressed)], more: !got.is_last_page, found: got.found};
    counts.value = got.counts;
}

let waiting = 0;
function open() {
    clearTimeout(waiting);
    if (views[key.value]) return;
    const at = key.value;
    waiting = setTimeout(() => fetchPage(at, 0), words.value ? SEARCH_WAIT : 0);
}
watch(key, open, {immediate: true});

const loadMore = () => fetchPage(key.value, view.value.files.length);
const kinds = computed(() => [
    {key: "all", label: `All ${counts.value ? counts.value.all : ""}`.trim()},
    {key: "images", label: `Images ${counts.value ? counts.value.images : ""}`.trim()},
    {key: "other", label: `Other files ${counts.value ? counts.value.other : ""}`.trim()},
]);
const shelves = computed(() => [
    {key: "", label: `Anywhere ${Object.values(counts.value ? counts.value.shelves : {}).reduce((sum, n) => sum + n, 0)}`},
    ...Object.entries(counts.value ? counts.value.shelves : {})
        .sort((a, b) => b[1] - a[1])
        .map(([type, n]) => ({key: type, label: `${meta(type)?.title || type}s ${n}`})),
]);
const listedFiles = computed(() => (view.value ? view.value.files : []));
const groups = computed(() =>
    ageGroups(listedFiles.value, (f) => f.time).map((g) => ({
        ...g,
        images: g.list.filter((f) => f.image),
        others: g.list.filter((f) => !f.image),
    }))
);
const show = (f) =>
    openFiles(
        listedFiles.value.map((listed) => ({name: listed.name, url: listed.url})),
        listedFiles.value.indexOf(f)
    );
const pickKind = (picked) => {
    kind.value = picked;
    shelf.value = "";
};
</script>

<template>
    <section class="files">
        <div class="bar">
            <TextInput
                ref="search"
                class="search"
                icon="search"
                type="search"
                :value="query"
                placeholder="Search file names, descriptions and attached items"
                aria-label="Find a file"
                @input="query = $event.target.value"
                @keydown.esc="query = ''"
            />
            <Segmented class="kinds" :options="kinds" :value="kind" @pick="pickKind" />
            <span class="grow" />
            <a class="flat" :href="href.page('doc')">Documents</a>
        </div>
        <template v-if="!view">
            <EmptyState class="none" loading shape="rows" />
        </template>
        <template v-else-if="counts && !counts.all">
            <EmptyState class="none">No files are stored on this environment yet. Files attached to a message or added to a document show here.</EmptyState>
        </template>
        <template v-else>
            <nav class="shelves" aria-label="Attachments">
                <span class="shelves-label">Attached to</span>
                <Segmented :options="shelves" :value="shelf" @pick="shelf = $event" />
            </nav>
            <template v-if="!listedFiles.length">
                <EmptyState class="none">
                    No file matches “{{ words }}”.
                    <Btn small @click="query = ''">Clear the search</Btn>
                </EmptyState>
            </template>
            <template v-if="words && listedFiles.length">
                <SectionHeading class="group-head">
                    {{ view.total }} {{ view.total === 1 ? "file matches" : "files match" }}
                </SectionHeading>
            </template>
            <PagedList :shown="listedFiles.length" :total="view.total" :more="view.more" :load="loadMore">
                <template v-for="g in groups" :key="g.title">
                    <section class="group">
                        <SectionHeading class="group-head">
                            {{ g.title }}
                            <span class="group-n">{{ g.list.length }}</span>
                        </SectionHeading>
                        <template v-if="g.images.length">
                            <div class="gallery">
                                <template v-for="f in g.images" :key="f.url">
                                    <FileTile :file="f" @view="show(f)" />
                                </template>
                            </div>
                        </template>
                        <template v-if="g.others.length">
                            <div class="rows">
                                <template v-for="f in g.others" :key="f.url">
                                    <FileRow :file="f" @view="show(f)" />
                                </template>
                            </div>
                        </template>
                    </section>
                </template>
            </PagedList>
        </template>
    </section>
</template>

<style scoped>
.files {
    --sticky-top: 44px;
    padding-bottom: 40px;
}

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

.search {
    flex: 0 1 460px;
}

.kinds {
    flex: none;
}

.grow {
    flex: 1;
}

.flat {
    color: var(--text-3);
}

.flat:hover {
    color: var(--text);
}

.shelves {
    display: flex;
    align-items: center;
    gap: 10px;
    overflow-x: auto;
    padding: 18px 22px 4px;
    scrollbar-width: none;
    white-space: nowrap;
}

.shelves-label {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
}

.group {
    max-width: 1100px;
    margin-top: 14px;
    padding: 0 22px;
}

.group-head {
    position: sticky;
    top: var(--sticky-top);
    z-index: 1;
    margin: 0;
    padding: 8px 0 8px;
    background: var(--bg);
}

.files > .group-head {
    position: static;
    padding: 18px 22px 0;
}

.group-n {
    margin-left: 4px;
    color: var(--text-4);
    font-weight: 400;
}

.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 22px 16px;
    padding: 4px 0 10px;
}

.rows {
    margin: 4px -14px 0;
}

.none {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin: 18px 22px;
}

@media (max-width: 640px) {
    .files {
        --sticky-top: 88px;
    }

    .bar {
        flex-wrap: wrap;
        gap: 8px;
        height: auto;
        padding: 6px 10px;
    }

    .flat,
    .grow {
        display: none;
    }

    .search {
        flex: 1 1 100%;
    }

    .shelves {
        padding: 14px 12px 4px;
    }

    .group {
        padding: 0 12px;
    }

    .gallery {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px 12px;
    }

    .rows {
        margin: 4px -12px 0;
    }
}
</style>

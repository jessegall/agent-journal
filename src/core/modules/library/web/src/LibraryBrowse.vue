<script setup>
import {ref, watch} from "vue";
import {Btn, RowList, SearchBar, Segmented, SidePanel, TimeAgo, useRunLine, useWindow} from "@journal/window-kit";

const TYPES = [
    {key: "", label: "All"},
    {key: "doc", label: "Documents"},
    {key: "sequence", label: "Sequences"},
    {key: "check", label: "Checks"},
];
const TYPE_WORDS = {doc: "Document", sequence: "Sequence", check: "Check"};
const SEARCH_DELAY_MILLISECONDS = 300;

// what the shared server holds, read live: the journal reads it for this page, so the browser holds no token
const props = defineProps({role: {type: String, required: true}, canWrite: Boolean});
const context = useWindow();
const type = ref("");
const search = ref("");
const rows = ref([]);
const loaded = ref(false);
const failure = ref("");
const opened = ref(null);
const versions = ref([]);
const checking = ref(null);
const emit = defineEmits(["changed"]);
const {refusal, run} = useRunLine(async () => {
    await load();
    emit("changed");
});
let delay = 0;

const key = (row) => `${row.share}:${row.id}`;

async function load() {
    if (type.value) context.state["listing.type"] = type.value;
    else delete context.state["listing.type"];
    if (search.value.trim()) context.state["listing.search"] = search.value.trim();
    else delete context.state["listing.search"];
    await context.reload("listing");
    const listing = context.props.listing;
    failure.value = listing.failure.value;
    const listed = failure.value ? [] : listing.data.value.rows;
    rows.value = [...new Map(listed.map((row) => [key(row), row])).values()].map((row) => ({...row, item_id: row.id, id: key(row)}));
    loaded.value = true;
}

async function open(row) {
    context.state["inspection.share"] = row.share;
    context.state["inspection.id"] = String(row.item_id);
    await context.reload("inspection");
    const inspection = context.props.inspection;
    refusal.value = inspection.failure.value;
    opened.value = refusal.value ? null : {...inspection.data.value.item, title: row.title};
    versions.value = refusal.value ? [] : inspection.data.value.versions;
}

async function reopen() {
    const item = opened.value;
    await open({share: item.share, item_id: item.id, title: item.title});
}

async function remove(row) {
    const answer = await run(["library", "remove", row.share, String(row.item_id ?? row.id)]);
    if (answer.ok && opened.value) await reopen();
}

async function restore(item, version = null) {
    const answer = await run(["library", "restore", item.share, String(item.id), ...(version ? ["--version", String(version)] : [])]);
    if (answer.ok) await reopen();
}

// a check runs on this computer, so its command is read before it is got
async function openCheck(row) {
    context.state["item.share"] = "check";
    context.state["item.id"] = String(row.item_id);
    await context.reload("item");
    const item = context.props.item;
    refusal.value = item.failure.value;
    checking.value = item.failure.value ? null : {...row, command: item.data.value.fields.command};
}

async function get(row) {
    if (row.share === "check" && checking.value?.id !== row.id) return void (await openCheck(row));
    checking.value = null;
    await run(["library", "get", row.share, String(row.item_id), ...(row.share === "check" ? ["--read"] : [])]);
}

watch(type, load, {immediate: true});
watch(search, () => {
    clearTimeout(delay);
    delay = setTimeout(load, SEARCH_DELAY_MILLISECONDS);
});
</script>

<template>
    <div class="library" data-library>
        <SearchBar v-model="search" placeholder="Search the library" data-library-search />
        <Segmented :options="TYPES" :value="type" data-library-type @pick="type = $event" />
        <template v-if="refusal">
            <p class="library-failure" role="alert" data-library-refusal>{{ refusal }}</p>
        </template>
        <template v-if="checking">
            <div class="library-check" data-library-check>
                <p>This check runs this command on your computer when someone starts it:</p>
                <pre data-library-command>{{ checking.command }}</pre>
                <Btn small @click="checking = null">Cancel</Btn>
                <Btn small variant="primary" data-library-confirm @click="get(checking)">Get the check, stopped</Btn>
            </div>
        </template>
        <RowList :rows="rows" :failure="failure" :loaded="loaded" :searching="Boolean(search.trim() || type)" empty="Nothing in the library yet" hint="Shared documents, sequences and checks appear here.">
            <template #default="{row}">
                <div class="library-row" :data-library-item="row.id">
                    <button type="button" class="library-open" data-library-open @click="open(row)">
                        <span class="library-title">{{ row.title }}</span>
                        <template v-if="row.excerpt">
                            <span class="library-excerpt" data-library-excerpt>{{ row.excerpt }}</span>
                        </template>
                        <template v-else>
                            <span class="library-abstract">{{ row.abstract }}</span>
                        </template>
                        <span class="library-facts">{{ TYPE_WORDS[row.share] }}, Version: {{ row.version }}, Changed by: {{ row.updated_by }}, <TimeAgo :at="row.updated_at" /></span>
                    </button>
                    <template v-if="row.copy_id">
                        <span class="library-here" data-library-here>On this journal</span>
                    </template>
                    <template v-else>
                        <Btn small variant="primary" data-library-get @click="get(row)">Get</Btn>
                    </template>
                    <template v-if="role === 'admin'">
                        <Btn small variant="danger" data-library-remove @click="remove(row)">Remove</Btn>
                    </template>
                </div>
            </template>
        </RowList>
        <template v-if="opened">
            <SidePanel :title="opened.title" @close="opened = null">
                <div data-library-panel>
                <template v-if="opened.removed_at">
                    <p class="library-removed" data-library-removed>Removed from the library</p>
                    <template v-if="role === 'admin'">
                        <Btn small variant="primary" data-library-restore @click="restore(opened)">Restore</Btn>
                    </template>
                </template>
                <p class="library-facts">{{ TYPE_WORDS[opened.share] }}, Version: {{ opened.version }}, Changed by: {{ opened.updated_by }}</p>
                <dl class="library-fields" data-library-fields>
                    <template v-for="(value, name) in opened.fields" :key="name">
                        <dt>{{ name }}</dt>
                        <dd>{{ value }}</dd>
                    </template>
                </dl>
                <h3 class="library-heading">Versions</h3>
                <ul class="library-versions" data-library-versions>
                    <template v-for="change in versions" :key="change.version">
                        <li :data-library-version="change.version">
                            <span>Version: {{ change.version }}, Changed by: {{ change.user }}, <TimeAgo :at="change.created_at" /></span>
                            <template v-if="canWrite && change.version !== opened.version">
                                <Btn small data-library-restore-version @click="restore(opened, change.version)">Restore this version</Btn>
                            </template>
                        </li>
                    </template>
                </ul>
                </div>
            </SidePanel>
        </template>
    </div>
</template>

<style scoped>
.library {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.library-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 0;
}

.library-open {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.library-title {
    font-weight: 600;
}

.library-abstract,
.library-excerpt,
.library-facts,
.library-here {
    color: var(--text-3);
    font-size: 12px;
}

.library-failure,
.library-warning {
    margin: 0;
    color: var(--danger);
    font-size: 13px;
}

.library-fields dt {
    margin-top: 8px;
    color: var(--text-3);
    font-size: 12px;
}

.library-fields dd {
    margin: 2px 0 0;
    white-space: pre-wrap;
}

.library-versions {
    padding: 0;
    list-style: none;
}

.library-versions li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 4px 0;
    font-size: 13px;
}
</style>

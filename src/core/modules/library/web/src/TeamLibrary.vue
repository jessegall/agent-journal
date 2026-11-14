<script setup>
import {computed, ref, watch} from "vue";
import {Btn, Dialog, FilterBar, ListReaderLayout, Skeleton, applyFilter, defaultFilter, useWindow} from "@journal/window-kit";
import TeamReader from "./TeamReader.vue";
import {KEEPS_REVISIONS, STATE_WORDS, teamFields, teamItems, teamMenu} from "./teamWords.js";

// the items of the library as a list and a reader, grouped by kind: each row is its name, which way an update goes and who shared it, and only Update is a badge.
// The Library tab lists everything the library holds and Shared from here lists what this user shared
const props = defineProps({copies: {type: Array, required: true}, mine: Boolean, userName: {type: String, default: ""}, canWrite: Boolean});
const emit = defineEmits(["changed", "counted"]);
const LIST_WIDTH = 460;
const view = useWindow();
const loaded = ref(false);
const failure = ref("");
const listing = ref([]);
const refusal = ref("");
const chosen = ref(null);
const tab = ref("details");
const checking = ref(null);
const filter = ref(defaultFilter(teamFields));
const words = ref("");

async function load() {
    delete view.state["listing.type"];
    delete view.state["listing.search"];
    await view.reload("listing");
    const answer = view.props.listing;
    failure.value = answer.failure.value;
    listing.value = failure.value ? [] : answer.data.value.rows;
    loaded.value = true;
}
load();

const all = computed(() => teamItems(listing.value, props.copies));
const shared = computed(() => all.value.filter((item) => item.row.by === props.userName));
watch([all, shared], () => emit("counted", {library: all.value.length, here: shared.value.length}), {immediate: true});
const rows = computed(() => (props.mine ? shared.value : all.value));
const shown = computed(() => applyFilter(rows.value, teamFields, filter.value, words.value, ["title"]));

async function send(line) {
    refusal.value = "";
    const answer = await view.run(line);
    if (!answer.ok) refusal.value = answer.error;
    else {
        await load();
        emit("changed");
    }
    return answer;
}

// a check runs on this computer, so its command is read before it is got
async function follow(item) {
    if (item.row.share !== "check") return send(["library", "get", item.row.share, String(item.row.item_id)]);
    view.state["item.share"] = "check";
    view.state["item.id"] = String(item.row.item_id);
    await view.reload("item");
    const read = view.props.item;
    refusal.value = read.failure.value;
    checking.value = read.failure.value ? null : {item, command: read.data.value.fields.command};
}
const getCheck = async () => {
    const {item} = checking.value;
    checking.value = null;
    await send(["library", "get", "check", String(item.row.item_id), "--read"]);
};

const resolve = (item, keep) => send(["library", "resolve", String(item.row.copy.copy_id), "--keep", keep]);
function act(item, what) {
    if (what === "Follow") return follow(item);
    if (what === "Share") return resolve(item, "mine");
    if (what === "Take" || (what === "Update" && KEEPS_REVISIONS.includes(item.row.share))) return resolve(item, "library");
    tab.value = "compare";
    chosen.value = item.id;
}
const menuOf = (item, open = null) => teamMenu(item, {open, act: (what) => act(item, what), canWrite: props.canWrite, leave: () => send(["library", "leave", String(item.row.copy.copy_id)])});
const place = (item) => ({head: item.title, items: menuOf(item, () => (chosen.value = item.id))});
</script>

<template>
    <ListReaderLayout v-model:chosen="chosen" :items="shown" :list-width="LIST_WIDTH" :place="place" :empty-title="mine ? 'Nothing shared from here yet' : 'Nothing in the library yet'" pick-line="Choose an item" data-library>
        <template #top>
            <FilterBar v-model="filter" v-model:words="words" :fields="teamFields" :rows="rows" :shown="shown.length" placeholder="Search the library" />
            <template v-if="failure || refusal"><p class="failure" role="alert" data-library-refusal>{{ failure || refusal }}</p></template>
        </template>
        <template #empty>
            <template v-if="!loaded"><Skeleton shape="rows" /></template>
            <template v-else>Shared documents, sequences and checks appear here.</template>
        </template>
        <template #meta="{item}">
            <span v-if="item.state === 'update'" class="badge-update" data-team-badge>{{ STATE_WORDS.update }}</span>
            <span v-else class="quiet" data-team-state>{{ STATE_WORDS[item.state] }}</span>
        </template>
        <template #reader="{item}">
            <TeamReader v-model:tab="tab" :item="item" :items="menuOf(item)" :can-write="canWrite" @act="act(item, $event)" />
        </template>
    </ListReaderLayout>
    <template v-if="checking">
        <Dialog padded title="Get the check" fits @close="checking = null">
            <p class="note">This check runs this command on your computer when someone starts it:</p>
            <pre data-library-command>{{ checking.command }}</pre>
            <template #foot>
                <Btn @click="checking = null">Cancel</Btn>
                <Btn variant="primary" data-library-confirm @click="getCheck">Get the check, stopped</Btn>
            </template>
        </Dialog>
    </template>
</template>

<style scoped>
.failure {
    margin: 0;
    padding: 6px var(--inset);
    color: var(--bad, var(--text-2));
    font-size: 12px;
}

.quiet {
    color: var(--text-4);
    font-size: 12px;
    white-space: nowrap;
}

.badge-update {
    padding: 1px 7px;
    border-radius: 999px;
    background: var(--accent-dim);
    color: var(--accent-text);
    font-size: 11.5px;
    font-weight: 500;
}

.note {
    margin: 0 0 8px;
    color: var(--text-2);
    font-size: 13px;
}

pre {
    margin: 0;
    padding: 8px;
    overflow: auto;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 12px;
}
</style>

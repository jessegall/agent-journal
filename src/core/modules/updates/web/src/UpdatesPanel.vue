<script setup>
import {computed, ref, watch} from "vue";
import {Btn, ListReaderLayout, PageHeader, Reader, TextDisplay, copying, useWindow} from "@journal/window-kit";

const view = useWindow();
const releases = view.props.releases;
const {failure: checkFailure} = view.props.standing;
const standing = computed(() => checkFailure.value ? null : view.props.standing.data.value);
const installing = ref(false);
const installFailure = ref("");
const installationRequested = ref(false);
const installed = computed(() => installationRequested.value && standing.value?.is_current && standing.value?.installation?.step === "finished");
const notes = ref([]);
const notesPage = ref(1);
const lastPage = computed(() => view.props.notes.data.value?.is_last_page ?? true);
const {failure: notesFailure} = view.props.notes;
watch(() => view.props.notes.data.value, (answer) => {
    if (answer) notes.value = notesPage.value === 1 ? answer.notes : [...notes.value, ...answer.notes];
});
const checkLine = computed(() => {
    if (standing.value) return standing.value.line;
    if (checkFailure.value) return "Release unavailable";
    return "Checking for a newer release";
});

async function check() {
    await view.reload("standing");
}

async function install() {
    installing.value = true;
    const result = await view.run(["update", "install"]);
    installFailure.value = result.ok ? "" : result.error;
    installing.value = false;
    await view.reload({only: result.ok ? ["releases", "standing"] : ["releases"]});
    if (!result.ok) return;
    installationRequested.value = true;
}

async function readNotes(page) {
    notesPage.value = page;
    view.state["notes.page"] = String(page);
    await view.reload("notes");
}

const reload = () => globalThis.location.reload();

// the release notes and the releases installed here are the list; a note reads as its text and an installed release says when it was installed
const chosen = ref(null);
const items = computed(() => [
    ...notes.value.map((note) => ({id: note.tag, title: note.tag, desc: new Date(note.published_at).toLocaleDateString(), group: "Release notes", note})),
    ...releases.rows.value.map((row) => ({id: `installed-${row.id}`, title: row.tag || row.checksum.slice(0, 12), desc: new Date(row.created_at).toLocaleString(), group: "Installed here", installed: row})),
]);
watch(() => items.value.length, () => {
    if (chosen.value === null && items.value.length) chosen.value = items.value[0].id;
}, {flush: "post"});
// an update is only read: its menu has Open and Copy name, never Duplicate or Delete
const place = (item) => ({
    head: item.title,
    items: [
        {label: "Open", group: "open", disabled: item.id === chosen.value, reason: "Already open", run: () => (chosen.value = item.id)},
        {label: "Copy name", group: "copy", run: ({say}) => copying(item.title, item.title, say)},
    ],
});

</script>

<template>
    <ListReaderLayout v-model:chosen="chosen" :items="items" :list-width="320" :place="place" empty-title="No releases yet" pick-line="No release chosen" data-updates>
        <template #top>
            <PageHeader title="Updates" />
            <template v-if="installing">
                <div class="cover" role="status" data-update-cover>Updating the journal. This takes a short while.</div>
            </template>
            <template v-if="installed">
                <div class="arrived" role="status" data-update-arrived>
                    <span class="line">The update is installed. Reload the page to see it.</span>
                    <Btn small variant="primary" data-update-reload @click="reload">Reload</Btn>
                </div>
            </template>
            <template v-if="checkFailure || installFailure">
                <p class="failure">{{ checkFailure || installFailure }}</p>
            </template>
            <div class="standing">
                <span class="line">{{ checkLine }}</span>
                <button type="button" @click="check">Check again</button>
                <template v-if="standing && !standing.is_current">
                    <Btn small variant="primary" data-update-install @click="install">{{ standing.installation?.step === "failed" ? "Retry update" : standing.tag ? `Update to ${standing.tag}` : "Update to the latest" }}</Btn>
                </template>
                <template v-else-if="standing">
                    <button type="button" data-update-force @click="install">Install it again</button>
                </template>
            </div>
            <template v-if="notesFailure">
                <p class="detail" data-update-notes-failure>{{ notesFailure }}</p>
            </template>
            <template v-if="!lastPage">
                <div class="standing"><button type="button" data-update-older @click="readNotes(notesPage + 1)">Show older releases</button></div>
            </template>
        </template>
        <template #empty>{{ releases.loaded.value ? "Installed releases appear here with their installation dates." : "" }}</template>
        <template #reader="{item}">
            <Reader :title="item.title" :number="item.note ? 'Release notes' : 'Installed here'" :facts="item.note ? [{name: 'published', label: 'Published', value: new Date(item.note.published_at).toLocaleDateString()}] : [{name: 'installed', label: 'Installed', value: new Date(item.installed.created_at).toLocaleString()}]" data-update-note>
                <TextDisplay v-if="item.note" :text="item.note.text" />
                <p v-else class="detail">This release was installed on this journal.</p>
            </Reader>
        </template>
    </ListReaderLayout>
</template>

<style scoped>
.failure {
    margin: 0;
    padding: 4px var(--inset);
    color: var(--bad, var(--text-2));
    font-size: 12px;
}

.cover,
.arrived,
.standing {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px var(--inset);
    font-size: 13px;
}

.line {
    flex: 1;
}

.detail {
    margin: 0;
    padding: 4px var(--inset);
    color: var(--text-3);
    font-size: 12px;
}

button {
    padding: 2px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface);
    color: inherit;
    font-size: 12px;
    cursor: pointer;
}
</style>

<script setup>
import {computed, ref, watch} from "vue";
import {Btn, RowList, TextDisplay, WindowRoom, useWindow} from "@journal/window-kit";

const window = useWindow();
const releases = window.props.releases;
const {failure: checkFailure} = window.props.standing;
const standing = computed(() => checkFailure.value ? null : window.props.standing.data.value);
const installing = ref(false);
const installFailure = ref("");
const installationRequested = ref(false);
const installed = computed(() => installationRequested.value && standing.value?.is_current && standing.value?.installation?.step === "finished");
const notes = ref([]);
const notesPage = ref(1);
const lastPage = computed(() => window.props.notes.data.value?.is_last_page ?? true);
const {failure: notesFailure} = window.props.notes;
watch(() => window.props.notes.data.value, (answer) => {
    if (answer) notes.value = notesPage.value === 1 ? answer.notes : [...notes.value, ...answer.notes];
});
const checkLine = computed(() => {
    if (standing.value) return standing.value.line;
    if (checkFailure.value) return "Release unavailable";
    return "Checking for a newer release";
});

async function check() {
    await window.reload("standing");
}

async function install() {
    installing.value = true;
    const result = await window.run(["update", "install"]);
    installFailure.value = result.ok ? "" : result.error;
    installing.value = false;
    await window.reload({only: result.ok ? ["releases", "standing"] : ["releases"]});
    if (!result.ok) return;
    installationRequested.value = true;
}

async function readNotes(page) {
    notesPage.value = page;
    window.state["notes.page"] = String(page);
    await window.reload("notes");
}

const reload = () => globalThis.location.reload();
</script>

<template>
    <WindowRoom>
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
        <h3 class="heading">Installed releases</h3>
        <div class="releases">
            <RowList :rows="releases.rows.value" :failure="releases.failure.value" :loaded="releases.loaded.value" empty="No installation history yet" hint="Installed releases appear here with their installation dates.">
                <template #default="{row}">
                    <div class="release" :data-row="row.id">
                        <span class="title">{{ row.tag || row.checksum.slice(0, 12) }}</span>
                        <span class="detail">{{ new Date(row.created_at).toLocaleString() }}</span>
                    </div>
                </template>
            </RowList>
        </div>
        <h3 class="heading">What changed</h3>
        <template v-if="notesFailure">
            <p class="detail" data-update-notes-failure>{{ notesFailure }}</p>
        </template>
        <template v-for="note in notes" :key="note.tag">
            <article class="note" data-update-note>
                <div class="release">
                    <span class="title">{{ note.tag }}</span>
                    <span class="detail">{{ new Date(note.published_at).toLocaleDateString() }}</span>
                </div>
                <TextDisplay :text="note.text" />
            </article>
        </template>
        <template v-if="!lastPage">
            <button type="button" data-update-older @click="readNotes(notesPage + 1)">Show older releases</button>
        </template>
    </WindowRoom>
</template>

<style scoped>
.releases {
    position: relative;
    min-height: 100px;
}

.failure {
    margin: 0 0 8px;
    color: var(--bad, var(--text-2));
    font-size: 12px;
}

.cover {
    margin-bottom: 8px;
    padding: 10px 12px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    font-size: 13px;
}

.arrived {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    font-size: 13px;
}

.note {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 12px;
    font-size: 13px;
}

.standing,
.release {
    display: flex;
    align-items: baseline;
    gap: 10px;
    font-size: 13px;
}

.line,
.title {
    flex: 1;
}

.heading {
    margin: 12px 0 6px;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 600;
}

.detail {
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

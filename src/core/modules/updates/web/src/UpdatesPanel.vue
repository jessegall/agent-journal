<script setup>
import {computed, ref} from "vue";
import {Btn, RowList, TextDisplay, WindowRoom, useRows} from "@journal/window-kit";

const releases = useRows("release list", ["release.*"]);
const standing = ref(null);
const checkFailure = ref("");
const installing = ref(false);
const installed = ref(false);
const notes = ref([]);
const notesPage = ref(1);
const lastPage = ref(true);
const notesFailure = ref("");
const checkLine = computed(() => {
    if (standing.value) return standing.value.line;
    if (checkFailure.value) return "Release unavailable";
    return "Checking for a newer release";
});

async function check() {
    checkFailure.value = "";
    const result = await releases.context.read("update check");
    standing.value = result.ok ? result.value : null;
    checkFailure.value = result.ok ? "" : result.error;
}

async function install() {
    installing.value = true;
    const result = await releases.act(["update", "install"]);
    installing.value = false;
    if (!result.ok) return;
    await check();
    installed.value = true;
}

async function readNotes(page) {
    const result = await releases.context.read(`update notes --page ${page}`);
    notesFailure.value = result.ok ? "" : result.error;
    if (!result.ok) return;
    notes.value = [...notes.value, ...result.value.notes];
    notesPage.value = page;
    lastPage.value = result.value.is_last_page;
}

const reload = () => window.location.reload();

check();
readNotes(1);
</script>

<template>
    <WindowRoom>
        <template v-if="installing">
            <div class="cover" role="status" data-update-cover>Updating the journal. This takes a short while.</div>
        </template>
        <template v-if="installed">
            <div class="arrived" role="status" data-update-arrived>
                <span class="line">The update is installed. Reload the page to see it.</span>
                <Btn small kind="primary" data-update-reload @click="reload">Reload</Btn>
            </div>
        </template>
        <template v-if="checkFailure || releases.actionFailure.value">
            <p class="failure">{{ checkFailure || releases.actionFailure.value }}</p>
        </template>
        <div class="standing">
            <span class="line">{{ checkLine }}</span>
            <button type="button" @click="check">Check again</button>
            <template v-if="standing && !standing.is_current">
                <Btn small kind="primary" data-update-install @click="install">{{ standing.tag ? `Update to ${standing.tag}` : "Update to the latest" }}</Btn>
            </template>
            <template v-else-if="standing">
                <button type="button" data-update-force @click="install">Install it again</button>
            </template>
        </div>
        <h3 class="heading">Installed releases</h3>
        <div class="releases">
            <RowList :rows="releases.rows.value" :failure="releases.failure.value" :loaded="releases.loaded.value" empty="No release installed from here yet" hint="A release you install from this journal shows here with when.">
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

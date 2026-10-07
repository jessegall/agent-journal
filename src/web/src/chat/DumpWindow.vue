<script setup>
import {computed, reactive, ref, watch} from "vue";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";
import {peekRef, route} from "../route.js";
import {startDump, useDump} from "../composables/dump.js";
import Btn from "../kit/Btn.vue";
import DumpMadeRow from "./DumpMadeRow.vue";
import DumpReport from "./DumpReport.vue";
import DumpFoot from "./DumpFoot.vue";
import DumpHead from "./DumpHead.vue";
import DumpLane from "./DumpLane.vue";
import DumpRail from "./DumpRail.vue";
import DumpStart from "./DumpStart.vue";

const draft = reactive({text: "", files: [], sending: false, error: "", over: false});
const opened = ref("");
const litItem = ref("");
const litRef = ref("");
const merging = ref(null);
const confirming = ref("");
const renamingCollection = ref(false);

watch(
    () => store.dumpFiles,
    (files) => {
        if (!files.length) return;
        draft.files.push(...files);
        store.dumpFiles = [];
        store.dumpSelected = 0;
    },
    {immediate: true}
);

const every = computed(() => rows("dump").filter((d) => !d.deleted));
const {
    dump,
    items,
    settled,
    working,
    asked,
    guesses,
    removed,
    phase,
    collection,
    hasCollection,
    filedRows,
    lines,
    reportTitle,
    summary,
    suggestions,
    summing,
    timeline,
    current,
    thinking,
    note,
    listed,
    more,
    adding,
    earlierRows,
    act,
    addMore,
    answer,
    say,
    take,
    leave,
    renameCollection: rename,
    renameRow,
} = useDump(
    every,
    computed(() => store.dumpSelected),
    rows,
    (d) => `${route.value.env}|dump:${d.n}`
);
watch(
    () => store.dumpSelected,
    () => {
        opened.value = "";
        merging.value = null;
        confirming.value = "";
        renamingCollection.value = false;
    }
);

function attach(list) {
    draft.files = [...draft.files, ...Array.from(list || [])];
}

function pasted(e) {
    const files = Array.from(e.clipboardData?.files || []);
    if (!files.length) return;
    e.preventDefault();
    attach(files);
}

function pastedMore(e) {
    const files = Array.from(e.clipboardData?.files || []);
    if (!files.length || !working.value) return;
    e.preventDefault();
    addMore(files);
}

const droppable = computed(() => !dump.value || working.value);

function dropped(e) {
    draft.over = false;
    if (!dump.value) attach(e.dataTransfer?.files);
    else addMore(e.dataTransfer?.files);
}

async function send() {
    const text = draft.text.trim();
    if ((!text && !draft.files.length) || draft.sending) return;
    draft.sending = true;
    draft.error = "";
    try {
        const row = await startDump(text, draft.files);
        Object.assign(draft, {text: "", files: []});
        store.dumpSelected = row.n;
    } catch (e) {
        draft.error = e.message;
    } finally {
        draft.sending = false;
    }
}

async function renameCollection(title) {
    renamingCollection.value = false;
    await rename(title);
}

function select(m) {
    const picked = new Set(merging.value);
    if (picked.has(m.ref)) picked.delete(m.ref);
    else picked.add(m.ref);
    merging.value = picked;
}

async function merge() {
    const picked = filedRows.value.filter((m) => merging.value.has(m.ref));
    merging.value = null;
    const list = picked.map((m) => `“${m.row.title}” (${m.ref})`).join(" and ");
    await say(`Merge ${list} into one document, named for both, and file it where the first one is.`);
}

async function confirmed() {
    const what = confirming.value;
    confirming.value = "";
    await act(what);
}

function toggle(m) {
    opened.value = opened.value === m.ref ? "" : m.ref;
}
</script>

<template>
    <section
        :class="['dump', {over: draft.over}]"
        @dragover.prevent="droppable && (draft.over = true)"
        @dragleave.self="draft.over = false"
        @drop.prevent="dropped"
    >
        <DumpHead v-model:renaming="renamingCollection" :dump="dump" :collection="collection" :phase="phase" @rename="renameCollection" />

        <template v-if="!dump">
            <DumpStart
                v-model:text="draft.text"
                :files="draft.files"
                :sending="draft.sending"
                :error="draft.error"
                :earlier="earlierRows"
                @send="send"
                @files="attach"
                @paste="pasted"
                @remove="(i) => draft.files.splice(i, 1)"
            />
        </template>

        <template v-else>
            <div class="dump-work">
                <DumpRail
                    v-model:lit-item="litItem"
                    :items="items"
                    :adding="adding"
                    :working="working"
                    :more-error="more.error"
                    :settled="settled"
                    :timeline="timeline"
                    :current="current"
                    :thinking="thinking"
                    :question="asked"
                    :guesses="guesses"
                    :removed="removed"
                    :lit-ref="litRef"
                    :answer="answer"
                    :say="say"
                    @more="addMore"
                    @paste-more="pastedMore"
                />

                <div class="dump-main">
                    <p class="dump-note">{{ note }}</p>
                    <div class="dump-docs" @mouseleave="litRef = ''">
                        <template v-if="phase === 'done'">
                            <DumpReport
                                :title="reportTitle"
                                :lines="lines"
                                :summary="summary"
                                :suggestions="suggestions"
                                :summing="summing"
                                @take="take"
                                @leave="leave"
                            />
                        </template>
                        <template v-for="m in listed" :key="m.ref">
                            <DumpMadeRow
                                :made="m"
                                :open="opened === m.ref"
                                :lit="litRef === m.ref || (!!litItem && items.some((i) => i.name === litItem && i.refs.includes(m.ref)))"
                                :selecting="!!merging"
                                :selected="!!merging && merging.has(m.ref)"
                                @mouseenter="litRef = m.ref"
                                @toggle="toggle(m)"
                                @peek="peekRef(m.ref)"
                                @rename="(title) => renameRow(m, title)"
                                @merge="merging = new Set([m.ref])"
                                @select="select(m)"
                            />
                        </template>
                    </div>
                    <template v-if="merging">
                        <div class="dump-float">
                            <template v-if="merging.size < 2">1 selected. Select one more to merge.</template>
                            <template v-else>
                                {{ merging.size }} picked
                                <Btn kind="primary" small @click="merge">Merge into one document</Btn>
                            </template>
                            <Btn small @click="merging = null">Cancel</Btn>
                        </div>
                    </template>
                    <DumpFoot
                        v-model:confirming="confirming"
                        :collection="collection"
                        :removed="removed"
                        :filed="filedRows.length"
                        :working="working"
                        :has-collection="hasCollection"
                        @confirmed="confirmed"
                    />
                </div>
            </div>
        </template>

        <template v-if="draft.over">
            <div class="dump-drop">
                <DumpLane
                    drop
                    title="Drop to add the files"
                    :meta="dump ? 'they are added to the files, and the agent reads them next' : 'sorted by subject, filed into a new collection'"
                />
            </div>
        </template>
    </section>
</template>

<style scoped>
.dump {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    background: var(--bg);
    container-type: inline-size;
}

.dump-drop {
    position: absolute;
    inset: 44px 0 0;
    z-index: 4;
    display: grid;
    place-items: center;
    background: color-mix(in srgb, var(--bg) 80%, transparent);
    pointer-events: none;
}

.dump-work {
    display: grid;
    flex: 1;
    grid-template-columns: 262px minmax(0, 1fr);
    min-height: 0;
}

.dump-main {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
}

.dump-note {
    flex: none;
    margin: 0;
    padding: 16px 20px 10px;
    font-size: 12.5px;
    color: var(--text-3);
}

.dump-docs {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    min-height: 0;
    padding: 4px 20px 20px;
    overflow-y: auto;
}

.dump-float {
    position: absolute;
    left: 50%;
    bottom: 70px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 8px 7px 14px;
    border: 1px solid var(--border-3);
    border-radius: 12px;
    background: var(--raised);
    box-shadow: 0 16px 40px rgb(0 0 0 / 0.45);
    font-size: 12.5px;
    color: var(--text-2);
    white-space: nowrap;
    translate: -50% 0;
}

@container (max-width: 640px) {
    .dump-work {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: auto minmax(0, 1fr);
    }
}
</style>

<script setup>
import {computed, reactive, ref, watch} from "vue";
import {api} from "../api/client.js";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";
import {peekRef, route} from "../route.js";
import {useNow} from "../composables/now.js";
import Btn from "../kit/Btn.vue";
import DumpMadeRow from "./DumpMadeRow.vue";
import DumpReport from "./DumpReport.vue";
import DumpFoot from "./DumpFoot.vue";
import DumpHead from "./DumpHead.vue";
import DumpLane from "./DumpLane.vue";
import DumpRail from "./DumpRail.vue";
import DumpStart from "./DumpStart.vue";
import {TEXT_ITEM, itemLabel} from "./dumpPile.js";
import {counted} from "../format/number.js";

const QUIET_AFTER = 180;
const SUMMING_FOR = 120;
const EARLIER = 4;

const draft = reactive({text: "", files: [], sending: false, error: "", over: false});
const opened = ref("");
const litItem = ref("");
const litRef = ref("");
const merging = ref(null);
const confirming = ref("");
const renamingCollection = ref(false);
const taking = ref(-1);
const fetched = reactive({});

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
const joined = (d) => d.data?.queued_at || d.created;
const inHand = computed(() => every.value.filter((d) => !d.completed).sort((a, b) => joined(a) - joined(b) || a.n - b.n)[0] || null);
const dump = computed(() => every.value.find((d) => d.n === store.dumpSelected) || null);
const earlier = computed(() => [...every.value].sort((a, b) => b.n - a.n).slice(0, EARLIER));
watch(
    () => store.dumpSelected,
    () => {
        opened.value = "";
        merging.value = null;
        confirming.value = "";
        renamingCollection.value = false;
    }
);

const names = (d) => [...(d.brief?.trim() ? d.data?.parts || [TEXT_ITEM] : []), ...Object.keys(d.data?.files || {}).sort()];
const items = computed(() =>
    dump.value
        ? names(dump.value).map((name) => {
              const item = (dump.value.data.items || {})[name] || {};
              const state = item.failed ? "failed" : item.outcome ? "filed" : item.insight ? "read" : "waiting";
              return {
                  name,
                  label: itemLabel(name),
                  state,
                  note: item.failed || item.outcome || item.insight || "",
                  refs: item.refs || [],
                  added: item.added || [],
              };
          })
        : []
);
const settled = computed(() => items.value.filter((i) => i.state === "filed" || i.state === "failed").length);

const now = useNow(3000);
const working = computed(() => Boolean(dump.value && !dump.value.completed));
const queued = computed(() => Boolean(working.value && inHand.value && inHand.value.n !== dump.value.n));
const log = computed(() => dump.value?.data?.log || []);
const latest = computed(() => log.value[log.value.length - 1] || null);
const started = computed(() => Boolean(log.value.length || items.value.some((i) => i.state !== "waiting")));
const asked = computed(() => (working.value && dump.value.data?.question?.text) || "");
const guesses = computed(() => (asked.value && dump.value.data.question.guesses) || []);
const quiet = computed(
    () => working.value && started.value && !queued.value && !asked.value && now.value - (dump.value.updated || 0) > QUIET_AFTER
);
const removed = computed(() => Boolean(dump.value?.data?.removed));
const stopped = computed(() => Boolean(dump.value?.data?.stopped));

const phase = computed(() => {
    if (!dump.value) return "";
    if (removed.value) return "removed";
    if (stopped.value) return "stopped";
    if (dump.value.completed) return "done";
    if (queued.value) return "queued";
    if (asked.value) return "asking";
    if (quiet.value) return "quiet";
    return started.value ? "filing" : "waiting";
});
const named = computed(() => Boolean(dump.value && dump.value.title !== `Dump ${dump.value.n}`));
const collection = computed(() => (named.value ? dump.value.title : ""));
const hasCollection = computed(() => Boolean(dump.value?.refs?.some((r) => r.startsWith("collection:"))));

const typeTitle = (type) => store.spec?.types?.[type]?.title || type;
const filedRefs = computed(() => [...new Set(items.value.flatMap((i) => i.refs))].filter((r) => !r.startsWith("collection:")));
const writing = computed(() => (working.value && latest.value?.on && !filedRefs.value.includes(latest.value.on) ? latest.value.on : ""));
const making = computed(() => (working.value && !asked.value && !writing.value && latest.value?.making) || "");
const madeRefs = computed(() => [...filedRefs.value, ...(writing.value ? [writing.value] : [])]);
const made = computed(() => [
    ...madeRefs.value
        .map((ref) => {
            const [type, n] = ref.split(":");
            const row = rows(type).find((r) => r.n === Number(n)) || fetched[ref] || null;
            return {
                ref,
                type,
                n: Number(n),
                row,
                writing: ref === writing.value,
                from: items.value.filter((i) => i.refs.includes(ref)).map((i) => i.label),
                added: items.value.some((i) => i.added.includes(ref)),
                kind: typeTitle(type),
                place: `${typeTitle(type)}s`,
            };
        })
        .filter((m) => !m.row?.deleted),
    ...(making.value
        ? [
              {
                  ref: `making:${making.value}`,
                  making: making.value.split(",").slice(1).join(",").trim() || making.value,
                  writing: true,
                  from: [],
              },
          ]
        : []),
]);
const filedRows = computed(() => made.value.filter((m) => m.row && !m.writing));

async function fetchMade() {
    for (const ref of madeRefs.value) {
        const [type, n] = ref.split(":");
        if (rows(type).some((r) => r.n === Number(n))) continue;
        try {
            fetched[ref] = await api.show(type, Number(n));
        } catch {
            delete fetched[ref];
        }
    }
}
watch([madeRefs, now], fetchMade, {immediate: true});

const lines = computed(() => {
    const by = {};
    for (const m of filedRows.value) (by[m.type] = by[m.type] || []).push(m);
    return Object.entries(by).map(([type, list]) => {
        const word = typeTitle(type).toLowerCase();
        const own = list.filter((m) => m.added).length;
        return `${counted(list.length, word, `${word}s`)}${own ? `, ${own} of them written by the agent without being asked` : ""}`;
    });
});
const reportTitle = computed(() =>
    filedRows.value.length
        ? `Done. Filed ${counted(filedRows.value.length, "thing", "things")}${collection.value ? ` in “${collection.value}”` : ""}:`
        : "Done. Nothing was filed."
);
const summary = computed(() => dump.value?.data?.summary || "");
const options = computed(() => dump.value?.data?.options || []);
const suggestions = computed(() => {
    const taken = dump.value?.data?.taken || {};
    const left = dump.value?.data?.declined || [];
    return options.value.map((o, pick) => ({
        pick,
        label: o.label,
        ask: o.ask || "",
        state: taken[pick] ? "taken" : left.includes(pick) ? "left" : "",
        busy: taking.value === pick,
    }));
});
const summing = computed(
    () => phase.value === "done" && !summary.value && !options.value.length && now.value - dump.value.completed < SUMMING_FOR
);

const timeline = computed(() => {
    const d = dump.value;
    if (!d) return [];
    const directions = (d.data?.said || []).map((s, i) => ({key: `said:${i}`, at: s.at, mine: true, text: s.label}));
    const answers = (d.data?.answers || []).map((a, i) => ({key: `answer:${i}`, at: a.at, mine: true, text: a.answer}));
    const taken = Object.entries(d.data?.taken || {}).map(([k, c]) => ({key: `taken:${k}`, at: c.at, mine: true, text: c.label}));
    const agent = log.value.map((e, i) => ({key: `log:${i}`, at: e.at, mine: false, text: e.text, detail: e.detail}));
    return [...agent, ...directions, ...answers, ...taken].sort((a, b) => a.at - b.at);
});
const current = computed(() => (phase.value === "filing" ? [...timeline.value].reverse().find((line) => !line.mine) || null : null));
const step = computed(() => {
    const key = dump.value && `${route.value.env}|dump:${dump.value.n}`;
    const running = key && rows("sequence").find((sequence) => sequence.data.runs && sequence.data.runs[key]);
    if (!running) return "";
    const at = running.data.runs[key].step;
    return `Step ${at} of ${running.sections.length}: ${running.sections[at - 1].title}`;
});
const thinking = computed(() => {
    if (step.value && (phase.value === "waiting" || (phase.value === "filing" && !log.value.length))) return step.value;
    if (phase.value === "waiting") return "Waiting for the agent";
    if (phase.value === "queued") return `Waiting in line behind dump ${inHand.value.n}`;
    if (phase.value === "quiet")
        return `No update for ${Math.round((now.value - dump.value.updated) / 60)} min; the agent may be busy elsewhere`;
    if (phase.value === "filing" && !log.value.length) return "Reading the pile";
    if (summing.value) return "Summing up";
    return "";
});

const note = computed(() => {
    const n = filedRows.value.length;
    switch (phase.value) {
        case "removed":
            return `Removed. The collection and the ${counted(dump.value.data.removed_refs?.length || 0, "thing", "things")} it held are gone. What you dropped is still on dump ${dump.value.n}.`;
        case "stopped":
            return `Stopped. ${counted(n, "thing was", "things were")} filed and stay in the collection; the rest of the pile was not read.`;
        case "done":
            return `${counted(n, "thing", "things")} filed. Rename or merge anything; it changes in the journal right away.`;
        default:
            return `${counted(n, "thing", "things")} filed so far. Each goes into the collection as soon as it is written.`;
    }
});

const listed = computed(() => (removed.value ? [] : made.value));

async function act(action, body = {}) {
    return api.act("dump", dump.value.n, action, body);
}

function attach(list) {
    draft.files = [...draft.files, ...Array.from(list || [])];
}

function pasted(e) {
    const files = Array.from(e.clipboardData?.files || []);
    if (!files.length) return;
    e.preventDefault();
    attach(files);
}

const more = reactive({names: [], error: ""});

async function addMore(list) {
    const files = Array.from(list || []);
    if (!files.length || !working.value) return;
    const n = dump.value.n;
    more.error = "";
    more.names = [...more.names, ...files.map((f) => f.name)];
    try {
        for (const file of files) await api.upload("dump", n, file);
    } catch (e) {
        more.error = e.message;
    } finally {
        more.names = more.names.filter((name) => !files.some((f) => f.name === name));
    }
}

function pastedMore(e) {
    const files = Array.from(e.clipboardData?.files || []);
    if (!files.length || !working.value) return;
    e.preventDefault();
    addMore(files);
}

const droppable = computed(() => !dump.value || working.value);
const adding = computed(() => [...new Set(more.names)].filter((name) => !items.value.some((i) => i.name === name)));

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
        const row = await api.create("dump", text ? {brief: text} : {title: draft.files[0].name.slice(0, 80), brief: ""});
        for (const file of draft.files) await api.upload("dump", row.n, file);
        Object.assign(draft, {text: "", files: []});
        store.dumpSelected = row.n;
    } catch (e) {
        draft.error = e.message;
    } finally {
        draft.sending = false;
    }
}

async function answer(text) {
    await act("answer", {text});
}

async function say(how) {
    await act("direct", {how});
}

async function take(pick) {
    taking.value = pick;
    try {
        await act("choose", {pick});
    } finally {
        taking.value = -1;
    }
}

async function leave(pick) {
    await act("decline", {pick});
}

async function renameCollection(title) {
    renamingCollection.value = false;
    if (title !== collection.value) await act("name", {title});
}

async function renameRow(m, title) {
    await api.act(m.type, m.n, "update", {title});
    if (fetched[m.ref]) fetched[m.ref] = await api.show(m.type, m.n);
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

const pillOf = (d) => {
    if (d.data?.removed) return "removed";
    if (d.data?.stopped) return "stopped";
    if (d.completed) return "done";
    return inHand.value?.n === d.n ? "filing" : "queued";
};
const earlierRows = computed(() => earlier.value.map((d) => ({n: d.n, title: d.title, pill: pillOf(d)})));
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
                            <template v-if="merging.size < 2">1 picked · pick one more to merge with it</template>
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
                    title="Let go to add them to the pile"
                    :meta="dump ? 'they join the pile, and the agent reads them next' : 'sorted by subject, filed into a new collection'"
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

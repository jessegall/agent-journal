<script setup>
import {computed, nextTick, reactive, ref, watch} from "vue";
import {api} from "../api/client.js";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";
import {peekRef, route} from "../route.js";
import {useNow} from "../composables/now.js";
import {age} from "../format/time.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import InlineName from "../kit/InlineName.vue";
import FileSlip from "../kit/FileSlip.vue";
import ProgressBar from "../kit/ProgressBar.vue";
import DumpAnswer from "./DumpAnswer.vue";
import DumpFiles from "./DumpFiles.vue";
import DumpMadeRow from "./DumpMadeRow.vue";
import DumpReport from "./DumpReport.vue";
import {TEXT_ITEM, fileKind, itemLabel, plural} from "./dumpPile.js";

const QUIET_AFTER = 180;
const SUMMING_FOR = 120;
const EARLIER = 4;
const READ = {waiting: -1, read: 0.6, filed: 1, failed: 1};

const draft = reactive({text: "", files: [], sending: false, error: "", over: false});
const opened = ref("");
const litItem = ref("");
const litRef = ref("");
const merging = ref(null);
const confirming = ref("");
const renamingCollection = ref(false);
const taking = ref(-1);
const fetched = reactive({});
const narr = ref(null);

watch(
    () => store.dumpFiles,
    (files) => {
        if (!files.length) return;
        draft.files.push(...files);
        store.dumpFiles = [];
        store.dumpShown = 0;
    },
    {immediate: true}
);

const every = computed(() => rows("dump").filter((d) => !d.deleted));
const joined = (d) => d.data?.queued_at || d.created;
const inHand = computed(() => every.value.filter((d) => !d.completed).sort((a, b) => joined(a) - joined(b) || a.n - b.n)[0] || null);
const dump = computed(() => every.value.find((d) => d.n === store.dumpShown) || null);
const earlier = computed(() => [...every.value].sort((a, b) => b.n - a.n).slice(0, EARLIER));
watch(
    () => store.dumpShown,
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
const PILLS = {
    removed: "Removed",
    stopped: "Stopped",
    done: "Filed",
    queued: "Queued",
    asking: "Needs you",
    quiet: "Quiet",
    filing: "Filing",
    waiting: "Filing",
};
const TONES = {
    removed: "idle",
    stopped: "idle",
    done: "done",
    queued: "idle",
    asking: "needs",
    quiet: "needs",
    filing: "live",
    waiting: "live",
};

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
        return `${plural(list.length, word, `${word}s`)}${own ? `, ${own} of them written by the agent without being asked` : ""}`;
    });
});
const reportTitle = computed(() =>
    filedRows.value.length
        ? `Done. Filed ${plural(filedRows.value.length, "thing", "things")}${collection.value ? ` in “${collection.value}”` : ""}:`
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
    const directions = (d.data?.said || []).map((s) => ({at: s.at, mine: true, text: s.label}));
    const answers = (d.data?.answers || []).map((a) => ({at: a.at, mine: true, text: a.answer}));
    const taken = Object.values(d.data?.taken || {}).map((c) => ({at: c.at, mine: true, text: c.label}));
    const agent = log.value.map((e) => ({at: e.at, mine: false, text: e.text, detail: e.detail}));
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

watch(
    () => [store.dumpShown, timeline.value.length, thinking.value],
    async () => {
        await nextTick();
        if (narr.value) narr.value.scrollTop = narr.value.scrollHeight;
    }
);

const note = computed(() => {
    const n = filedRows.value.length;
    switch (phase.value) {
        case "removed":
            return `Removed. The collection and the ${plural(dump.value.data.removed_refs?.length || 0, "thing", "things")} it held are gone. What you dropped is still on dump ${dump.value.n}.`;
        case "stopped":
            return `Stopped. ${plural(n, "thing was", "things were")} filed and stay in the collection; the rest of the pile was not read.`;
        case "done":
            return `${plural(n, "thing", "things")} filed. Rename or merge anything; it changes in the journal right away.`;
        default:
            return `${plural(n, "thing", "things")} filed so far. Each goes into the collection as soon as it is written.`;
    }
});

const shown = computed(() => (removed.value ? [] : made.value));

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
        store.dumpShown = row.n;
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
</script>

<template>
    <section
        :class="['dump', {over: draft.over}]"
        @dragover.prevent="droppable && (draft.over = true)"
        @dragleave.self="draft.over = false"
        @drop.prevent="dropped"
    >
        <header class="dump-head">
            <Icon name="inbox" :size="14" />
            <template v-if="dump">
                <span class="dump-title">Dump {{ dump.n }}</span>
                <template v-if="renamingCollection">
                    <InlineName class="dump-rename" :value="collection" @done="renameCollection" @cancel="renamingCollection = false" />
                </template>
                <template v-else-if="collection">
                    <button type="button" class="dump-collection" title="Rename the collection" @click="renamingCollection = true">
                        <span class="dump-collection-name">{{ collection }}</span>
                        <Icon name="pencil" :size="11" />
                    </button>
                </template>
                <span :class="['dump-pill', TONES[phase]]">{{ PILLS[phase] }}</span>
            </template>
            <template v-else>
                <span class="dump-title">New dump</span>
            </template>
            <span class="grow" />
            <template v-if="dump">
                <Btn small @click="store.dumpShown = 0">New dump</Btn>
            </template>
            <Btn small @click="store.dumping = false">Back to chat</Btn>
        </header>

        <template v-if="!dump">
            <div class="dump-start">
                <div class="dump-start-panel">
                    <p class="dump-prompt">Throw it all in.</p>
                    <div :class="['dump-compose', {lit: draft.files.length}]" @paste="pasted">
                        <template v-if="draft.files.length">
                            <span class="dump-eyebrow">The pile · {{ plural(draft.files.length, "file", "files") }}</span>
                            <DumpFiles :files="draft.files" @remove="(i) => draft.files.splice(i, 1)" />
                        </template>
                        <textarea
                            v-model="draft.text"
                            rows="2"
                            :placeholder="
                                draft.files.length ? 'Anything I should know before I sort it? Optional' : 'Type or paste anything'
                            "
                            @keydown.meta.enter.prevent="send"
                            @keydown.ctrl.enter.prevent="send"
                        />
                        <div class="dump-row">
                            <label class="dump-add">
                                <Icon name="paperclip" :size="13" />
                                {{ draft.files.length ? "Add more" : "Add files" }}
                                <input type="file" multiple hidden @change="(e) => (attach(e.target.files), (e.target.value = ''))" />
                            </label>
                            <span class="grow" />
                            <template v-if="draft.error">
                                <span class="dump-error">{{ draft.error }}</span>
                            </template>
                            <Btn
                                kind="primary"
                                small
                                :busy="draft.sending"
                                :disabled="!draft.text.trim() && !draft.files.length"
                                @click="send"
                            >
                                Sort and file it
                            </Btn>
                        </div>
                    </div>
                    <template v-if="!draft.files.length">
                        <label class="dump-lane">
                            <Icon name="file" :size="20" />
                            <span class="dump-lane-title">Drop as many files as you like</span>
                            <span class="dump-lane-meta">transcripts · notes · documents · screenshots · links</span>
                            <input type="file" multiple hidden @change="(e) => (attach(e.target.files), (e.target.value = ''))" />
                        </label>
                    </template>
                    <p class="dump-context">
                        Mixed is fine. I sort it by subject, one document per subject with a proper name, and file each one straight into a
                        new collection. Rename or merge anything afterwards, or remove the whole collection.
                    </p>
                    <template v-if="earlier.length">
                        <div class="dump-earlier">
                            <span class="dump-eyebrow">Earlier dumps</span>
                            <template v-for="d in earlier" :key="d.n">
                                <button type="button" class="dump-earlier-row" @click="store.dumpShown = d.n">
                                    <span class="dump-earlier-title">
                                        Dump {{ d.n }}
                                        <template v-if="d.title !== `Dump ${d.n}`">· {{ d.title }}</template>
                                    </span>
                                    <span :class="['dump-pill', TONES[pillOf(d)]]">{{ PILLS[pillOf(d)] }}</span>
                                </button>
                            </template>
                        </div>
                    </template>
                </div>
            </div>
        </template>

        <template v-else>
            <div class="dump-work">
                <aside class="dump-rail">
                    <span class="dump-eyebrow">The pile</span>
                    <div class="dump-pile" @mouseleave="litItem = ''">
                        <template v-for="item in items" :key="item.name">
                            <FileSlip
                                :file="{name: item.label}"
                                :kind="fileKind(item.name)"
                                :state="item.state"
                                :read="READ[item.state]"
                                :meta="
                                    item.state === 'filed'
                                        ? `→ ${plural(item.refs.filter((r) => !r.startsWith('collection:')).length, 'thing', 'things')}`
                                        : item.state === 'failed'
                                          ? 'not filed'
                                          : item.state
                                "
                                :lit="litItem === item.name || item.refs.includes(litRef)"
                                :title="item.note"
                                @mouseenter="litItem = item.name"
                            />
                        </template>
                        <template v-for="name in adding" :key="`adding-${name}`">
                            <FileSlip :file="{name}" :kind="fileKind(name)" state="waiting" meta="adding…" />
                        </template>
                    </div>
                    <template v-if="working">
                        <label class="dump-add dump-add-more">
                            <Icon name="paperclip" :size="13" />
                            Add more files
                            <input type="file" multiple hidden @change="(e) => (addMore(e.target.files), (e.target.value = ''))" />
                        </label>
                    </template>
                    <template v-if="more.error">
                        <span class="dump-error">{{ more.error }}</span>
                    </template>
                    <ProgressBar thin :value="settled" :max="Math.max(1, items.length)" />
                    <span class="dump-eyebrow">What I'm doing</span>
                    <div ref="narr" class="dump-narr">
                        <template v-for="(line, i) in timeline" :key="i">
                            <div :class="['dump-line', {mine: line.mine, now: line === current}]">
                                <template v-if="line.mine">{{ line.text }}</template>
                                <template v-else>
                                    <span class="dump-line-head">
                                        <span class="dump-line-title">{{ line.text }}</span>
                                        <template v-if="line === current">
                                            <span class="dump-dots">
                                                <i />
                                                <i />
                                                <i />
                                            </span>
                                        </template>
                                        <span class="dump-line-age">{{ age(line.at) }}</span>
                                    </span>
                                    <template v-if="line.detail">
                                        <span class="dump-line-detail">{{ line.detail }}</span>
                                    </template>
                                </template>
                            </div>
                        </template>
                        <template v-if="thinking">
                            <p class="dump-thinking">
                                <span class="dump-dots">
                                    <i />
                                    <i />
                                    <i />
                                </span>
                                {{ thinking }}
                            </p>
                        </template>
                    </div>
                    <template v-if="asked">
                        <div class="dump-ask">
                            <p class="dump-ask-q">{{ asked }}</p>
                            <template v-if="guesses.length">
                                <div class="dump-guesses">
                                    <template v-for="g in guesses" :key="g">
                                        <Btn small @click="answer(g)">{{ g }}</Btn>
                                    </template>
                                </div>
                            </template>
                            <DumpAnswer :placeholder="guesses.length ? 'Or say it in your own words' : 'Your answer'" :send="answer" />
                        </div>
                    </template>
                    <template v-else-if="!removed">
                        <DumpAnswer
                            :placeholder="working ? 'Ask, or paste more files' : 'Ask about what I filed'"
                            action="Send"
                            :send="say"
                            @paste="pastedMore"
                        />
                    </template>
                </aside>

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
                        <template v-for="m in shown" :key="m.ref">
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
                    <footer class="dump-foot">
                        <template v-if="confirming === 'remove'">
                            <span class="dump-confirm">
                                Remove the collection and the {{ plural(filedRows.length, "thing", "things") }} in it? What you dropped is
                                not touched.
                            </span>
                            <Btn small @click="confirming = ''">Keep it</Btn>
                            <Btn kind="danger" small @click="confirmed">Remove</Btn>
                        </template>
                        <template v-else-if="confirming === 'stop'">
                            <span class="dump-confirm">Stop filing? What is filed stays; the rest of the pile is not read.</span>
                            <Btn small @click="confirming = ''">Keep filing</Btn>
                            <Btn kind="danger" small @click="confirmed">Stop</Btn>
                        </template>
                        <template v-else>
                            <Icon name="inbox" :size="13" />
                            <span class="dump-foot-label">Collection</span>
                            <span class="dump-foot-name">{{ collection || (removed ? "Removed" : "Not named yet") }}</span>
                            <span class="dump-foot-label">· {{ plural(filedRows.length, "thing", "things") }}</span>
                            <span class="grow" />
                            <template v-if="working">
                                <Btn small @click="confirming = 'stop'">Stop filing</Btn>
                            </template>
                            <template v-if="hasCollection && !removed">
                                <Btn small :disabled="!filedRows.length && working" @click="confirming = 'remove'">
                                    Remove the collection
                                </Btn>
                            </template>
                        </template>
                    </footer>
                </div>
            </div>
        </template>

        <template v-if="draft.over">
            <div class="dump-drop">
                <div class="dump-drop-lane">
                    <Icon name="file" :size="20" />
                    <span class="dump-lane-title">Let go to add them to the pile</span>
                    <span class="dump-lane-meta">
                        {{ dump ? "they join the pile, and the agent reads them next" : "sorted by subject, filed into a new collection" }}
                    </span>
                </div>
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

.grow {
    flex: 1;
}

.dump-head {
    display: flex;
    flex: none;
    align-items: center;
    gap: 9px;
    min-height: 44px;
    padding: 6px 12px 6px 16px;
    border-bottom: 1px solid var(--border);
    color: var(--text-3);
}

.dump-head > :deep(.ico) {
    color: var(--accent-text);
}

.dump-title {
    font-size: 13px;
    color: var(--text);
    white-space: nowrap;
}

.dump-collection {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    padding: 2px 6px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
}

.dump-collection-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dump-collection :deep(.ico) {
    opacity: 0;
    transition: opacity 0.15s;
}

.dump-collection:hover {
    background: var(--hover);
    color: var(--text);
}

.dump-collection:hover :deep(.ico) {
    opacity: 1;
}

.dump-rename {
    max-width: 360px;
}

.dump-pill {
    flex: none;
    height: 20px;
    padding: 0 8px;
    border-radius: 10px;
    background: var(--sel);
    font-size: 11px;
    line-height: 20px;
    color: var(--text-2);
}

.dump-pill.live {
    background: var(--accent-dim);
    color: var(--accent-text);
}

.dump-pill.done {
    background: color-mix(in srgb, var(--tone-good) 14%, transparent);
    color: var(--tone-good);
}

.dump-pill.needs {
    background: color-mix(in srgb, var(--tone-warn) 14%, transparent);
    color: var(--tone-warn);
}

.dump-eyebrow {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text-4);
}

.dump-start {
    position: relative;
    display: grid;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    place-items: center;
}

.dump-start-panel {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: min(620px, calc(100% - 40px));
    padding: 24px 0;
}

.dump-prompt {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.012em;
    color: var(--text);
}

.dump-compose {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px 12px 10px 14px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
    transition:
        border-color 0.2s,
        box-shadow 0.2s;
}

.dump-compose:focus-within,
.dump-compose.lit {
    border-color: color-mix(in srgb, var(--accent) 60%, var(--border-2));
}

.dump-compose.lit {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 16%, transparent);
}

.dump-compose textarea {
    width: 100%;
    min-height: 22px;
    padding: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--text);
    font: inherit;
    font-size: 14px;
    line-height: 1.5;
    resize: none;
}

.dump-compose textarea::placeholder {
    color: var(--text-4);
}

.dump-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.dump-add {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 4px 6px;
    border-radius: 6px;
    color: var(--text-3);
    font-size: 12.5px;
    cursor: pointer;
}

.dump-add-more {
    align-self: flex-start;
    margin: -2px 0 0 -6px;
}

.dump-add:hover {
    color: var(--text);
}

.dump-error {
    font-size: 12px;
    color: var(--danger);
}

.dump-lane,
.dump-drop-lane {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 118px;
    border: 1px dashed var(--border-3);
    border-radius: 12px;
    color: var(--text-3);
    cursor: pointer;
    transition:
        border-color 0.2s,
        background 0.2s;
}

.dump-lane:hover {
    border-color: var(--text-4);
    background: color-mix(in srgb, var(--text) 2%, transparent);
}

.dump-lane-title {
    font-size: 13px;
    color: var(--text-2);
}

.dump-lane-meta {
    font: 11px var(--mono);
    color: var(--text-4);
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

.dump-drop-lane {
    width: min(560px, 86%);
    height: 160px;
    border: 1.5px dashed var(--accent);
    background: color-mix(in srgb, var(--accent) 9%, transparent);
    color: var(--accent-text);
}

.dump-drop-lane .dump-lane-title {
    color: var(--text);
}

.dump-drop-lane .dump-lane-meta {
    color: var(--accent-text);
}

.dump-context {
    margin: 0;
    font-size: 13px;
    color: var(--text-3);
    text-wrap: pretty;
}

.dump-earlier {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.dump-earlier .dump-eyebrow {
    padding: 0 8px 4px;
}

.dump-earlier-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 8px;
    border: 0;
    border-radius: 7px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
}

.dump-earlier-row:hover {
    background: var(--hover);
    color: var(--text);
}

.dump-earlier-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dump-work {
    display: grid;
    flex: 1;
    grid-template-columns: 262px minmax(0, 1fr);
    min-height: 0;
}

.dump-rail {
    display: flex;
    flex-direction: column;
    gap: 9px;
    min-height: 0;
    padding: 16px 16px 14px 18px;
    overflow: hidden;
    border-right: 1px solid var(--border);
}

.dump-pile {
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 7px;
    max-height: 45%;
    overflow-y: auto;
}

.dump-narr {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 14px;
    min-height: 0;
    padding-right: 2px;
    overflow-y: auto;
    scrollbar-width: thin;
}

.dump-line {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 12.5px;
    line-height: 1.5;
    color: var(--text-3);
}

.dump-line-head {
    display: flex;
    align-items: baseline;
    gap: 8px;
}

.dump-line-title {
    flex: 1;
    min-width: 0;
    font-weight: 500;
    color: var(--text-2);
}

.dump-line.now .dump-line-title {
    color: var(--text);
}

.dump-line-age {
    flex: none;
    font: 10.5px var(--mono);
    color: var(--text-4);
}

.dump-line-detail {
    color: var(--text-3);
    text-wrap: pretty;
}

.dump-line.mine {
    align-self: flex-end;
    max-width: 88%;
    padding: 6px 10px;
    border-radius: 12px 12px 4px 12px;
    background: var(--sel);
    color: var(--text);
}

.dump-thinking {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 12.5px;
    color: var(--text-3);
}

.dump-dots {
    display: inline-flex;
    gap: 3px;
}

.dump-dots i {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--accent-text);
    opacity: 0.5;
    animation: dump-dot 1.2s ease-in-out infinite;
}

.dump-dots i:nth-child(2) {
    animation-delay: 0.15s;
}

.dump-dots i:nth-child(3) {
    animation-delay: 0.3s;
}

.dump-ask {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px;
    border: 1px solid color-mix(in srgb, var(--tone-warn) 35%, transparent);
    border-radius: 10px;
    background: color-mix(in srgb, var(--tone-warn) 6%, transparent);
}

.dump-ask-q {
    margin: 0;
    font-size: 13px;
    color: var(--text);
}

.dump-guesses {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
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

.dump-foot {
    display: flex;
    flex: none;
    align-items: center;
    gap: 8px;
    min-height: 52px;
    padding: 10px 20px;
    border-top: 1px solid var(--border);
    color: var(--text-3);
}

.dump-foot > :deep(.ico) {
    color: var(--accent-text);
}

.dump-foot-label {
    font-size: 12.5px;
    white-space: nowrap;
}

.dump-foot-name {
    min-width: 0;
    overflow: hidden;
    font-size: 13px;
    color: var(--text);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dump-confirm {
    flex: 1;
    font-size: 12.5px;
    color: var(--text-2);
}

@keyframes dump-dot {
    50% {
        opacity: 1;
        translate: 0 -2px;
    }
}

@container (max-width: 640px) {
    .dump-work {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: auto minmax(0, 1fr);
    }

    .dump-rail {
        max-height: 42cqh;
        border-right: 0;
        border-bottom: 1px solid var(--border);
    }

    .dump-pile {
        flex-direction: row;
        max-height: none;
        overflow-x: auto;
    }

    .dump-pile > * {
        flex: 0 0 200px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .dump-dots i {
        animation: none;
    }
}
</style>

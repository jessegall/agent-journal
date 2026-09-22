<script setup>
import TextDisplay from "../kit/TextDisplay.vue";
import {computed, reactive, ref, watch} from "vue";
import {api} from "../api/client.js";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";
import Icon from "../kit/Icon.vue";
import Btn from "../kit/Btn.vue";
import Spinner from "../kit/Spinner.vue";
import OptionList from "../kit/OptionList.vue";
import {age} from "../format/time.js";
import {useNow} from "../composables/now.js";

const draft = reactive({text: "", files: [], sending: false, error: "", over: false});
const more = reactive({open: false, text: "", files: [], sending: false, error: ""});
const reply = reactive({text: "", sending: false});
const chosen = ref(0);
const composing = ref(false);
const switching = ref(false);
const stopping = ref(false);
const opened = ref("");

const joined = (d) => d.data?.queued_at || d.created;
const open = computed(() =>
    rows("dump")
        .filter((d) => !d.deleted && !d.completed)
        .sort((a, b) => joined(b) - joined(a) || b.n - a.n)
);
const inHand = computed(() => open.value[open.value.length - 1] || null);
const unconfirmed = computed(() =>
    rows("dump")
        .filter((d) => !d.deleted && d.completed && !d.data?.confirmed)
        .sort((a, b) => b.n - a.n)
);
const dump = computed(() =>
    composing.value ? null : rows("dump").find((d) => d.n === chosen.value) || inHand.value || unconfirmed.value[0] || null
);
watch(
    dump,
    (d) => {
        if (d && !chosen.value) chosen.value = d.n;
    },
    {immediate: true}
);
watch(chosen, () => {
    opened.value = "";
    stopping.value = false;
    more.open = false;
});

const label = (name) => (name === "text" ? "Pasted text" : name.startsWith("added-") ? "Added note" : name);
const names = (d) => [...(d.brief?.trim() ? d.data?.parts || ["text"] : []), ...Object.keys(d.data?.files || {}).sort()];
const ITEM_STATES = {waiting: "waiting", reading: "reading", filed: "filed", failed: "not filed"};
const items = computed(() =>
    dump.value
        ? names(dump.value).map((name) => {
              const item = (dump.value.data.items || {})[name] || {};
              const state = item.failed ? "failed" : item.outcome ? "filed" : item.insight ? "reading" : "waiting";
              return {name, state, note: item.failed || item.outcome || item.insight || "", refs: item.refs || []};
          })
        : []
);
const settled = computed(() => items.value.filter((i) => i.state === "filed" || i.state === "failed").length);
const filed = computed(() => items.value.filter((i) => i.state === "filed").length);
const working = computed(() => Boolean(dump.value && !dump.value.completed));
const queued = computed(() => Boolean(working.value && inHand.value && inHand.value.n !== dump.value.n));
const log = computed(() => dump.value?.data?.log || []);
const latest = computed(() => log.value[log.value.length - 1] || null);
const started = computed(() => Boolean(log.value.length || items.value.some((i) => i.state !== "waiting")));
const asked = computed(() => (working.value && dump.value.data?.question?.text) || "");
const guesses = computed(() => (asked.value && dump.value.data.question.guesses) || []);

const now = useNow(3000);
const QUIET_AFTER = 180;
const OFFERING_FOR = 60;
const quietFor = computed(() => (working.value && started.value && !queued.value ? now.value - (dump.value.updated || 0) : 0));
const quiet = computed(() => quietFor.value > QUIET_AFTER && !asked.value);

const confirmed = computed(() => Boolean(dump.value?.data?.confirmed));
const stopped = computed(() => Boolean(dump.value?.data?.stopped));
const options = computed(() => dump.value?.data?.options || []);
const choice = computed(() => dump.value?.data?.chosen || {});
const leftOut = computed(() => dump.value?.data?.left_out || {});
const offering = computed(() =>
    Boolean(
        dump.value?.completed &&
        !stopped.value &&
        !confirmed.value &&
        !options.value.length &&
        now.value - dump.value.completed < OFFERING_FOR
    )
);
const added = computed(() => Boolean(dump.value?.completed && confirmed.value));
const choosing = computed(() => Boolean(dump.value?.completed && !stopped.value && !added.value && !offering.value));

const phase = computed(() => {
    if (!dump.value) return "";
    if (added.value) return "added";
    if (stopped.value) return "stopped";
    if (offering.value) return "offering";
    if (choosing.value) return "choosing";
    if (queued.value) return "queued";
    if (asked.value) return "asking";
    if (quiet.value) return "quiet";
    return started.value ? "filing" : "waiting";
});
const PILLS = {
    added: "Added",
    stopped: "Stopped",
    offering: "Filing",
    choosing: "Filed",
    queued: "Queued",
    asking: "Needs you",
    quiet: "Quiet",
    filing: "Filing",
    waiting: "Filing",
};
const TONES = {
    added: "done",
    stopped: "stopped",
    offering: "live",
    choosing: "done",
    queued: "idle",
    asking: "needs",
    quiet: "needs",
    filing: "live",
    waiting: "live",
};
const BAND_ICONS = {asking: "help", quiet: "clock", queued: "clock", stopped: "close", added: "check", choosing: "check"};

const filedRefs = computed(() => [...new Set(items.value.flatMap((i) => i.refs))]);
const writing = computed(() => (working.value && latest.value?.on && !filedRefs.value.includes(latest.value.on) ? latest.value.on : ""));
const making = computed(() => (working.value && !asked.value && latest.value?.making) || "");
const drafts = reactive({});
const madeRefs = computed(() =>
    [...filedRefs.value, ...(writing.value ? [writing.value] : [])].filter((ref) => !ref.startsWith("collection:"))
);
const typeOf = (type) => store.spec?.types?.[type] || {};
const madeFrom = (ref) => {
    const from = items.value.find((i) => i.refs.includes(ref));
    return from ? `Made from ${label(from.name)}` : "Made from the whole dump";
};
const made = computed(() =>
    madeRefs.value
        .map((ref) => {
            const [type, n] = ref.split(":");
            const row = rows(type).find((r) => r.n === Number(n)) || drafts[ref];
            return {ref, type, n: Number(n), row, writing: ref === writing.value, left: ref in leftOut.value, from: madeFrom(ref)};
        })
        .filter((m) => !m.row?.deleted)
);
const kept = computed(() => made.value.filter((m) => !m.left));

async function fetchDrafts() {
    for (const ref of madeRefs.value) {
        const [type, n] = ref.split(":");
        if (rows(type).some((r) => r.n === Number(n))) continue;
        try {
            drafts[ref] = await api.show(type, Number(n));
        } catch {
            delete drafts[ref];
        }
    }
}
watch([madeRefs, now], fetchDrafts, {immediate: true});

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const kindOf = (type, n) => {
    const title = (typeOf(type).title || type).toLowerCase();
    return n === 1 ? title : `${title}s`;
};
const summary = computed(() => {
    const by = {};
    for (const m of kept.value) (by[m.type] = by[m.type] || []).push(`${m.type} ${m.n}`);
    const lines = Object.entries(by).map(([type, refs]) => ({
        label: `${refs.length} ${kindOf(type, refs.length)}`,
        value: refs.join(", "),
    }));
    const gone = Object.values(leftOut.value);
    return gone.length ? [...lines, {label: `${gone.length} left out`, value: gone.join(", "), dim: true}] : lines;
});

const band = computed(() => {
    const total = items.value.length;
    switch (phase.value) {
        case "asking":
            return {text: asked.value};
        case "quiet":
            return {
                text: `No update for ${Math.round(quietFor.value / 60)} min. The agent may be busy elsewhere.`,
                note: latest.value ? `Last thing it said: ${latest.value.text}. Filing carries on without this page open.` : "",
            };
        case "queued":
            return {
                text: `Waiting in line. Dump ${inHand.value.n} is being filed first.`,
                note: "One dump is worked at a time. Nothing here is read yet.",
            };
        case "stopped":
            return {
                text: `Stopped. ${filed.value} of ${total} items were filed; ${total - filed.value} were left out.`,
                note: kept.value.length ? "What it did make is still below and can still be added." : "",
            };
        case "added":
            return {
                text: kept.value.length
                    ? `Done. ${plural(kept.value.length, "thing is", "things are")} in the journal now.`
                    : "Done. Nothing was added to the journal.",
                note: !choice.value.label
                    ? ""
                    : choice.value.pick < 0
                      ? "You left it to the agent. It is finishing on its own."
                      : `You chose: ${choice.value.label}. The agent is on it now.`,
            };
        case "choosing":
            return {
                text: `${filed.value < total ? `${filed.value} of ${total} items` : total === 1 ? "The item is" : `All ${total} items`} filed. ${plural(kept.value.length, "thing", "things")} made.`,
                note: "None of it is in the journal yet. Pick what happens next and it all goes in at once.",
            };
        case "offering":
            return {text: "Filed. Working out what could come next…"};
        case "waiting":
            return {text: "Sent. Waiting for the agent to pick this up."};
        default:
            return {
                text: latest.value?.text || "Reading what you dropped",
                detail: latest.value?.detail || "",
                age: latest.value ? age(latest.value.at) : "",
            };
    }
});
const spinning = computed(() => ["filing", "offering", "waiting"].includes(phase.value));
const trail = computed(() => (["filing", "offering"].includes(phase.value) ? log.value.slice(-4, -1).reverse() : []));
const progress = computed(() => (items.value.length ? settled.value / items.value.length : 0));

async function act(action, body = {}) {
    return api.act("dump", dump.value.n, action, body);
}

async function answer(text) {
    if (!text.trim()) return;
    reply.sending = true;
    try {
        await act("answer", {text: text.trim()});
        reply.text = "";
    } finally {
        reply.sending = false;
    }
}

function attach(into, list) {
    into.files = [...into.files, ...Array.from(list || [])];
}

function pastedInto(into, e) {
    const files = Array.from(e.clipboardData?.files || []);
    if (!files.length) return;
    e.preventDefault();
    attach(into, files);
}

function dropFiles(into, e) {
    draft.over = false;
    attach(into, e.dataTransfer?.files);
}

const composeFoot = computed(() => {
    const text = draft.text.trim();
    const count = draft.files.length;
    if (!text && !count)
        return "The agent works out what each thing is and files it: docs, plans, to-dos. You only get asked if it truly can't tell.";
    if (!count) return "Just text. The agent will split it itself.";
    return `${plural(count, "file", "files")}${text ? " and some text. The agent will split the text itself." : ". The agent will work out what they are."}`;
});

async function send() {
    const text = draft.text.trim();
    if (!text && !draft.files.length) return;
    draft.sending = true;
    draft.error = "";
    try {
        const row = await api.create("dump", text ? {brief: text} : {title: draft.files[0].name.slice(0, 80), brief: ""});
        for (const file of draft.files) await api.upload("dump", row.n, file);
        Object.assign(draft, {text: "", files: []});
        chosen.value = row.n;
        composing.value = false;
    } catch (e) {
        draft.error = e.message;
    } finally {
        draft.sending = false;
    }
}

async function addMore() {
    const text = more.text.trim();
    if (!text && !more.files.length) return;
    more.sending = true;
    more.error = "";
    try {
        const n = dump.value.n;
        if (dump.value.completed) await act("reopen", {why: "more was added"});
        const files = [...(text ? [new File([text], `added-${Date.now()}.md`, {type: "text/markdown"})] : []), ...more.files];
        for (const file of files) await api.upload("dump", n, file);
        Object.assign(more, {text: "", files: [], open: false});
    } catch (e) {
        more.error = e.message;
    } finally {
        more.sending = false;
    }
}

async function stop() {
    await act("stop");
    stopping.value = false;
}

const steps = computed(() => [
    ...options.value.map((o) => ({title: o.label})),
    {title: "You decide", description: "The agent finishes everything on its own"},
]);
const foot = computed(() => {
    if (phase.value === "choosing") return {text: `${plural(kept.value.length, "thing goes", "things go")} in`};
    if (working.value) return {text: queued.value ? "Take out of the queue" : "Stop filing", run: () => (stopping.value = true)};
    return {text: "New dump", run: () => (composing.value = true)};
});

const others = computed(() =>
    rows("dump")
        .filter((d) => !d.deleted && (!d.completed || !d.data?.confirmed || d.n === dump.value?.n))
        .sort((a, b) => b.n - a.n)
);
const switchable = computed(() => others.value.length > 1 || (!dump.value && others.value.length > 0));

function pillOf(d) {
    if (d.completed) return d.data?.confirmed ? "added" : d.data?.stopped ? "stopped" : "choosing";
    if (inHand.value?.n !== d.n) return "queued";
    return d.data?.question?.text ? "asking" : "filing";
}

function pick(n) {
    chosen.value = n;
    composing.value = false;
    switching.value = false;
}

function fresh() {
    composing.value = true;
    switching.value = false;
}

function toggle(m) {
    if (m.writing || m.left || !m.row) return;
    opened.value = opened.value === m.ref ? "" : m.ref;
}

function leave(m) {
    opened.value = "";
    act("leave", {ref: m.ref});
}
</script>

<template>
    <section class="dump">
        <header class="dump-head">
            <Icon name="inbox" :size="14" />
            <span class="dump-switch">
                <button type="button" class="dump-title" :disabled="!switchable" @click="switching = !switching">
                    <span class="dump-title-text">{{ dump ? `Dump ${dump.n} · ${dump.title}` : "New dump" }}</span>
                    <template v-if="switchable">
                        <Icon name="down" :size="12" />
                    </template>
                </button>
                <template v-if="switching">
                    <div class="dump-menu">
                        <button
                            v-for="d in others"
                            :key="d.n"
                            type="button"
                            :class="['dump-menu-row', {current: d.n === dump?.n}]"
                            @click="pick(d.n)"
                        >
                            <span class="dump-menu-title">Dump {{ d.n }} · {{ d.title }}</span>
                            <span :class="['dump-pill', TONES[pillOf(d)]]">{{ PILLS[pillOf(d)] }}</span>
                        </button>
                        <span class="dump-menu-rule" />
                        <button type="button" class="dump-menu-row" @click="fresh">
                            <Icon name="plus" :size="12" />
                            New dump
                        </button>
                    </div>
                </template>
            </span>
            <template v-if="phase">
                <span :class="['dump-pill', TONES[phase]]">{{ PILLS[phase] }}</span>
            </template>
            <span class="grow" />
            <template v-if="dump">
                <button type="button" class="dump-square" title="Start a new dump" @click="fresh">
                    <Icon name="plus" :size="12" />
                </button>
            </template>
            <Btn small @click="store.dumping = false">Back to chat</Btn>
        </header>

        <template v-if="!dump">
            <div class="dump-compose">
                <div
                    :class="['dump-drop', {over: draft.over, ready: draft.text.trim() || draft.files.length}]"
                    @dragover.prevent="draft.over = true"
                    @dragleave="draft.over = false"
                    @drop.prevent="dropFiles(draft, $event)"
                >
                    <textarea
                        v-model="draft.text"
                        placeholder="Paste anything: a transcript, notes, a chat, links. Drop files anywhere in this box."
                        @paste="pastedInto(draft, $event)"
                    />
                    <template v-if="draft.files.length">
                        <div class="dump-files">
                            <span v-for="(file, i) in draft.files" :key="file.name + i" class="dump-file">
                                <Icon name="paperclip" :size="12" />
                                {{ file.name }}
                                <button type="button" class="dump-x" title="Leave this file out" @click="draft.files.splice(i, 1)">
                                    ×
                                </button>
                            </span>
                        </div>
                    </template>
                    <div class="dump-row">
                        <label class="dump-quiet">
                            <Icon name="paperclip" :size="13" />
                            Add files
                            <input type="file" multiple hidden @change="attach(draft, $event.target.files)" />
                        </label>
                        <span class="grow" />
                        <template v-if="draft.error">
                            <span class="dump-error">{{ draft.error }}</span>
                        </template>
                        <Btn kind="primary" small :disabled="draft.sending || (!draft.text.trim() && !draft.files.length)" @click="send">
                            {{ draft.sending ? "Dumping…" : "Dump" }}
                        </Btn>
                    </div>
                </div>
                <p class="dump-compose-foot">{{ composeFoot }}</p>
            </div>
        </template>

        <template v-else>
            <div class="dump-body">
                <div :class="['dump-band', TONES[phase]]">
                    <div class="dump-band-line">
                        <template v-if="spinning">
                            <Spinner />
                        </template>
                        <template v-else>
                            <span :class="['dump-band-icon', TONES[phase]]">
                                <Icon :name="BAND_ICONS[phase]" :size="14" />
                            </span>
                        </template>
                        <Transition name="dump-fade" mode="out-in">
                            <span :key="band.text" class="dump-band-text">{{ band.text }}</span>
                        </Transition>
                        <template v-if="band.age">
                            <span class="dump-band-age">{{ band.age }}</span>
                        </template>
                    </div>
                    <template v-if="band.detail">
                        <p class="dump-band-detail">{{ band.detail }}</p>
                    </template>
                    <template v-if="band.note">
                        <p class="dump-band-note">{{ band.note }}</p>
                    </template>
                    <template v-if="trail.length">
                        <TransitionGroup name="dump-fade" tag="div" class="dump-trail">
                            <span v-for="entry in trail" :key="entry.at">
                                {{ entry.detail ? `${entry.text} · ${entry.detail}` : entry.text }}
                            </span>
                        </TransitionGroup>
                    </template>
                    <template v-if="phase === 'asking'">
                        <div class="dump-ask">
                            <template v-if="guesses.length">
                                <div class="dump-chips">
                                    <button
                                        v-for="guess in guesses"
                                        :key="guess"
                                        type="button"
                                        class="dump-chip"
                                        :disabled="reply.sending"
                                        @click="answer(guess)"
                                    >
                                        {{ guess }}
                                    </button>
                                </div>
                            </template>
                            <div class="dump-answer">
                                <textarea
                                    v-model="reply.text"
                                    rows="1"
                                    :placeholder="guesses.length ? 'Or say it in your own words' : 'Your answer'"
                                    @keydown.enter.exact.prevent="answer(reply.text)"
                                />
                                <Btn kind="primary" small :disabled="reply.sending || !reply.text.trim()" @click="answer(reply.text)">
                                    Answer
                                </Btn>
                            </div>
                        </div>
                    </template>
                    <template v-if="phase === 'choosing'">
                        <OptionList
                            class="dump-steps"
                            :options="steps"
                            color="var(--created)"
                            @pick="(i) => act('choose', {pick: i === options.length ? -1 : i})"
                        />
                    </template>
                    <template v-if="phase === 'offering'">
                        <div class="dump-steps">
                            <span v-for="i in 3" :key="i" class="dump-step-ghost" />
                        </div>
                    </template>
                    <template v-if="phase === 'stopped' && kept.length">
                        <div class="dump-steps">
                            <button type="button" class="dump-step primary" @click="act('confirm')">
                                Add {{ plural(kept.length, "thing", "things") }} to the journal
                            </button>
                        </div>
                    </template>
                    <template v-if="phase === 'quiet'">
                        <div class="dump-row indent">
                            <Btn small @click="store.dumping = false">Back to chat</Btn>
                        </div>
                    </template>
                    <template v-if="!['added', 'queued', 'choosing'].includes(phase)">
                        <div class="dump-progress">
                            <span class="dump-track">
                                <span class="dump-fill" :style="{width: `${Math.max(progress, 0.04) * 100}%`}" />
                            </span>
                            <span class="dump-count">{{ settled }} of {{ items.length }} filed</span>
                        </div>
                    </template>
                </div>

                <template v-if="stopping">
                    <div class="dump-confirm">
                        <span>
                            {{
                                queued
                                    ? "Take this dump out of the queue? Nothing in it gets filed."
                                    : `Stop now? ${plural(items.length - settled, "item has", "items have")} not been read yet and will be left out.`
                            }}
                        </span>
                        <div class="dump-row">
                            <span class="grow" />
                            <Btn small @click="stopping = false">{{ queued ? "Keep it queued" : "Keep filing" }}</Btn>
                            <button type="button" class="dump-danger" @click="stop">{{ queued ? "Remove" : "Stop" }}</button>
                        </div>
                    </div>
                </template>

                <div class="dump-columns">
                    <div class="dump-made">
                        <template v-if="made.length || making">
                            <div class="dump-section">
                                <div class="dump-heading">
                                    <span>{{ working || phase === "offering" ? "Made so far" : "Made" }} · {{ kept.length }}</span>
                                    <span class="grow" />
                                    <template v-if="!added">
                                        <span class="dump-hint">Click a row to look inside</span>
                                    </template>
                                </div>
                                <TransitionGroup name="dump-pop" tag="div" class="dump-rows">
                                    <div
                                        v-for="m in made"
                                        :key="m.ref"
                                        :class="['dump-made-row', {writing: m.writing, open: opened === m.ref, left: m.left}]"
                                    >
                                        <template v-if="m.writing">
                                            <span class="dump-shimmer" />
                                        </template>
                                        <button type="button" class="dump-made-head" @click="toggle(m)">
                                            <span class="dump-made-icon"><Icon :name="typeOf(m.type).icon || 'file'" :size="12" /></span>
                                            <span class="dump-made-text">
                                                <span class="dump-made-title">{{ m.row?.title || `${m.type} ${m.n}` }}</span>
                                                <template v-if="m.row?.abstract">
                                                    <TextDisplay inline class="dump-made-line" :text="m.row.abstract" />
                                                </template>
                                            </span>
                                            <template v-if="!m.left">
                                                <span class="dump-tag">{{ m.type }} {{ m.n }}</span>
                                            </template>
                                        </button>
                                        <template v-if="m.left">
                                            <button type="button" class="dump-put-back" @click="act('keep', {ref: m.ref})">
                                                Left out · Put back
                                            </button>
                                        </template>
                                        <template v-if="opened === m.ref && m.row">
                                            <div class="dump-made-open">
                                                <template v-if="m.row.brief">
                                                    <TextDisplay class="dump-lead" :text="m.row.brief" />
                                                </template>
                                                <div v-for="s in m.row.sections || []" :key="s.title" class="dump-part">
                                                    <span class="dump-part-label">{{ s.title }}</span>
                                                    <span class="dump-part-text">{{ s.body }}</span>
                                                </div>
                                                <div class="dump-row">
                                                    <span class="dump-from">{{ m.from }}</span>
                                                    <span class="grow" />
                                                    <template v-if="!added">
                                                        <button
                                                            type="button"
                                                            class="dump-small leave"
                                                            title="Drop this and keep it out of the journal"
                                                            @click="leave(m)"
                                                        >
                                                            Leave out
                                                        </button>
                                                    </template>
                                                    <button type="button" class="dump-small" @click="opened = ''">Close</button>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                    <template v-if="making">
                                        <div key="making" class="dump-made-row writing">
                                            <span class="dump-shimmer" />
                                            <span class="dump-made-head">
                                                <span class="dump-made-icon" />
                                                <span class="dump-made-text">
                                                    <span class="dump-made-title">Processing · {{ making }}</span>
                                                    <span class="dump-bone" />
                                                </span>
                                            </span>
                                        </div>
                                    </template>
                                </TransitionGroup>
                            </div>
                        </template>

                        <template v-if="added && summary.length">
                            <div class="dump-section">
                                <div class="dump-heading">In the journal now</div>
                                <div v-for="line in summary" :key="line.label" :class="['dump-summary-row', {dim: line.dim}]">
                                    <span class="dump-summary-label">{{ line.label }}</span>
                                    <span class="grow" />
                                    <span class="dump-summary-value">{{ line.value }}</span>
                                </div>
                            </div>
                        </template>
                    </div>

                    <template v-if="items.length && !added">
                        <div class="dump-dropped">
                            <div class="dump-heading">You dropped · {{ items.length }}</div>
                            <div v-for="item in items" :key="item.name" :class="['dump-item', item.state, {quiet}]">
                                <span class="dump-dot" />
                                <span class="dump-item-text">
                                    <span class="dump-item-head">
                                        <span class="dump-item-name">{{ label(item.name) }}</span>
                                        <span class="dump-item-state">
                                            {{ quiet && item.state === "reading" ? "was being read" : ITEM_STATES[item.state] }}
                                        </span>
                                    </span>
                                    <template v-if="item.note">
                                        <span class="dump-item-note">{{ item.note }}</span>
                                    </template>
                                </span>
                            </div>
                        </div>
                    </template>
                </div>

                <template v-if="more.open">
                    <div class="dump-more" @dragover.prevent @drop.prevent="dropFiles(more, $event)">
                        <textarea
                            v-model="more.text"
                            placeholder="Something you forgot. Paste it or drop files here."
                            @paste="pastedInto(more, $event)"
                        />
                        <template v-if="more.files.length">
                            <div class="dump-files">
                                <span v-for="(file, i) in more.files" :key="file.name + i" class="dump-file">
                                    <Icon name="paperclip" :size="12" />
                                    {{ file.name }}
                                    <button type="button" class="dump-x" title="Leave this file out" @click="more.files.splice(i, 1)">
                                        ×
                                    </button>
                                </span>
                            </div>
                        </template>
                        <div class="dump-row">
                            <label class="dump-quiet">
                                <Icon name="paperclip" :size="13" />
                                Add a file
                                <input type="file" multiple hidden @change="attach(more, $event.target.files)" />
                            </label>
                            <span class="grow" />
                            <template v-if="more.error">
                                <span class="dump-error">{{ more.error }}</span>
                            </template>
                            <Btn small @click="more.open = false">Cancel</Btn>
                            <Btn
                                kind="primary"
                                small
                                :disabled="more.sending || (!more.text.trim() && !more.files.length)"
                                @click="addMore"
                            >
                                {{ more.sending ? "Adding…" : "Add" }}
                            </Btn>
                        </div>
                    </div>
                </template>
            </div>

            <template v-if="added">
                <div class="dump-finish">
                    <button type="button" class="dump-finish-button" @click="store.dumping = false">
                        <Icon name="check" :size="14" />
                        Dump filed · Back to chat
                    </button>
                </div>
            </template>
            <footer class="dump-foot">
                <button type="button" class="dump-quiet" @click="more.open = true">
                    <Icon name="plus" :size="12" />
                    {{ added ? "Add more to this dump" : "Add more" }}
                </button>
                <span class="grow" />
                <button type="button" :class="['dump-foot-right', {still: !foot.run}]" :disabled="!foot.run" @click="foot.run?.()">
                    {{ foot.text }}
                </button>
            </footer>
        </template>
    </section>
</template>

<style scoped>
.dump {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    background: var(--bg);
}

.grow {
    flex: 1;
}

.dump-head {
    position: relative;
    display: flex;
    flex: none;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    color: var(--text-3);
}

.dump-switch {
    position: relative;
    display: flex;
    min-width: 0;
}

.dump-title {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-width: 0;
    padding: 0;
    border: none;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
}

.dump-title:disabled {
    cursor: default;
}

.dump-title:not(:disabled):hover {
    color: var(--accent-text);
}

.dump-title-text,
.dump-menu-title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.dump-menu {
    position: absolute;
    top: 28px;
    left: -24px;
    z-index: 20;
    display: flex;
    flex-direction: column;
    gap: 1px;
    width: 300px;
    padding: 4px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--raised);
    box-shadow: 0 10px 30px rgb(0 0 0 / 50%);
    animation: dump-rise 0.16s ease-out;
}

.dump-menu-row {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 6px 8px;
    border: none;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
}

.dump-menu-row .dump-menu-title {
    flex: 1;
}

.dump-menu-row:hover,
.dump-menu-row.current {
    background: var(--hover);
    color: var(--text);
}

.dump-menu-rule {
    height: 1px;
    margin: 3px 0;
    background: var(--border);
}

.dump-pill {
    flex: none;
    padding: 1px 7px;
    border-radius: 999px;
    background: var(--accent-dim);
    color: var(--accent-text);
    font-size: 11px;
    white-space: nowrap;
}

.dump-pill.done {
    background: color-mix(in srgb, var(--created) 16%, transparent);
    color: var(--created);
}

.dump-pill.needs {
    background: color-mix(in srgb, var(--blocking) 16%, transparent);
    color: var(--blocking);
}

.dump-pill.stopped {
    background: color-mix(in srgb, var(--danger) 16%, transparent);
    color: var(--danger);
}

.dump-pill.idle {
    background: var(--hover);
    color: var(--text-2);
}

.dump-square {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: transparent;
    color: var(--text-2);
    cursor: pointer;
}

.dump-square:hover {
    background: var(--hover);
}

.dump-compose {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    padding: 18px 16px 20px;
}

.dump-drop {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 12px;
    padding: 14px;
    border: 1px dashed var(--border-2);
    border-radius: 12px;
    background: var(--raised);
    transition: border-color 0.12s ease;
}

.dump-drop.over,
.dump-drop.ready {
    border: 1px solid var(--accent);
}

.dump-drop textarea {
    flex: 1;
    min-height: 180px;
}

textarea {
    border: none;
    background: transparent;
    color: var(--text);
    font: inherit;
    font-size: 14px;
    line-height: 1.55;
    resize: none;
    outline: none;
}

.dump-compose-foot {
    margin: 12px 2px 0;
    color: var(--text-4);
    font-size: 12px;
    line-height: 1.5;
}

.dump-files {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.dump-file {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text-2);
    font-size: 12px;
}

.dump-x {
    padding: 0;
    border: none;
    background: none;
    color: var(--text-4);
    cursor: pointer;
}

.dump-x:hover {
    color: var(--danger);
}

.dump-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.dump-row.indent {
    margin-left: 23px;
}

.dump-quiet {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 0;
    border: none;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12.5px;
    cursor: pointer;
}

.dump-quiet:hover {
    color: var(--text);
}

.dump-error {
    color: var(--danger);
    font-size: 12px;
}

.dump-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 16px;
    min-height: 0;
    padding: 18px 16px 22px;
    overflow-y: auto;
}

.dump-band {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px 13px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
    transition:
        border-color 0.3s ease,
        background 0.3s ease;
}

.dump-band.live {
    border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
    background: color-mix(in srgb, var(--accent) 3%, var(--raised));
}

.dump-band.needs {
    border-color: color-mix(in srgb, var(--blocking) 35%, var(--border));
    background: color-mix(in srgb, var(--blocking) 3%, var(--raised));
}

.dump-band.done {
    border-color: color-mix(in srgb, var(--created) 30%, var(--border));
}

.dump-band.stopped {
    border-color: color-mix(in srgb, var(--danger) 25%, var(--border));
    background: color-mix(in srgb, var(--danger) 3%, var(--raised));
}

.dump-band-line {
    display: flex;
    align-items: flex-start;
    gap: 9px;
}

.dump-band-line :deep(.spinner) {
    flex: none;
    margin-top: 4px;
}

.dump-band-icon {
    display: flex;
    flex: none;
    margin-top: 2px;
    color: var(--created);
}

.dump-band-icon.needs {
    color: var(--blocking);
}

.dump-band-icon.idle {
    color: var(--text-3);
}

.dump-band-icon.stopped {
    color: var(--danger);
}

.dump-band-text {
    flex: 1;
    min-width: 0;
    color: var(--text);
    font-size: 13.5px;
    font-weight: 500;
    line-height: 1.5;
}

.dump-band-age {
    flex: none;
    margin-top: 2px;
    color: var(--text-3);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
}

.dump-band-detail {
    margin: -4px 0 0 23px;
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.5;
}

.dump-finish {
    flex: none;
    padding: 12px 16px 0;
    border-top: 1px solid var(--line);
}

.dump-finish-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 38px;
    border: 1px solid var(--created);
    border-radius: 9px;
    background: color-mix(in srgb, var(--created) 16%, var(--raised));
    color: var(--text);
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
}

.dump-finish-button:hover {
    background: color-mix(in srgb, var(--created) 24%, var(--raised));
}

.dump-finish + .dump-foot {
    border-top: none;
}

.dump-band-note {
    margin: 0 0 0 23px;
    color: var(--text-3);
    font-size: 12px;
    line-height: 1.5;
}

.dump-trail {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-left: 23px;
}

.dump-trail span {
    overflow: hidden;
    color: var(--text-3);
    font-size: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.dump-trail span:nth-child(2) {
    opacity: 0.8;
}

.dump-trail span:nth-child(3) {
    opacity: 0.6;
}

.dump-ask {
    display: flex;
    flex-direction: column;
    gap: 9px;
    margin-left: 23px;
}

.dump-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.dump-chip {
    height: 24px;
    padding: 0 9px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--bg);
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.dump-chip:hover {
    border-color: var(--accent);
    color: var(--text);
}

.dump-answer {
    display: flex;
    align-items: flex-end;
    gap: 8px;
}

.dump-answer textarea {
    flex: 1;
    min-height: 34px;
    padding: 8px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    font-size: 12.5px;
}

.dump-steps {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-left: 23px;
}

.dump-step {
    padding: 7px 12px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
}

.dump-step:hover {
    border-color: var(--border-3);
    background: var(--hover);
}

.dump-step.primary {
    border-color: var(--accent);
    background: var(--accent-dim);
    color: var(--accent-text);
}

.dump-step-ghost {
    height: 31px;
    border-radius: 8px;
    background: var(--hover);
}

.dump-step-ghost:nth-child(2) {
    opacity: 0.8;
}

.dump-step-ghost:nth-child(3) {
    opacity: 0.6;
}

.dump-progress {
    display: flex;
    align-items: center;
    gap: 10px;
}

.dump-track {
    flex: 1;
    height: 3px;
    overflow: hidden;
    border-radius: 2px;
    background: var(--border);
}

.dump-fill {
    display: block;
    height: 100%;
    border-radius: 2px;
    background: var(--accent);
    transition: width 0.4s ease;
}

.dump-band.needs .dump-fill,
.dump-band.stopped .dump-fill {
    background: color-mix(in srgb, var(--accent) 45%, var(--border));
}

.dump-count {
    flex: none;
    color: var(--text-3);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
}

.dump-confirm {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px 13px;
    border: 1px solid color-mix(in srgb, var(--danger) 35%, var(--border));
    border-radius: 10px;
    background: color-mix(in srgb, var(--danger) 4%, var(--bg));
    color: var(--text);
    font-size: 13px;
    line-height: 1.5;
    animation: dump-rise 0.18s ease-out;
}

.dump-danger {
    height: 24px;
    padding: 0 9px;
    border: 1px solid var(--danger);
    border-radius: 7px;
    background: transparent;
    color: var(--danger);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.dump-danger:hover {
    background: color-mix(in srgb, var(--danger) 12%, transparent);
}

.dump-columns {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 22px;
}

.dump-made {
    display: flex;
    flex: 2 1 470px;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
}

.dump-made:empty {
    display: none;
}

.dump-dropped,
.dump-section {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.dump-dropped {
    flex: 1 1 300px;
}

.dump-heading {
    display: flex;
    align-items: baseline;
    gap: 8px;
    padding-bottom: 6px;
    color: var(--text-4);
    font-size: 10.5px;
    font-weight: 500;
    letter-spacing: 0.09em;
    text-transform: uppercase;
}

.dump-hint {
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0;
    text-transform: none;
}

.dump-rows {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.dump-made-row {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: var(--raised);
}

.dump-made-row.writing {
    border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
}

.dump-made-row.open {
    border-color: var(--border-3);
}

.dump-made-row.left .dump-made-head {
    opacity: 0.45;
    cursor: default;
}

.dump-shimmer {
    position: absolute;
    inset: 0;
    border-radius: 9px;
    background: linear-gradient(100deg, transparent 18%, color-mix(in srgb, var(--accent) 18%, transparent) 50%, transparent 82%);
    background-size: 200% 100%;
    pointer-events: none;
    animation: dump-shim 1.8s ease-in-out infinite;
}

.dump-made-head {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 40px;
    padding: 8px 10px;
    border: none;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
}

.dump-made-row.writing .dump-made-head {
    cursor: default;
}

.dump-made-icon {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 6px;
    background: var(--accent-dim);
    color: var(--accent-text);
}

.dump-made-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
    text-align: left;
}

.dump-made-title,
.dump-made-line {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.dump-made-title {
    color: var(--text);
    font-size: 12.5px;
}

.dump-made-row.writing .dump-made-title {
    color: var(--accent-text);
}

.dump-made-row.left .dump-made-title {
    text-decoration: line-through;
}

.dump-made-line {
    color: var(--text-3);
    font-size: 11.5px;
}

.dump-bone {
    display: block;
    width: 58%;
    height: 7px;
    margin-top: 3px;
    border-radius: 3px;
    background: var(--border);
}

.dump-tag {
    flex: none;
    color: var(--text-4);
    font-size: 10px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.dump-put-back {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding: 0 10px;
    border: none;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11px;
    cursor: pointer;
}

.dump-put-back:hover {
    color: var(--text);
}

.dump-made-open {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 12px 12px;
    border-top: 1px solid var(--line);
    background: var(--bg);
    animation: dump-fadein 0.2s ease-out;
}

.dump-lead,
.dump-part-text {
    display: -webkit-box;
    overflow: hidden;
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.55;
    white-space: pre-line;
    -webkit-box-orient: vertical;
}

.dump-lead {
    margin: 10px 0 0;
    -webkit-line-clamp: 6;
}

.dump-part-text {
    -webkit-line-clamp: 4;
}

.dump-part {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.dump-part-label {
    color: var(--text-4);
    font-size: 10.5px;
    letter-spacing: 0.09em;
    text-transform: uppercase;
}

.dump-from {
    min-width: 0;
    overflow: hidden;
    color: var(--text-4);
    font-size: 11.5px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.dump-small {
    height: 22px;
    padding: 0 9px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: transparent;
    color: var(--text-2);
    font: inherit;
    font-size: 11.5px;
    cursor: pointer;
}

.dump-small:hover {
    color: var(--text);
}

.dump-small.leave:hover {
    border-color: var(--danger);
    color: var(--danger);
}

.dump-summary-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 2px;
}

.dump-summary-row + .dump-summary-row,
.dump-item + .dump-item {
    border-top: 1px solid var(--line);
}

.dump-summary-label {
    color: var(--text-2);
    font-size: 12.5px;
}

.dump-summary-value {
    min-width: 0;
    overflow: hidden;
    color: var(--accent-text);
    font-size: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.dump-summary-row.dim span {
    color: var(--text-4);
}

.dump-item {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    padding: 8px 2px;
}

.dump-dot {
    flex: none;
    width: 6px;
    height: 6px;
    margin-top: 6px;
    border-radius: 50%;
    background: var(--text-4);
}

.dump-item.reading .dump-dot {
    background: var(--accent);
    animation: dump-pulse 1.4s ease-in-out infinite;
}

.dump-item.reading.quiet .dump-dot {
    background: var(--blocking);
    animation: none;
}

.dump-item.filed .dump-dot {
    background: var(--created);
}

.dump-item.failed .dump-dot {
    background: var(--danger);
}

.dump-item-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.dump-item-head {
    display: flex;
    align-items: baseline;
    gap: 8px;
}

.dump-item-name {
    overflow: hidden;
    color: var(--text);
    font-size: 12.5px;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.dump-item.waiting .dump-item-name {
    color: var(--text-2);
}

.dump-item-state {
    flex: none;
    color: var(--text-4);
    font-size: 11.5px;
}

.dump-item.reading .dump-item-state {
    color: var(--accent-text);
}

.dump-item.reading.quiet .dump-item-state {
    color: var(--blocking);
}

.dump-item.filed .dump-item-state {
    color: var(--created);
}

.dump-item-note {
    color: var(--text-3);
    font-size: 12px;
}

.dump-more {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    border: 1px dashed var(--accent);
    border-radius: 10px;
    background: var(--raised);
    animation: dump-rise 0.18s ease-out;
}

.dump-more textarea {
    min-height: 64px;
    font-size: 13px;
}

.dump-foot {
    display: flex;
    flex: none;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-top: 1px solid var(--line);
    background: var(--bg);
}

.dump-foot-right {
    padding: 0;
    border: none;
    background: none;
    color: var(--text-4);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.dump-foot-right:not(.still):hover {
    color: var(--text);
}

.dump-foot-right.still {
    cursor: default;
}

.dump-pop-enter-active {
    animation: dump-rise 0.3s cubic-bezier(0.2, 1.1, 0.4, 1);
}

.dump-fade-enter-active,
.dump-fade-leave-active {
    transition: opacity 0.2s ease;
}

.dump-fade-enter-from,
.dump-fade-leave-to {
    opacity: 0;
}

@keyframes dump-shim {
    from {
        background-position: 130% 0;
    }

    to {
        background-position: -30% 0;
    }
}

@keyframes dump-rise {
    from {
        opacity: 0;
        transform: translateY(7px) scale(0.985);
    }

    to {
        opacity: 1;
        transform: none;
    }
}

@keyframes dump-fadein {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes dump-pulse {
    50% {
        opacity: 0.28;
    }
}

@media (prefers-reduced-motion: reduce) {
    .dump-shimmer {
        display: none;
    }

    .dump-pop-enter-active,
    .dump-menu,
    .dump-more,
    .dump-confirm {
        animation: dump-fadein 0.2s ease-out;
    }

    .dump-item.reading .dump-dot {
        animation: none;
    }
}
</style>
